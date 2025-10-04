import { z } from 'zod';

/**
 * Deployment Types
 * Multi-cloud deployment configurations and status
 */

// Cloud Providers
export enum CloudProvider {
  GCP = 'gcp',
  AWS = 'aws',
  Azure = 'azure',
  Cloudflare = 'cloudflare',
  Vercel = 'vercel',
  Netlify = 'netlify',
}

// Deployment Target
export enum DeploymentTarget {
  CloudRun = 'cloud_run', // GCP
  Lambda = 'lambda', // AWS
  Functions = 'functions', // Azure
  Workers = 'workers', // Cloudflare
  EdgeFunctions = 'edge_functions', // Vercel/Netlify
}

// Deployment Status
export enum DeploymentStatus {
  Pending = 'pending',
  Building = 'building',
  Deploying = 'deploying',
  Running = 'running',
  Failed = 'failed',
  Stopped = 'stopped',
  Updating = 'updating',
}

// Environment Variable
export const EnvironmentVariableSchema = z.object({
  key: z.string().regex(/^[A-Z][A-Z0-9_]*$/), // UPPER_SNAKE_CASE
  value: z.string().optional(), // May be secret reference
  secret: z.boolean().default(false),
  secretRef: z.string().optional(), // Reference to secret manager
});

export type EnvironmentVariable = z.infer<typeof EnvironmentVariableSchema>;

// Deployment Configuration
export const DeploymentConfigSchema = z.object({
  provider: z.nativeEnum(CloudProvider),
  target: z.nativeEnum(DeploymentTarget),
  region: z.string(),
  runtime: z.string(), // e.g., "nodejs20", "python3.11"
  memory: z.number().int().positive().default(512), // MB
  timeout: z.number().int().positive().default(60), // seconds
  concurrency: z.number().int().positive().default(80),
  minInstances: z.number().int().nonnegative().default(0),
  maxInstances: z.number().int().positive().default(100),
  cpu: z.number().positive().default(1),
  env: z.array(EnvironmentVariableSchema).default([]),
  secrets: z.array(z.string()).default([]), // Secret manager paths
  vpc: z.object({
    enabled: z.boolean().default(false),
    connector: z.string().optional(),
    egress: z.enum(['all', 'private']).optional(),
  }).optional(),
  customDomain: z.string().optional(),
  cors: z.object({
    enabled: z.boolean().default(false),
    origins: z.array(z.string()).default(['*']),
    methods: z.array(z.string()).default(['GET', 'POST']),
    headers: z.array(z.string()).default([]),
  }).optional(),
});

export type DeploymentConfig = z.infer<typeof DeploymentConfigSchema>;

// Deployment Metadata
export const DeploymentMetadataSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.nativeEnum(DeploymentStatus),
  config: DeploymentConfigSchema,
  url: z.string().url().optional(),
  version: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deployedBy: z.string().optional(),
  buildId: z.string().optional(),
  logs: z.string().url().optional(),
  metrics: z.string().url().optional(),
  health: z.object({
    status: z.enum(['healthy', 'degraded', 'unhealthy', 'unknown']),
    lastCheck: z.date().optional(),
    checks: z.array(z.object({
      name: z.string(),
      status: z.enum(['pass', 'fail']),
      message: z.string().optional(),
    })).optional(),
  }).optional(),
});

export type DeploymentMetadata = z.infer<typeof DeploymentMetadataSchema>;

// Build Configuration
export const BuildConfigSchema = z.object({
  dockerfile: z.string().optional(),
  buildArgs: z.record(z.string()).default({}),
  target: z.string().optional(), // Multi-stage build target
  platform: z.string().default('linux/amd64'),
  cache: z.boolean().default(true),
  prune: z.boolean().default(true),
});

export type BuildConfig = z.infer<typeof BuildConfigSchema>;

// Deployment Result
export const DeploymentResultSchema = z.object({
  success: z.boolean(),
  deploymentId: z.string().optional(),
  url: z.string().url().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
  logs: z.array(z.string()).default([]),
  duration: z.number().positive().optional(), // milliseconds
  metadata: DeploymentMetadataSchema.optional(),
});

export type DeploymentResult = z.infer<typeof DeploymentResultSchema>;
