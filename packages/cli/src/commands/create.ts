import chalk from 'chalk';
import ora from 'ora';

import { GeminiClient } from '@magic-mcp/generator';
import { logger, LogLevel } from '@magic-mcp/shared';

interface CreateOptions {
  output: string;
  language: string;
  project?: string;
  location: string;
}

export async function createCommand(
  description: string,
  options: CreateOptions
): Promise<void> {
  console.log(chalk.bold.cyan('\n🪄 Magic MCP Creator\n'));
  console.log(chalk.gray(`Creating MCP from: "${description}"\n`));

  logger.setMinLevel(LogLevel.INFO);

  const spinner = ora();

  try {
    // Initialize AI client
    const projectId = options.project || process.env.GOOGLE_CLOUD_PROJECT;

    if (!projectId) {
      spinner.fail(
        chalk.red(
          'Google Cloud project ID required. Set GOOGLE_CLOUD_PROJECT or use --project'
        )
      );
      process.exit(1);
    }

    spinner.start('Initializing AI...');
    const gemini = new GeminiClient({
      project: projectId,
      location: options.location,
    });
    spinner.succeed(chalk.green('AI ready'));

    // Generate OpenAPI spec from natural language
    spinner.start('Generating API specification from description...');

    const prompt = `Create a detailed OpenAPI 3.0 specification for an API based on this description:

${description}

Include:
1. Appropriate endpoints and HTTP methods
2. Request/response schemas
3. Authentication if mentioned
4. Descriptions for all operations

Output ONLY the OpenAPI YAML or JSON specification, no additional text.`;

    const result = await gemini.generate(prompt, {
      temperature: 0.3,
      maxTokens: 4096,
    });

    spinner.info(chalk.blue('Generated OpenAPI specification'));

    // TODO: Parse the generated spec and call the generate command
    // For now, just show the generated spec

    console.log(chalk.cyan('\n📋 Generated OpenAPI Specification:\n'));
    console.log(chalk.white(result.text));

    console.log(
      chalk.yellow(
        '\n⚠️  Natural language generation is experimental. Review the specification before proceeding.\n'
      )
    );
    console.log(
      chalk.gray(
        'To generate the MCP server, save the spec above and run: magic-mcp generate <spec-file>\n'
      )
    );
  } catch (error) {
    spinner.fail(chalk.red('Creation failed'));
    console.error(
      chalk.red(
        `\nError: ${error instanceof Error ? error.message : String(error)}`
      )
    );
    process.exit(1);
  }
}
