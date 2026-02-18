import OpenAI from 'openai';

type AiProvider = 'openai' | 'deepseek' | 'anthropic' | 'gemini' | 'qwen';

interface GenerateTextArgs {
  userPrompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxOutputTokens?: number;
  providerOverride?: AiProvider;
}

const SUPPORTED_PROVIDERS: AiProvider[] = ['openai', 'deepseek', 'anthropic', 'gemini', 'qwen'];

const envDefaultProvider = normalizeProvider(import.meta.env.VITE_AI_PROVIDER);
const DEFAULT_PROVIDER: AiProvider = envDefaultProvider ?? 'openai';
const PROVIDER_PRIORITY = deriveProviderPriority(
  import.meta.env.VITE_AI_PROVIDER_PRIORITY ?? import.meta.env.VITE_AI_PROVIDER,
);

const MODEL_DEFAULTS: Record<AiProvider, string> = {
  openai: import.meta.env.VITE_OPENAI_MODEL ?? 'gpt-5',
  deepseek: import.meta.env.VITE_DEEPSEEK_MODEL ?? 'deepseek-chat',
  anthropic: import.meta.env.VITE_ANTHROPIC_MODEL ?? 'claude-3-opus-20240229',
  gemini: import.meta.env.VITE_GEMINI_MODEL ?? 'gemini-1.5-pro',
  qwen: import.meta.env.VITE_QWEN_MODEL ?? 'qwen-plus',
};

let openAIClient: OpenAI | null = null;

function normalizeProvider(input: string | undefined): AiProvider | undefined {
  if (!input) return undefined;
  const lower = input.trim().toLowerCase();
  return SUPPORTED_PROVIDERS.find((provider) => provider === lower);
}

function deriveProviderPriority(raw: string | undefined): AiProvider[] {
  if (!raw) {
    return [DEFAULT_PROVIDER];
  }

  const tokens = raw
    .split(',')
    .map((item) => normalizeProvider(item))
    .filter((provider): provider is AiProvider => Boolean(provider));

  if (tokens.length === 0) {
    return [DEFAULT_PROVIDER];
  }

  return Array.from(new Set(tokens));
}

function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getOpenAIClient(): OpenAI {
  if (!openAIClient) {
    const apiKey = requireEnv(import.meta.env.VITE_OPENAI_API_KEY, 'VITE_OPENAI_API_KEY');
    openAIClient = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  }
  return openAIClient;
}

export function getActiveProvider(): AiProvider {
  return normalizeProvider(import.meta.env.VITE_AI_PROVIDER) ?? DEFAULT_PROVIDER;
}

export async function generateText({
  userPrompt,
  systemPrompt,
  temperature = 0.7,
  maxOutputTokens = 2000,
  providerOverride,
}: GenerateTextArgs): Promise<string> {
  const providersToTry = providerOverride ? [providerOverride] : PROVIDER_PRIORITY;
  const errors: string[] = [];

  for (const provider of providersToTry) {
    try {
      console.log(`🤖 [AI] Using provider: ${provider.toUpperCase()}`);

      switch (provider) {
        case 'openai':
          const openaiResult = await generateWithOpenAI({ userPrompt, systemPrompt, temperature, maxOutputTokens });
          console.log(`✅ [AI] Successfully generated with ${provider.toUpperCase()}`);
          return openaiResult;
        case 'deepseek':
          const deepseekResult = await generateWithDeepSeek({ userPrompt, systemPrompt, temperature, maxOutputTokens });
          console.log(`✅ [AI] Successfully generated with ${provider.toUpperCase()}`);
          return deepseekResult;
        case 'anthropic':
          const anthropicResult = await generateWithAnthropic({ userPrompt, systemPrompt, temperature, maxOutputTokens });
          console.log(`✅ [AI] Successfully generated with ${provider.toUpperCase()}`);
          return anthropicResult;
        case 'gemini':
          const geminiResult = await generateWithGemini({ userPrompt, systemPrompt, temperature, maxOutputTokens });
          console.log(`✅ [AI] Successfully generated with ${provider.toUpperCase()}`);
          return geminiResult;
        case 'qwen':
          const qwenResult = await generateWithQwen({ userPrompt, systemPrompt, temperature, maxOutputTokens });
          console.log(`✅ [AI] Successfully generated with ${provider.toUpperCase()}`);
          return qwenResult;
        default:
          throw new Error(`Unsupported AI provider: ${provider}`);
      }
    } catch (error: any) {
      const message = error?.message ?? String(error);
      console.warn(`❌ [AI] Provider ${provider.toUpperCase()} failed: ${message}`);
      errors.push(`${provider}: ${message}`);
    }
  }

  throw new Error(`All AI providers failed.\n${errors.join('\n')}`);
}

