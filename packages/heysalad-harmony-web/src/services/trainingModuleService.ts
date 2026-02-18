import { generateText } from './llmClient';
import { logError, logEvent } from './loggingService';
import { TrainingProgram } from './trainingService';
import { synthesizeSpeech, elevenLabsConfigured, TextToSpeechOptions } from './voiceService';

export interface TrainingModuleGenerationOptions {
  learnerName?: string;
  learnerRole?: string;
  certifications?: string[];
  includeAudio?: boolean;
  voiceOptions?: TextToSpeechOptions;
}

export interface GeneratedTrainingModule {
  script: string;
  audioBlob?: Blob;
}

const buildModulePrompt = (
  program: TrainingProgram,
  options: TrainingModuleGenerationOptions
): string => {
  const learnerDescriptor = options.learnerName
    ? `${options.learnerName}${options.learnerRole ? ` (${options.learnerRole})` : ''}`
    : options.learnerRole ?? 'warehouse onboarding specialist';

  const certificationLine =
    options.certifications && options.certifications.length > 0
      ? `The learner must focus on the following certifications or compliance outcomes: ${options.certifications.join(', ')}.`
      : 'Highlight the most critical safety and compliance checkpoints for this equipment.';

  return `
Create a detailed training module outline for ${learnerDescriptor}.

Program: ${program.title}
Segment: ${program.segment}
Category: ${program.categoryLabel}
Duration window: ${program.durationDaysMin}-${program.durationDaysMax} days

Topics to cover:
${program.topics.map((topic, index) => `${index + 1}. ${topic}`).join('\n')}

${certificationLine}

Output requirements:
- Present as a ready-to-read script suitable for narration (first-person guidance)
- Start with a short hook, then cover three learning segments, each ending with a reflective question
- Include actionable steps, safety callouts, and contextual examples for BEUMER equipment
- Conclude with a concise recap and a knowledge-check question
- Use friendly yet authoritative tone, avoid bullet lists except for knowledge check
- Keep total length around 550-650 words
`;
};

export const generateTrainingModule = async (
  program: TrainingProgram,
  options: TrainingModuleGenerationOptions = {}
): Promise<GeneratedTrainingModule> => {
  logEvent('info', 'Generating training module script', {
    programId: program.id,
    programTitle: program.title,
    includeAudio: options.includeAudio ?? true
  });

  try {
    const script = await generateText({
      systemPrompt:
        'You are an experienced BEUMER Group training designer. Craft engaging, precise, safety-aware training scripts for frontline logistics, operations, and HR teams.',
      userPrompt: buildModulePrompt(program, options),
      maxOutputTokens: 1800,
      temperature: 0.65
    });

    logEvent('info', 'Generated training module script', {
      programId: program.id,
      scriptLength: script.length
    });

    let audioBlob: Blob | undefined;
    const shouldIncludeAudio = options.includeAudio ?? true;

    if (shouldIncludeAudio && elevenLabsConfigured) {
      try {
        audioBlob = await synthesizeSpeech(script, options.voiceOptions);
      } catch (audioError) {
        logError('Failed to generate training module audio', {
          programId: program.id,
          error: audioError instanceof Error ? audioError.message : String(audioError)
        });
      }
    }

    return { script: script.trim(), audioBlob };
  } catch (error) {
    logError('Failed to generate training module', {
      programId: program.id,
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};
