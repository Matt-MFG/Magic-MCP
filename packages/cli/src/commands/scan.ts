import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';
import ora from 'ora';

import { SecurityScanner } from '@magic-mcp/security';
import { GeneratedFile, SecuritySeverity, logger, LogLevel } from '@magic-mcp/shared';

interface ScanOptions {
  minSeverity: string;
  json: boolean;
}

export async function scanCommand(
  dir: string,
  options: ScanOptions
): Promise<void> {
  if (!options.json) {
    console.log(chalk.bold.cyan('\n🔒 Magic MCP Security Scanner\n'));
  }

  logger.setMinLevel(LogLevel.INFO);

  const spinner = ora();

  try {
    // Read all files from directory
    spinner.start('Reading files...');
    const files = await readDirectory(dir);
    spinner.succeed(chalk.green(`Found ${files.length} files to scan`));

    // Run security scan
    spinner.start('Scanning for security vulnerabilities...');
    const scanner = new SecurityScanner();
    const result = await scanner.scanFiles(files);
    spinner.stop();

    // Filter by minimum severity
    const minSev = options.minSeverity.toLowerCase() as keyof typeof SecuritySeverity;
    const minSeverity = SecuritySeverity[minSev.charAt(0).toUpperCase() + minSev.slice(1) as keyof typeof SecuritySeverity];
    const filteredFindings = scanner.filterBySeverity(result.findings, minSeverity);

    if (options.json) {
      // JSON output
      console.log(
        JSON.stringify(
          {
            ...result,
            findings: filteredFindings,
          },
          null,
          2
        )
      );
    } else {
      // Human-readable output
      console.log(chalk.bold('\n📊 Scan Results\n'));
      console.log(
        chalk.white(
          `Security Score: ${result.passed ? chalk.green(result.score) : chalk.yellow(result.score)}/100`
        )
      );
      console.log(
        chalk.white(
          `Status: ${result.passed ? chalk.green('PASSED ✓') : chalk.yellow('REVIEW NEEDED ⚠')}`
        )
      );
      console.log(
        chalk.white(`Duration: ${result.duration}ms`)
      );

      console.log(chalk.bold('\n📈 Summary\n'));
      console.log(
        chalk.red(`  Critical: ${result.summary.critical}`)
      );
      console.log(
        chalk.yellow(`  High:     ${result.summary.high}`)
      );
      console.log(
        chalk.blue(`  Medium:   ${result.summary.medium}`)
      );
      console.log(
        chalk.gray(`  Low:      ${result.summary.low}`)
      );
      console.log(
        chalk.white(`  Info:     ${result.summary.info}`)
      );

      if (filteredFindings.length > 0) {
        console.log(chalk.bold(`\n🔍 Findings (${filteredFindings.length})\n`));

        for (const finding of filteredFindings) {
          const severityColor =
            finding.severity === SecuritySeverity.Critical
              ? chalk.red
              : finding.severity === SecuritySeverity.High
              ? chalk.yellow
              : finding.severity === SecuritySeverity.Medium
              ? chalk.blue
              : chalk.gray;

          console.log(
            severityColor(
              `  [${finding.severity.toUpperCase()}] ${finding.title}`
            )
          );
          console.log(chalk.gray(`    ${finding.description}`));

          if (finding.location) {
            console.log(
              chalk.gray(
                `    Location: ${finding.location.file}${finding.location.line ? `:${finding.location.line}` : ''}`
              )
            );
          }

          if (finding.remediation) {
            console.log(
              chalk.cyan(`    Fix: ${finding.remediation}`)
            );
          }

          console.log();
        }
      } else {
        console.log(
          chalk.green('\n✨ No security issues found!\n')
        );
      }

      if (!result.passed) {
        console.log(
          chalk.yellow(
            '⚠️  Please address security findings before deploying to production.\n'
          )
        );
      }
    }

    // Exit with error code if scan failed
    process.exit(result.passed ? 0 : 1);
  } catch (error) {
    if (!options.json) {
      spinner.fail(chalk.red('Scan failed'));
      console.error(
        chalk.red(
          `\nError: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    } else {
      console.error(
        JSON.stringify({
          error: error instanceof Error ? error.message : String(error),
        })
      );
    }
    process.exit(1);
  }
}

/**
 * Read all source files from directory recursively
 */
async function readDirectory(dir: string): Promise<GeneratedFile[]> {
  const files: GeneratedFile[] = [];

  async function walk(currentPath: string): Promise<void> {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules and common build directories
        if (!['node_modules', 'dist', 'build', '.git'].includes(entry.name)) {
          await walk(fullPath);
        }
      } else if (entry.isFile()) {
        // Only scan source files
        const ext = path.extname(entry.name);
        if (['.ts', '.js', '.py', '.go'].includes(ext)) {
          const content = await fs.readFile(fullPath, 'utf-8');
          const relativePath = path.relative(dir, fullPath);

          files.push({
            path: relativePath,
            content,
            type: 'source',
            language: ext.slice(1),
            size: content.length,
          });
        }
      }
    }
  }

  await walk(dir);
  return files;
}
