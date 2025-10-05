import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';
import ora from 'ora';

import { OpenAPIParser } from '@magic-mcp/parser';
import { GeminiClient, MCPGenerator } from '@magic-mcp/generator';
import { SecurityScanner } from '@magic-mcp/security';
import { TargetLanguage, GenerationStrategy, CodeQualityLevel, logger, LogLevel } from '@magic-mcp/shared';

interface GenerateOptions {
  output: string;
  name?: string;
  language: string;
  tests: boolean;
  docs: boolean;
  securityScan: boolean;
  project?: string;
  location: string;
}

export async function generateCommand(
  spec: string,
  options: GenerateOptions
): Promise<void> {
  console.log(chalk.bold.cyan('\n🪄 Magic MCP Generator\n'));

  // Set log level
  logger.setMinLevel(LogLevel.INFO);

  const spinner = ora();

  try {
    // Step 1: Parse OpenAPI specification
    spinner.start('Parsing OpenAPI specification...');
    const parser = new OpenAPIParser();
    const apiSchema = await parser.parse(spec);
    spinner.succeed(
      chalk.green(
        `Parsed OpenAPI specification: ${apiSchema.info.title} v${apiSchema.info.version}`
      )
    );

    // Step 2: Initialize AI client
    const projectId =
      options.project || process.env.GOOGLE_CLOUD_PROJECT;

    if (!projectId) {
      spinner.fail(
        chalk.red(
          'Google Cloud project ID required. Set GOOGLE_CLOUD_PROJECT or use --project'
        )
      );
      process.exit(1);
    }

    spinner.start('Initializing AI generator...');
    const gemini = new GeminiClient({
      project: projectId,
      location: options.location,
    });
    const generator = new MCPGenerator(gemini);
    spinner.succeed(chalk.green('AI generator ready'));

    // Step 3: Generate MCP server
    spinner.start('Generating MCP server code...');
    const result = await generator.generate({
      apiSchema,
      name: options.name,
      version: '1.0.0',
      options: {
        language: options.language as TargetLanguage,
        strategy: GenerationStrategy.Optimized,
        quality: CodeQualityLevel.Standard,
        includeTests: options.tests,
        includeDocs: options.docs,
        includeExamples: true,
        securityHardening: true,
        validateInput: true,
        sanitizeOutput: true,
        errorHandling: 'comprehensive' as const,
        retryLogic: true,
        rateLimit: true,
        logging: 'detailed' as const,
        aiEnhancement: true,
      },
    });
    spinner.succeed(
      chalk.green(
        `Generated ${result.files.length} files with ${result.spec.tools.length} tools`
      )
    );

    // Step 4: Security scan
    if (options.securityScan) {
      spinner.start('Running security scan...');
      const scanner = new SecurityScanner();
      const scanResult = await scanner.scanFiles(result.files);

      if (scanResult.passed) {
        spinner.succeed(
          chalk.green(
            `Security scan passed (score: ${scanResult.score}/100)`
          )
        );
      } else {
        spinner.warn(
          chalk.yellow(
            `Security issues found (score: ${scanResult.score}/100)`
          )
        );
        console.log(
          chalk.yellow(
            `  Critical: ${scanResult.summary.critical}, High: ${scanResult.summary.high}, Medium: ${scanResult.summary.medium}`
          )
        );

        if (scanResult.summary.critical > 0 || scanResult.summary.high > 0) {
          console.log(
            chalk.yellow(
              '\n⚠️  Please review and fix security issues before deployment\n'
            )
          );
        }
      }
    }

    // Step 5: Write files to disk
    spinner.start('Writing files...');
    await fs.mkdir(options.output, { recursive: true });

    for (const file of result.files) {
      const filePath = path.join(options.output, file.path);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, file.content, 'utf-8');
    }

    spinner.succeed(
      chalk.green(`Files written to ${options.output}`)
    );

    // Success message
    console.log(chalk.bold.green('\n✨ MCP server generated successfully!\n'));
    console.log(chalk.cyan('Next steps:'));
    console.log(
      chalk.white(`  1. cd ${options.output}`)
    );
    console.log(chalk.white('  2. npm install'));
    console.log(chalk.white('  3. npm run build'));
    console.log(chalk.white('  4. npm start\n'));

    // Show warnings if any
    if (result.warnings.length > 0) {
      console.log(chalk.yellow('⚠️  Warnings:'));
      result.warnings.forEach((warning) => {
        console.log(chalk.yellow(`   - ${warning}`));
      });
      console.log();
    }
  } catch (error) {
    spinner.fail(chalk.red('Generation failed'));
    console.error(
      chalk.red(
        `\nError: ${error instanceof Error ? error.message : String(error)}`
      )
    );
    process.exit(1);
  }
}
