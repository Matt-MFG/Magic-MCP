"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentResultSchema = exports.BuildConfigSchema = exports.DeploymentMetadataSchema = exports.DeploymentConfigSchema = exports.EnvironmentVariableSchema = exports.DeploymentStatus = exports.DeploymentTarget = exports.CloudProvider = void 0;
const zod_1 = require("zod");
/**
 * Deployment Types
 * Multi-cloud deployment configurations and status
 */
// Cloud Providers
var CloudProvider;
(function (CloudProvider) {
    CloudProvider["GCP"] = "gcp";
    CloudProvider["AWS"] = "aws";
    CloudProvider["Azure"] = "azure";
    CloudProvider["Cloudflare"] = "cloudflare";
    CloudProvider["Vercel"] = "vercel";
    CloudProvider["Netlify"] = "netlify";
})(CloudProvider || (exports.CloudProvider = CloudProvider = {}));
// Deployment Target
var DeploymentTarget;
(function (DeploymentTarget) {
    DeploymentTarget["CloudRun"] = "cloud_run";
    DeploymentTarget["Lambda"] = "lambda";
    DeploymentTarget["Functions"] = "functions";
    DeploymentTarget["Workers"] = "workers";
    DeploymentTarget["EdgeFunctions"] = "edge_functions";
})(DeploymentTarget || (exports.DeploymentTarget = DeploymentTarget = {}));
// Deployment Status
var DeploymentStatus;
(function (DeploymentStatus) {
    DeploymentStatus["Pending"] = "pending";
    DeploymentStatus["Building"] = "building";
    DeploymentStatus["Deploying"] = "deploying";
    DeploymentStatus["Running"] = "running";
    DeploymentStatus["Failed"] = "failed";
    DeploymentStatus["Stopped"] = "stopped";
    DeploymentStatus["Updating"] = "updating";
})(DeploymentStatus || (exports.DeploymentStatus = DeploymentStatus = {}));
// Environment Variable
exports.EnvironmentVariableSchema = zod_1.z.object({
    key: zod_1.z.string().regex(/^[A-Z][A-Z0-9_]*$/), // UPPER_SNAKE_CASE
    value: zod_1.z.string().optional(), // May be secret reference
    secret: zod_1.z.boolean().default(false),
    secretRef: zod_1.z.string().optional(), // Reference to secret manager
});
// Deployment Configuration
exports.DeploymentConfigSchema = zod_1.z.object({
    provider: zod_1.z.nativeEnum(CloudProvider),
    target: zod_1.z.nativeEnum(DeploymentTarget),
    region: zod_1.z.string(),
    runtime: zod_1.z.string(), // e.g., "nodejs20", "python3.11"
    memory: zod_1.z.number().int().positive().default(512), // MB
    timeout: zod_1.z.number().int().positive().default(60), // seconds
    concurrency: zod_1.z.number().int().positive().default(80),
    minInstances: zod_1.z.number().int().nonnegative().default(0),
    maxInstances: zod_1.z.number().int().positive().default(100),
    cpu: zod_1.z.number().positive().default(1),
    env: zod_1.z.array(exports.EnvironmentVariableSchema).default([]),
    secrets: zod_1.z.array(zod_1.z.string()).default([]), // Secret manager paths
    vpc: zod_1.z.object({
        enabled: zod_1.z.boolean().default(false),
        connector: zod_1.z.string().optional(),
        egress: zod_1.z.enum(['all', 'private']).optional(),
    }).optional(),
    customDomain: zod_1.z.string().optional(),
    cors: zod_1.z.object({
        enabled: zod_1.z.boolean().default(false),
        origins: zod_1.z.array(zod_1.z.string()).default(['*']),
        methods: zod_1.z.array(zod_1.z.string()).default(['GET', 'POST']),
        headers: zod_1.z.array(zod_1.z.string()).default([]),
    }).optional(),
});
// Deployment Metadata
exports.DeploymentMetadataSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    status: zod_1.z.nativeEnum(DeploymentStatus),
    config: exports.DeploymentConfigSchema,
    url: zod_1.z.string().url().optional(),
    version: zod_1.z.string(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
    deployedBy: zod_1.z.string().optional(),
    buildId: zod_1.z.string().optional(),
    logs: zod_1.z.string().url().optional(),
    metrics: zod_1.z.string().url().optional(),
    health: zod_1.z.object({
        status: zod_1.z.enum(['healthy', 'degraded', 'unhealthy', 'unknown']),
        lastCheck: zod_1.z.date().optional(),
        checks: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string(),
            status: zod_1.z.enum(['pass', 'fail']),
            message: zod_1.z.string().optional(),
        })).optional(),
    }).optional(),
});
// Build Configuration
exports.BuildConfigSchema = zod_1.z.object({
    dockerfile: zod_1.z.string().optional(),
    buildArgs: zod_1.z.record(zod_1.z.string()).default({}),
    target: zod_1.z.string().optional(), // Multi-stage build target
    platform: zod_1.z.string().default('linux/amd64'),
    cache: zod_1.z.boolean().default(true),
    prune: zod_1.z.boolean().default(true),
});
// Deployment Result
exports.DeploymentResultSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    deploymentId: zod_1.z.string().optional(),
    url: zod_1.z.string().url().optional(),
    message: zod_1.z.string().optional(),
    error: zod_1.z.string().optional(),
    logs: zod_1.z.array(zod_1.z.string()).default([]),
    duration: zod_1.z.number().positive().optional(), // milliseconds
    metadata: exports.DeploymentMetadataSchema.optional(),
});
//# sourceMappingURL=deployment.js.map