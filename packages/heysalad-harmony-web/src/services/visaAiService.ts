import { generateText } from './llmClient';
import { logEvent, logError } from './loggingService';

export interface VisaDocumentParams {
  employeeName: string;
  email: string;
  nationality: string;
  currentLocation: string;
  visaType: string;
  jobTitle: string;
  salary: string;
  startDate: string;
  educationLevel: string;
  yearsExperience: string;
  germanLevel: string;
}

export interface VisaDocument {
  id: string;
  title: string;
  content: string;
  type: string;
  generatedAt: string;
}

const VISA_PROMPTS = {
  jobDescription: (params: VisaDocumentParams) => `
Generate a detailed job description in both German and English for a visa application.

Position: ${params.jobTitle}
Salary: €${params.salary} per year
Location: Berlin, Germany

Include:
1. Job Title & Summary
2. Key Responsibilities (5-7 points)
3. Required Qualifications
4. Skills & Competencies
5. Work Environment

Keep it around 600 words total (both languages).
`,

  employmentContract: (params: VisaDocumentParams) => `
Generate a German employment contract (Arbeitsvertrag) for visa application.

Employee: ${params.employeeName}
Position: ${params.jobTitle}
Start Date: ${params.startDate}
Salary: €${params.salary} gross annual

Include German legal sections:
§1 Position and basics
§2 Working hours (40h/week)
§3 Salary (€${params.salary})
§4 Vacation (30 days)
§5 Probation (6 months)
§6 Notice period
§7 Location (Berlin)
§8 Confidentiality

Format as proper German legal document. Around 800 words.
`,

  employerDeclaration: (params: VisaDocumentParams) => `
Generate employer declaration (Arbeitgebererklärung) for ${params.employeeName}'s visa.

To: Ausländerbehörde Berlin
From: bereit GmbH

Confirm:
1. Job offer: ${params.jobTitle} at €${params.salary}/year
2. Start date: ${params.startDate}
3. Commitment to employment
4. Candidate qualifications
5. Why hiring from abroad is necessary
6. Company information

Formal German business letter. Around 500 words.
`,

  visaChecklist: (params: VisaDocumentParams) => `
Create visa application checklist for ${params.employeeName} applying for ${params.visaType}.

Categories:
1. Personal documents
2. Professional documents
3. Employer documents
4. Financial documents
5. Language requirements
6. Visa-specific requirements
7. Application process

Around 600 words with clear formatting.
`,

  qualificationGuide: (params: VisaDocumentParams) => `
Guide for getting ${params.educationLevel} recognized in Germany.

Include:
1. Why recognition matters
2. Recognition process (ZAB)
3. Required documents
4. Timeline and costs
5. Specific advice for ${params.jobTitle}
6. Contact information

Around 500 words.
`,

  applicationForm: (params: VisaDocumentParams) => `
Pre-filled visa application form guide for ${params.employeeName}.

Sections:
1. Personal data
2. Travel document
3. Purpose of stay (${params.visaType})
4. Employment details (${params.jobTitle} at €${params.salary})
5. Qualifications
6. Accommodation
7. Financial means
8. Previous stays

Around 500 words with clear formatting.
`,
};

export async function generateVisaDocuments(
  params: VisaDocumentParams,
  onProgress?: (progress: number, currentDoc: string) => void
): Promise<VisaDocument[]> {
  logEvent('info', 'Starting visa document generation', {
    employee: params.employeeName,
    visaType: params.visaType,
    jobTitle: params.jobTitle,
  });

  const documentTypes: Array<{ type: keyof typeof VISA_PROMPTS; title: string }> = [
    { type: 'jobDescription', title: 'Job Description (Bilingual)' },
    { type: 'employmentContract', title: 'Employment Contract (Arbeitsvertrag)' },
    { type: 'employerDeclaration', title: 'Employer Declaration' },
    { type: 'qualificationGuide', title: 'Qualification Recognition Guide' },
    { type: 'visaChecklist', title: 'Visa Application Checklist' },
    { type: 'applicationForm', title: 'Application Form Guide' },
  ];

  const documents: VisaDocument[] = [];
  const total = documentTypes.length;

  logEvent('debug', 'Visa document generation queue created', { count: total });

  for (let i = 0; i < documentTypes.length; i++) {
    const { type, title } = documentTypes[i];

    logEvent('info', 'Generating visa document', {
      index: i + 1,
      total,
      type,
      title,
    });

    if (onProgress) {
      onProgress((i / total) * 100, title);
    }

    try {
      const content = await generateText({
        systemPrompt:
          'You are an expert in German immigration law and visa applications. Generate professional, legally accurate documents.',
        userPrompt: VISA_PROMPTS[type](params),
        maxOutputTokens: 2800,
      });

      documents.push({
        id: `${type}-${Date.now()}-${i}`,
        title,
        content,
        type,
        generatedAt: new Date().toISOString(),
      });

      logEvent('info', 'Generated visa document', { type, title });

      if (onProgress) {
        onProgress(((i + 1) / total) * 100, title);
      }
    } catch (error) {
      logError('Failed to generate visa document', {
        type,
        title,
        error: error instanceof Error ? error.message : String(error),
      });

      documents.push({
        id: `${type}-${Date.now()}-${i}`,
        title,
        content: `Error: Unable to generate ${title}. Please check your AI provider credentials and try again.`,
        type,
        generatedAt: new Date().toISOString(),
      });
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  logEvent('info', 'Completed visa document generation', { generated: documents.length });
  return documents;
}