interface ProviderArgs {
  userPrompt: string;
  systemPrompt?: string;
  temperature: number;
  maxOutputTokens: number;
}

async function generateWithOpenAI({
  userPrompt,
  systemPrompt,
  temperature,
  maxOutputTokens,
}: ProviderArgs): Promise<string> {
  const client = getOpenAIClient();
  const input: any[] = [];

  if (systemPrompt) {
    input.push({
      role: 'system',
      content: [
        {
          type: 'text',
          text: systemPrompt,
        },
      ],
    });
  }

  input.push({
    role: 'user',
    content: [
      {
        type: 'text',
        text: userPrompt,
      },
    ],
  });

  const response = await client.responses.create({
    model: MODEL_DEFAULTS.openai,
    temperature,
    max_output_tokens: maxOutputTokens,
    input,
  });

  if ('output_text' in response && typeof response.output_text === 'string') {
    return response.output_text.trim();
  }

  if (Array.isArray(response.output)) {
    return response.output
      .map((item: any) => {
        if (!item?.content) return '';
        return item.content
          .map((part: any) => {
            if (typeof part === 'string') return part;
            if (part?.text) return part.text;
            if (part?.type === 'output_text' && part.text) return part.text;
            return '';
          })
          .join('');
      })
      .join('')
      .trim();
  }

  return '';
}

async function generateWithDeepSeek({
  userPrompt,
  systemPrompt,
  temperature,
  maxOutputTokens,
}: ProviderArgs): Promise<string> {
  const apiKey = requireEnv(import.meta.env.VITE_DEEPSEEK_API_KEY, 'VITE_DEEPSEEK_API_KEY');
  const payload = {
    model: MODEL_DEFAULTS.deepseek,
    temperature,
    max_tokens: maxOutputTokens,
    messages: [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      { role: 'user', content: userPrompt },
    ],
  };

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message ?? 'DeepSeek API error');
  }

  return data?.choices?.[0]?.message?.content?.trim() ?? '';
}

async function generateWithAnthropic({
  userPrompt,
  systemPrompt,
  temperature,
  maxOutputTokens,
}: ProviderArgs): Promise<string> {
  const apiKey = requireEnv(import.meta.env.VITE_ANTHROPIC_API_KEY, 'VITE_ANTHROPIC_API_KEY');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL_DEFAULTS.anthropic,
      max_tokens: maxOutputTokens,
      temperature,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: userPrompt,
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message ?? 'Anthropic API error');
  }

  return data?.content?.[0]?.text?.trim() ?? '';
}

async function generateWithGemini({
  userPrompt,
  systemPrompt,
  temperature,
  maxOutputTokens,
}: ProviderArgs): Promise<string> {
  const apiKey = requireEnv(import.meta.env.VITE_GEMINI_API_KEY, 'VITE_GEMINI_API_KEY');
  const model = MODEL_DEFAULTS.gemini.replace(/^models\//, '');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body: Record<string, unknown> = {
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      temperature,
      maxOutputTokens,
    },
  };

  if (systemPrompt) {
    body.systemInstruction = {
      role: 'system',
      parts: [{ text: systemPrompt }],
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message ?? 'Gemini API error');
  }

  const parts = data?.candidates?.[0]?.content?.parts;
  if (Array.isArray(parts)) {
    return parts
      .map((part: { text?: string }) => part?.text ?? '')
      .filter(Boolean)
      .join('\n')
      .trim();
  }

  return '';
}

async function generateWithQwen({
  userPrompt,
  systemPrompt,
  temperature,
  maxOutputTokens,
}: ProviderArgs): Promise<string> {
  const apiKey = requireEnv(import.meta.env.VITE_QWEN_API_KEY, 'VITE_QWEN_API_KEY');

  const response = await fetch(
    'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL_DEFAULTS.qwen,
        input: {
          messages: [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            { role: 'user', content: userPrompt },
          ],
        },
        parameters: {
          result_format: 'text',
          max_tokens: maxOutputTokens,
          temperature,
        },
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message ?? 'Qwen API error');
  }

  if (data?.output?.text) {
    return String(data.output.text).trim();
  }

  return data?.output?.choices?.[0]?.message?.content?.trim() ?? '';
}
