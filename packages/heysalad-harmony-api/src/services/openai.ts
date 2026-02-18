import { Employee, Company } from '../types';

export class OpenAIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateDocument(
    type: string,
    employee: Employee,
    company: Company
  ): Promise<string> {
    const prompt = this.buildPrompt(type, employee, company);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a professional HR document generator. Generate formal, legally sound employment documents.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private buildPrompt(type: string, employee: Employee, company: Company): string {
    const employeeName = `${employee.first_name} ${employee.last_name}`;
    const startDate = employee.start_date || new Date().toISOString().split('T')[0];
    const salary = employee.salary ? `${employee.currency} ${employee.salary.toLocaleString()}` : 'TBD';

    switch (type) {
      case 'contract':
        return `Generate an employment contract for:

Company: ${company.name}
Registration: ${company.registration_number || 'N/A'}
Country: ${company.country}

Employee: ${employeeName}
Role: ${employee.role}
Department: ${employee.department || 'N/A'}
Start Date: ${startDate}
Salary: ${salary}
Email: ${employee.email || 'N/A'}

Include standard clauses for:
- Employment terms
- Compensation and benefits
- Working hours
- Confidentiality
- Termination conditions
- Governing law (${company.country})

Format as a professional legal document.`;

      case 'offer_letter':
        return `Generate an offer letter for:

Company: ${company.name}
Country: ${company.country}

Candidate: ${employeeName}
Position: ${employee.role}
Department: ${employee.department || 'N/A'}
Start Date: ${startDate}
Salary: ${salary}

Include:
- Welcome message
- Position details
- Compensation package
- Start date
- Next steps
- Acceptance deadline

Format as a warm, professional offer letter.`;

      case 'termination':
        return `Generate a termination letter for:

Company: ${company.name}
Employee: ${employeeName}
Role: ${employee.role}
End Date: ${employee.end_date || new Date().toISOString().split('T')[0]}

Include:
- Termination notice
- Final working day
- Final payment details
- Return of company property
- Exit procedures

Format as a professional, respectful termination letter.`;

      case 'amendment':
        return `Generate an employment amendment letter for:

Company: ${company.name}
Employee: ${employeeName}
Current Role: ${employee.role}

Include:
- Reference to original contract
- Changes being made
- Effective date
- All other terms remain unchanged
- Signature section

Format as a professional amendment document.`;

      default:
        throw new Error(`Unknown document type: ${type}`);
    }
  }
}
