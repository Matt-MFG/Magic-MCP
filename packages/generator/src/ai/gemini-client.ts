import { VertexAI } from '@google-cloud/vertexai';

import { GenerationError, logger } from '@magic-mcp/shared';

/**
 * Gemini AI Client
 * Wrapper for Google Cloud Vertex AI Gemini API
 */

export interface GeminiConfig {
  project: string;
  location: string;
  model?: string;
}

export interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  stopSequences?: string[];
}

export interface GenerateResult {
  text: string;
  tokensUsed: number;
  finishReason: string;
}

export class GeminiClient {
  private vertexAI: VertexAI;
  private model: string;

  constructor(config: GeminiConfig) {
    this.vertexAI = new VertexAI({
      project: config.project,
      location: config.location,
    });
    this.model = config.model || 'gemini-2.0-flash-exp'; // Using Gemini 2.5 Pro equivalent

    logger.info('Initialized Gemini client', {
      project: config.project,
      location: config.location,
      model: this.model,
    });
  }

  /**
   * Generate text using Gemini
   */
  async generate(prompt: string, options: GenerateOptions = {}): Promise<GenerateResult> {
    try {
      const generativeModel = this.vertexAI.getGenerativeModel({
        model: this.model,
        generationConfig: {
          temperature: options.temperature ?? 0.2, // Lower temp for code generation
          maxOutputTokens: options.maxTokens ?? 8192,
          topP: options.topP ?? 0.95,
          topK: options.topK ?? 40,
          stopSequences: options.stopSequences,
        },
      });

      logger.debug('Generating with Gemini', {
        promptLength: prompt.length,
        temperature: options.temperature,
      });

      const result = await generativeModel.generateContent(prompt);
      const response = result.response;

      if (!response.candidates || response.candidates.length === 0) {
        throw new GenerationError('No response generated from AI model');
      }

      const candidate = response.candidates[0];
      let text = candidate.content.parts.map((part) => part.text).join('');

      // Decode HTML entities that Gemini sometimes adds
      text = text
        .replace(/&#x27;/g, "'")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');

      const tokensUsed = response.usageMetadata
        ? response.usageMetadata.totalTokenCount || 0
        : 0;

      const finishReason = candidate.finishReason || 'UNKNOWN';

      logger.info('Gemini generation completed', {
        tokensUsed,
        finishReason,
        responseLength: text.length,
      });

      return {
        text,
        tokensUsed,
        finishReason,
      };
    } catch (error) {
      logger.error('Gemini generation failed', error as Error);
      throw new GenerationError('AI generation failed', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Generate with thinking mode (for complex reasoning)
   */
  async generateWithThinking(prompt: string, options: GenerateOptions = {}): Promise<GenerateResult> {
    // Add thinking prompt wrapper
    const thinkingPrompt = `Let's approach this step by step:

1. First, analyze the requirements carefully
2. Consider edge cases and security implications
3. Design the optimal solution
4. Generate clean, production-ready code

${prompt}

Please think through this carefully and provide a comprehensive solution.`;

    return this.generate(thinkingPrompt, {
      ...options,
      temperature: options.temperature ?? 0.3, // Slightly higher for reasoning
    });
  }

  /**
   * Generate code with validation
   */
  async generateCode(
    prompt: string,
    language: 'typescript' | 'python' | 'go',
    options: GenerateOptions = {}
  ): Promise<string> {
    const codePrompt = `Generate ${language} code for the following requirements.
Follow best practices, include error handling, and add comprehensive comments.

Requirements:
${prompt}

Generate ONLY the code, no explanations before or after. Use markdown code blocks with the language specified.`;

    const result = await this.generate(codePrompt, {
      ...options,
      temperature: options.temperature ?? 0.1, // Very low temp for code
    });

    // Extract code from markdown code blocks
    const codeBlockRegex = new RegExp(`\`\`\`${language}\\s*([\\s\\S]*?)\`\`\``, 'i');
    const match = result.text.match(codeBlockRegex);

    if (match && match[1]) {
      return match[1].trim();
    }

    // Try generic code block
    const genericCodeBlockRegex = /```\s*([\s\S]*?)```/;
    const genericMatch = result.text.match(genericCodeBlockRegex);

    if (genericMatch && genericMatch[1]) {
      return genericMatch[1].trim();
    }

    // Return as-is if no code blocks found
    return result.text.trim();
  }

  /**
   * Analyze API schema and suggest improvements
   */
  async analyzeSchema(schemaJson: string): Promise<{
    improvements: string[];
    securityConcerns: string[];
    missingEndpoints: string[];
  }> {
    const prompt = `Analyze the following API schema and provide:
1. Suggested improvements to descriptions and documentation
2. Security concerns or vulnerabilities
3. Missing endpoints that users might expect

API Schema:
${schemaJson}

Respond in JSON format with keys: improvements, securityConcerns, missingEndpoints (all arrays of strings).`;

    const result = await this.generate(prompt, { temperature: 0.3 });

    try {
      // Extract JSON from response
      const jsonMatch = result.text.match(/```json\s*([\s\S]*?)```/) ||
                       result.text.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const jsonText = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonText);
      }

      // Fallback to empty arrays
      return {
        improvements: [],
        securityConcerns: [],
        missingEndpoints: [],
      };
    } catch (error) {
      logger.warn('Failed to parse schema analysis JSON', { error });
      return {
        improvements: [],
        securityConcerns: [],
        missingEndpoints: [],
      };
    }
  }
}
