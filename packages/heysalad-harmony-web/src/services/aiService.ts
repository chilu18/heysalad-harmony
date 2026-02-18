import { generateText } from './llmClient';
import { logEvent, logError } from './loggingService';

export interface DocumentGenerationParams {
  employeeName: string;
  role: string;
  location: string;
  startDate: string;
  department: string;
  reportingManager: string;
  language: string;
  certifications: string[];
}

export interface GeneratedDocument {
  id: string;
  title: string;
  content: string;
  type: 'welcome' | 'contract' | 'gdpr' | 'safety' | 'schedule' | 'guide';
  generatedAt: string;
}

const DOCUMENT_PROMPTS = {
  welcome: (params: DocumentGenerationParams) => `
Generate a professional welcome letter for ${params.employeeName} who is joining as ${params.role} at ${params.location} on ${params.startDate}.

Guidelines:
- Bilingual: German and English sections
- Warm and professional tone
- Include: reporting manager (${params.reportingManager}), department (${params.department})
- Express excitement about joining the team
- Mention first day logistics
- Keep under 400 words

Format as a proper business letter with date, greeting, body paragraphs, and signature.
`,

  contract: (params: DocumentGenerationParams) => `
Generate a German employment contract (Arbeitsvertrag) for:
- Name: ${params.employeeName}
- Position: ${params.role}
- Location: ${params.location}
- Start date: ${params.startDate}
- Department: ${params.department}
- Reports to: ${params.reportingManager}

Include standard German employment clauses:
1. Arbeitszeit (Working hours: 40 hours/week)
2. Probezeit (Probation: 6 months)
3. Urlaubstage (Vacation: 30 days/year)
4. Kündigungsfrist (Notice period: 4 weeks to 15th or end of month)
5. Vergütung (Compensation structure - general)
6. Sozialversicherung (Social insurance)

Ensure compliance with German labor law (BGB, ArbZG). Keep formal and legally sound. Around 600 words.
`,

  gdpr: (params: DocumentGenerationParams) => `
Generate a GDPR-compliant data protection declaration (Datenschutzerklärung) in German for employee ${params.employeeName}.

Cover:
1. What personal data is collected
2. Legal basis (DSGVO Art. 6, 88)
3. How data is processed and stored
4. Data retention periods
5. Employee rights (access, correction, deletion, portability)
6. Data security measures
7. Contact for data protection officer

Make it clear, understandable, and legally compliant. Around 500 words.
`,

  safety: (params: DocumentGenerationParams) => `
Generate a workplace safety instruction document (Arbeitssicherheit Unterweisung) in German for ${params.employeeName}, position ${params.role}, at ${params.location}.

Include:
1. General safety rules for warehouse/logistics operations
2. Personal protective equipment (PPE) requirements
3. Emergency procedures (fire, accident, evacuation)
4. Hazard communication
5. Specific requirements for: ${params.certifications.join(', ') || 'general warehouse work'}
6. Reporting procedures for unsafe conditions
7. Confirmation of understanding section
8. Compliance with DGUV regulations

Practical and clear. Around 500 words.
`,

  schedule: (params: DocumentGenerationParams) => `
Generate a detailed first week schedule for ${params.employeeName} starting as ${params.role} on ${params.startDate} at ${params.location}, reporting to ${params.reportingManager}.

Day-by-day breakdown:
Day 1 (${params.startDate}):
- 8:00-9:00: Welcome & orientation
- 9:00-10:30: HR paperwork completion
- 10:30-12:00: Facility tour
- 13:00-15:00: IT setup & system access
- 15:00-17:00: Meet team members

Day 2-5: Include training sessions for ${params.certifications.length > 0 ? params.certifications.join(', ') : 'role-specific skills'}, team introductions, safety training, gradual task introduction.

Make it welcoming, structured, and realistic. Around 400 words.
`,

  guide: (params: DocumentGenerationParams) => `
Generate a comprehensive location guide for ${params.location}.

Include:
1. Full address and directions
2. Public transportation options (S-Bahn, U-Bahn, Bus)
3. Parking information
4. Building access procedures (entry codes, badges)
5. Internal facilities: break rooms, restrooms, lockers, cafeteria
6. Nearby amenities: restaurants, cafes, banks, ATMs
7. Emergency contacts
8. Helpful tips for new employees
9. Building hours and security

Practical and welcoming. Around 450 words.
`,
};

export async function generateAllDocuments(
  params: DocumentGenerationParams,
  onProgress?: (progress: number, currentDoc: string) => void
): Promise<GeneratedDocument[]> {
  const documentTypes: Array<{ type: keyof typeof DOCUMENT_PROMPTS; title: string }> = [
    { type: 'welcome', title: 'Welcome Letter' },
    { type: 'contract', title: 'Arbeitsvertrag (Employment Contract)' },
    { type: 'gdpr', title: 'Datenschutzerklärung (GDPR)' },
    { type: 'safety', title: 'Arbeitssicherheit (Safety Instructions)' },
    { type: 'schedule', title: 'First Week Schedule' },
    { type: 'guide', title: 'Location Guide' },
  ];

  const documents: GeneratedDocument[] = [];
  const total = documentTypes.length;

  for (let i = 0; i < documentTypes.length; i++) {
    const { type, title } = documentTypes[i];

    if (onProgress) {
      onProgress((i / total) * 100, title);
    }

    try {
      logEvent('info', 'Generating onboarding document', {
        type,
        title,
        employee: params.employeeName,
        role: params.role,
      });

      const content = await generateText({
        systemPrompt:
          'You are an expert HR document generator specializing in German employment law and logistics operations onboarding. Generate professional, legally compliant documents. Use proper formatting with headers, sections, and paragraphs.',
        userPrompt: DOCUMENT_PROMPTS[type](params),
        maxOutputTokens: type === 'contract' ? 2500 : 2000,
      });

      documents.push({
        id: `${type}-${Date.now()}-${i}`,
        title,
        content,
        type,
        generatedAt: new Date().toISOString(),
      });
      logEvent('info', 'Generated onboarding document', { type, title });

      if (onProgress) {
        onProgress(((i + 1) / total) * 100, title);
      }
    } catch (error) {
      logError('Failed to generate onboarding document', {
        type,
        title,
        error: error instanceof Error ? error.message : String(error),
      });
      documents.push({
        id: `${type}-${Date.now()}-${i}`,
        title,
        content: `Error: Unable to generate ${title}. Please verify your AI provider credentials and try again.`,
        type,
        generatedAt: new Date().toISOString(),
      });
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return documents;
}
