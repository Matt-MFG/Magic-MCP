import { z } from 'zod';
/**
 * Deployment Types
 * Multi-cloud deployment configurations and status
 */
export declare enum CloudProvider {
    GCP = "gcp",
    AWS = "aws",
    Azure = "azure",
    Cloudflare = "cloudflare",
    Vercel = "vercel",
    Netlify = "netlify"
}
export declare enum DeploymentTarget {
    CloudRun = "cloud_run",// GCP
    Lambda = "lambda",// AWS
    Functions = "functions",// Azure
    Workers = "workers",// Cloudflare
    EdgeFunctions = "edge_functions"
}
export declare enum DeploymentStatus {
    Pending = "pending",
    Building = "building",
    Deploying = "deploying",
    Running = "running",
    Failed = "failed",
    Stopped = "stopped",
    Updating = "updating"
}
export declare const EnvironmentVariableSchema: z.ZodObject<{
    key: z.ZodString;
    value: z.ZodOptional<z.ZodString>;
    secret: z.ZodDefault<z.ZodBoolean>;
    secretRef: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    key: string;
    secret: boolean;
    value?: string | undefined;
    secretRef?: string | undefined;
}, {
    key: string;
    value?: string | undefined;
    secret?: boolean | undefined;
    secretRef?: string | undefined;
}>;
export type EnvironmentVariable = z.infer<typeof EnvironmentVariableSchema>;
export declare const DeploymentConfigSchema: z.ZodObject<{
    provider: z.ZodNativeEnum<typeof CloudProvider>;
    target: z.ZodNativeEnum<typeof DeploymentTarget>;
    region: z.ZodString;
    runtime: z.ZodString;
    memory: z.ZodDefault<z.ZodNumber>;
    timeout: z.ZodDefault<z.ZodNumber>;
    concurrency: z.ZodDefault<z.ZodNumber>;
    minInstances: z.ZodDefault<z.ZodNumber>;
    maxInstances: z.ZodDefault<z.ZodNumber>;
    cpu: z.ZodDefault<z.ZodNumber>;
    env: z.ZodDefault<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        value: z.ZodOptional<z.ZodString>;
        secret: z.ZodDefault<z.ZodBoolean>;
        secretRef: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        key: string;
        secret: boolean;
        value?: string | undefined;
        secretRef?: string | undefined;
    }, {
        key: string;
        value?: string | undefined;
        secret?: boolean | undefined;
        secretRef?: string | undefined;
    }>, "many">>;
    secrets: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    vpc: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        connector: z.ZodOptional<z.ZodString>;
        egress: z.ZodOptional<z.ZodEnum<["all", "private"]>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        connector?: string | undefined;
        egress?: "all" | "private" | undefined;
    }, {
        enabled?: boolean | undefined;
        connector?: string | undefined;
        egress?: "all" | "private" | undefined;
    }>>;
    customDomain: z.ZodOptional<z.ZodString>;
    cors: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        origins: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        methods: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        headers: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        origins: string[];
        methods: string[];
        headers: string[];
    }, {
        enabled?: boolean | undefined;
        origins?: string[] | undefined;
        methods?: string[] | undefined;
        headers?: string[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    provider: CloudProvider;
    target: DeploymentTarget;
    region: string;
    runtime: string;
    memory: number;
    timeout: number;
    concurrency: number;
    minInstances: number;
    maxInstances: number;
    cpu: number;
    env: {
        key: string;
        secret: boolean;
        value?: string | undefined;
        secretRef?: string | undefined;
    }[];
    secrets: string[];
    cors?: {
        enabled: boolean;
        origins: string[];
        methods: string[];
        headers: string[];
    } | undefined;
    vpc?: {
        enabled: boolean;
        connector?: string | undefined;
        egress?: "all" | "private" | undefined;
    } | undefined;
    customDomain?: string | undefined;
}, {
    provider: CloudProvider;
    target: DeploymentTarget;
    region: string;
    runtime: string;
    cors?: {
        enabled?: boolean | undefined;
        origins?: string[] | undefined;
        methods?: string[] | undefined;
        headers?: string[] | undefined;
    } | undefined;
    memory?: number | undefined;
    timeout?: number | undefined;
    concurrency?: number | undefined;
    minInstances?: number | undefined;
    maxInstances?: number | undefined;
    cpu?: number | undefined;
    env?: {
        key: string;
        value?: string | undefined;
        secret?: boolean | undefined;
        secretRef?: string | undefined;
    }[] | undefined;
    secrets?: string[] | undefined;
    vpc?: {
        enabled?: boolean | undefined;
        connector?: string | undefined;
        egress?: "all" | "private" | undefined;
    } | undefined;
    customDomain?: string | undefined;
}>;
export type DeploymentConfig = z.infer<typeof DeploymentConfigSchema>;
export declare const DeploymentMetadataSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    status: z.ZodNativeEnum<typeof DeploymentStatus>;
    config: z.ZodObject<{
        provider: z.ZodNativeEnum<typeof CloudProvider>;
        target: z.ZodNativeEnum<typeof DeploymentTarget>;
        region: z.ZodString;
        runtime: z.ZodString;
        memory: z.ZodDefault<z.ZodNumber>;
        timeout: z.ZodDefault<z.ZodNumber>;
        concurrency: z.ZodDefault<z.ZodNumber>;
        minInstances: z.ZodDefault<z.ZodNumber>;
        maxInstances: z.ZodDefault<z.ZodNumber>;
        cpu: z.ZodDefault<z.ZodNumber>;
        env: z.ZodDefault<z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            value: z.ZodOptional<z.ZodString>;
            secret: z.ZodDefault<z.ZodBoolean>;
            secretRef: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            key: string;
            secret: boolean;
            value?: string | undefined;
            secretRef?: string | undefined;
        }, {
            key: string;
            value?: string | undefined;
            secret?: boolean | undefined;
            secretRef?: string | undefined;
        }>, "many">>;
        secrets: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        vpc: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            connector: z.ZodOptional<z.ZodString>;
            egress: z.ZodOptional<z.ZodEnum<["all", "private"]>>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            connector?: string | undefined;
            egress?: "all" | "private" | undefined;
        }, {
            enabled?: boolean | undefined;
            connector?: string | undefined;
            egress?: "all" | "private" | undefined;
        }>>;
        customDomain: z.ZodOptional<z.ZodString>;
        cors: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            origins: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            methods: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            headers: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            origins: string[];
            methods: string[];
            headers: string[];
        }, {
            enabled?: boolean | undefined;
            origins?: string[] | undefined;
            methods?: string[] | undefined;
            headers?: string[] | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        provider: CloudProvider;
        target: DeploymentTarget;
        region: string;
        runtime: string;
        memory: number;
        timeout: number;
        concurrency: number;
        minInstances: number;
        maxInstances: number;
        cpu: number;
        env: {
            key: string;
            secret: boolean;
            value?: string | undefined;
            secretRef?: string | undefined;
        }[];
        secrets: string[];
        cors?: {
            enabled: boolean;
            origins: string[];
            methods: string[];
            headers: string[];
        } | undefined;
        vpc?: {
            enabled: boolean;
            connector?: string | undefined;
            egress?: "all" | "private" | undefined;
        } | undefined;
        customDomain?: string | undefined;
    }, {
        provider: CloudProvider;
        target: DeploymentTarget;
        region: string;
        runtime: string;
        cors?: {
            enabled?: boolean | undefined;
            origins?: string[] | undefined;
            methods?: string[] | undefined;
            headers?: string[] | undefined;
        } | undefined;
        memory?: number | undefined;
        timeout?: number | undefined;
        concurrency?: number | undefined;
        minInstances?: number | undefined;
        maxInstances?: number | undefined;
        cpu?: number | undefined;
        env?: {
            key: string;
            value?: string | undefined;
            secret?: boolean | undefined;
            secretRef?: string | undefined;
        }[] | undefined;
        secrets?: string[] | undefined;
        vpc?: {
            enabled?: boolean | undefined;
            connector?: string | undefined;
            egress?: "all" | "private" | undefined;
        } | undefined;
        customDomain?: string | undefined;
    }>;
    url: z.ZodOptional<z.ZodString>;
    version: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    deployedBy: z.ZodOptional<z.ZodString>;
    buildId: z.ZodOptional<z.ZodString>;
    logs: z.ZodOptional<z.ZodString>;
    metrics: z.ZodOptional<z.ZodString>;
    health: z.ZodOptional<z.ZodObject<{
        status: z.ZodEnum<["healthy", "degraded", "unhealthy", "unknown"]>;
        lastCheck: z.ZodOptional<z.ZodDate>;
        checks: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            status: z.ZodEnum<["pass", "fail"]>;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            status: "pass" | "fail";
            name: string;
            message?: string | undefined;
        }, {
            status: "pass" | "fail";
            name: string;
            message?: string | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        status: "unknown" | "healthy" | "degraded" | "unhealthy";
        lastCheck?: Date | undefined;
        checks?: {
            status: "pass" | "fail";
            name: string;
            message?: string | undefined;
        }[] | undefined;
    }, {
        status: "unknown" | "healthy" | "degraded" | "unhealthy";
        lastCheck?: Date | undefined;
        checks?: {
            status: "pass" | "fail";
            name: string;
            message?: string | undefined;
        }[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: DeploymentStatus;
    name: string;
    version: string;
    config: {
        provider: CloudProvider;
        target: DeploymentTarget;
        region: string;
        runtime: string;
        memory: number;
        timeout: number;
        concurrency: number;
        minInstances: number;
        maxInstances: number;
        cpu: number;
        env: {
            key: string;
            secret: boolean;
            value?: string | undefined;
            secretRef?: string | undefined;
        }[];
        secrets: string[];
        cors?: {
            enabled: boolean;
            origins: string[];
            methods: string[];
            headers: string[];
        } | undefined;
        vpc?: {
            enabled: boolean;
            connector?: string | undefined;
            egress?: "all" | "private" | undefined;
        } | undefined;
        customDomain?: string | undefined;
    };
    id: string;
    createdAt: Date;
    updatedAt: Date;
    url?: string | undefined;
    deployedBy?: string | undefined;
    buildId?: string | undefined;
    logs?: string | undefined;
    metrics?: string | undefined;
    health?: {
        status: "unknown" | "healthy" | "degraded" | "unhealthy";
        lastCheck?: Date | undefined;
        checks?: {
            status: "pass" | "fail";
            name: string;
            message?: string | undefined;
        }[] | undefined;
    } | undefined;
}, {
    status: DeploymentStatus;
    name: string;
    version: string;
    config: {
        provider: CloudProvider;
        target: DeploymentTarget;
        region: string;
        runtime: string;
        cors?: {
            enabled?: boolean | undefined;
            origins?: string[] | undefined;
            methods?: string[] | undefined;
            headers?: string[] | undefined;
        } | undefined;
        memory?: number | undefined;
        timeout?: number | undefined;
        concurrency?: number | undefined;
        minInstances?: number | undefined;
        maxInstances?: number | undefined;
        cpu?: number | undefined;
        env?: {
            key: string;
            value?: string | undefined;
            secret?: boolean | undefined;
            secretRef?: string | undefined;
        }[] | undefined;
        secrets?: string[] | undefined;
        vpc?: {
            enabled?: boolean | undefined;
            connector?: string | undefined;
            egress?: "all" | "private" | undefined;
        } | undefined;
        customDomain?: string | undefined;
    };
    id: string;
    createdAt: Date;
    updatedAt: Date;
    url?: string | undefined;
    deployedBy?: string | undefined;
    buildId?: string | undefined;
    logs?: string | undefined;
    metrics?: string | undefined;
    health?: {
        status: "unknown" | "healthy" | "degraded" | "unhealthy";
        lastCheck?: Date | undefined;
        checks?: {
            status: "pass" | "fail";
            name: string;
            message?: string | undefined;
        }[] | undefined;
    } | undefined;
}>;
export type DeploymentMetadata = z.infer<typeof DeploymentMetadataSchema>;
export declare const BuildConfigSchema: z.ZodObject<{
    dockerfile: z.ZodOptional<z.ZodString>;
    buildArgs: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
    target: z.ZodOptional<z.ZodString>;
    platform: z.ZodDefault<z.ZodString>;
    cache: z.ZodDefault<z.ZodBoolean>;
    prune: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    buildArgs: Record<string, string>;
    platform: string;
    cache: boolean;
    prune: boolean;
    target?: string | undefined;
    dockerfile?: string | undefined;
}, {
    target?: string | undefined;
    dockerfile?: string | undefined;
    buildArgs?: Record<string, string> | undefined;
    platform?: string | undefined;
    cache?: boolean | undefined;
    prune?: boolean | undefined;
}>;
export type BuildConfig = z.infer<typeof BuildConfigSchema>;
export declare const DeploymentResultSchema: z.ZodObject<{
    success: z.ZodBoolean;
    deploymentId: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
    logs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    duration: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        status: z.ZodNativeEnum<typeof DeploymentStatus>;
        config: z.ZodObject<{
            provider: z.ZodNativeEnum<typeof CloudProvider>;
            target: z.ZodNativeEnum<typeof DeploymentTarget>;
            region: z.ZodString;
            runtime: z.ZodString;
            memory: z.ZodDefault<z.ZodNumber>;
            timeout: z.ZodDefault<z.ZodNumber>;
            concurrency: z.ZodDefault<z.ZodNumber>;
            minInstances: z.ZodDefault<z.ZodNumber>;
            maxInstances: z.ZodDefault<z.ZodNumber>;
            cpu: z.ZodDefault<z.ZodNumber>;
            env: z.ZodDefault<z.ZodArray<z.ZodObject<{
                key: z.ZodString;
                value: z.ZodOptional<z.ZodString>;
                secret: z.ZodDefault<z.ZodBoolean>;
                secretRef: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                key: string;
                secret: boolean;
                value?: string | undefined;
                secretRef?: string | undefined;
            }, {
                key: string;
                value?: string | undefined;
                secret?: boolean | undefined;
                secretRef?: string | undefined;
            }>, "many">>;
            secrets: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            vpc: z.ZodOptional<z.ZodObject<{
                enabled: z.ZodDefault<z.ZodBoolean>;
                connector: z.ZodOptional<z.ZodString>;
                egress: z.ZodOptional<z.ZodEnum<["all", "private"]>>;
            }, "strip", z.ZodTypeAny, {
                enabled: boolean;
                connector?: string | undefined;
                egress?: "all" | "private" | undefined;
            }, {
                enabled?: boolean | undefined;
                connector?: string | undefined;
                egress?: "all" | "private" | undefined;
            }>>;
            customDomain: z.ZodOptional<z.ZodString>;
            cors: z.ZodOptional<z.ZodObject<{
                enabled: z.ZodDefault<z.ZodBoolean>;
                origins: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                methods: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                headers: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                enabled: boolean;
                origins: string[];
                methods: string[];
                headers: string[];
            }, {
                enabled?: boolean | undefined;
                origins?: string[] | undefined;
                methods?: string[] | undefined;
                headers?: string[] | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            provider: CloudProvider;
            target: DeploymentTarget;
            region: string;
            runtime: string;
            memory: number;
            timeout: number;
            concurrency: number;
            minInstances: number;
            maxInstances: number;
            cpu: number;
            env: {
                key: string;
                secret: boolean;
                value?: string | undefined;
                secretRef?: string | undefined;
            }[];
            secrets: string[];
            cors?: {
                enabled: boolean;
                origins: string[];
                methods: string[];
                headers: string[];
            } | undefined;
            vpc?: {
                enabled: boolean;
                connector?: string | undefined;
                egress?: "all" | "private" | undefined;
            } | undefined;
            customDomain?: string | undefined;
        }, {
            provider: CloudProvider;
            target: DeploymentTarget;
            region: string;
            runtime: string;
            cors?: {
                enabled?: boolean | undefined;
                origins?: string[] | undefined;
                methods?: string[] | undefined;
                headers?: string[] | undefined;
            } | undefined;
            memory?: number | undefined;
            timeout?: number | undefined;
            concurrency?: number | undefined;
            minInstances?: number | undefined;
            maxInstances?: number | undefined;
            cpu?: number | undefined;
            env?: {
                key: string;
                value?: string | undefined;
                secret?: boolean | undefined;
                secretRef?: string | undefined;
            }[] | undefined;
            secrets?: string[] | undefined;
            vpc?: {
                enabled?: boolean | undefined;
                connector?: string | undefined;
                egress?: "all" | "private" | undefined;
            } | undefined;
            customDomain?: string | undefined;
        }>;
        url: z.ZodOptional<z.ZodString>;
        version: z.ZodString;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
        deployedBy: z.ZodOptional<z.ZodString>;
        buildId: z.ZodOptional<z.ZodString>;
        logs: z.ZodOptional<z.ZodString>;
        metrics: z.ZodOptional<z.ZodString>;
        health: z.ZodOptional<z.ZodObject<{
            status: z.ZodEnum<["healthy", "degraded", "unhealthy", "unknown"]>;
            lastCheck: z.ZodOptional<z.ZodDate>;
            checks: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                status: z.ZodEnum<["pass", "fail"]>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                status: "pass" | "fail";
                name: string;
                message?: string | undefined;
            }, {
                status: "pass" | "fail";
                name: string;
                message?: string | undefined;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            status: "unknown" | "healthy" | "degraded" | "unhealthy";
            lastCheck?: Date | undefined;
            checks?: {
                status: "pass" | "fail";
                name: string;
                message?: string | undefined;
            }[] | undefined;
        }, {
            status: "unknown" | "healthy" | "degraded" | "unhealthy";
            lastCheck?: Date | undefined;
            checks?: {
                status: "pass" | "fail";
                name: string;
                message?: string | undefined;
            }[] | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        status: DeploymentStatus;
        name: string;
        version: string;
        config: {
            provider: CloudProvider;
            target: DeploymentTarget;
            region: string;
            runtime: string;
            memory: number;
            timeout: number;
            concurrency: number;
            minInstances: number;
            maxInstances: number;
            cpu: number;
            env: {
                key: string;
                secret: boolean;
                value?: string | undefined;
                secretRef?: string | undefined;
            }[];
            secrets: string[];
            cors?: {
                enabled: boolean;
                origins: string[];
                methods: string[];
                headers: string[];
            } | undefined;
            vpc?: {
                enabled: boolean;
                connector?: string | undefined;
                egress?: "all" | "private" | undefined;
            } | undefined;
            customDomain?: string | undefined;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url?: string | undefined;
        deployedBy?: string | undefined;
        buildId?: string | undefined;
        logs?: string | undefined;
        metrics?: string | undefined;
        health?: {
            status: "unknown" | "healthy" | "degraded" | "unhealthy";
            lastCheck?: Date | undefined;
            checks?: {
                status: "pass" | "fail";
                name: string;
                message?: string | undefined;
            }[] | undefined;
        } | undefined;
    }, {
        status: DeploymentStatus;
        name: string;
        version: string;
        config: {
            provider: CloudProvider;
            target: DeploymentTarget;
            region: string;
            runtime: string;
            cors?: {
                enabled?: boolean | undefined;
                origins?: string[] | undefined;
                methods?: string[] | undefined;
                headers?: string[] | undefined;
            } | undefined;
            memory?: number | undefined;
            timeout?: number | undefined;
            concurrency?: number | undefined;
            minInstances?: number | undefined;
            maxInstances?: number | undefined;
            cpu?: number | undefined;
            env?: {
                key: string;
                value?: string | undefined;
                secret?: boolean | undefined;
                secretRef?: string | undefined;
            }[] | undefined;
            secrets?: string[] | undefined;
            vpc?: {
                enabled?: boolean | undefined;
                connector?: string | undefined;
                egress?: "all" | "private" | undefined;
            } | undefined;
            customDomain?: string | undefined;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url?: string | undefined;
        deployedBy?: string | undefined;
        buildId?: string | undefined;
        logs?: string | undefined;
        metrics?: string | undefined;
        health?: {
            status: "unknown" | "healthy" | "degraded" | "unhealthy";
            lastCheck?: Date | undefined;
            checks?: {
                status: "pass" | "fail";
                name: string;
                message?: string | undefined;
            }[] | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    logs: string[];
    message?: string | undefined;
    url?: string | undefined;
    duration?: number | undefined;
    metadata?: {
        status: DeploymentStatus;
        name: string;
        version: string;
        config: {
            provider: CloudProvider;
            target: DeploymentTarget;
            region: string;
            runtime: string;
            memory: number;
            timeout: number;
            concurrency: number;
            minInstances: number;
            maxInstances: number;
            cpu: number;
            env: {
                key: string;
                secret: boolean;
                value?: string | undefined;
                secretRef?: string | undefined;
            }[];
            secrets: string[];
            cors?: {
                enabled: boolean;
                origins: string[];
                methods: string[];
                headers: string[];
            } | undefined;
            vpc?: {
                enabled: boolean;
                connector?: string | undefined;
                egress?: "all" | "private" | undefined;
            } | undefined;
            customDomain?: string | undefined;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url?: string | undefined;
        deployedBy?: string | undefined;
        buildId?: string | undefined;
        logs?: string | undefined;
        metrics?: string | undefined;
        health?: {
            status: "unknown" | "healthy" | "degraded" | "unhealthy";
            lastCheck?: Date | undefined;
            checks?: {
                status: "pass" | "fail";
                name: string;
                message?: string | undefined;
            }[] | undefined;
        } | undefined;
    } | undefined;
    deploymentId?: string | undefined;
    error?: string | undefined;
}, {
    success: boolean;
    message?: string | undefined;
    url?: string | undefined;
    duration?: number | undefined;
    metadata?: {
        status: DeploymentStatus;
        name: string;
        version: string;
        config: {
            provider: CloudProvider;
            target: DeploymentTarget;
            region: string;
            runtime: string;
            cors?: {
                enabled?: boolean | undefined;
                origins?: string[] | undefined;
                methods?: string[] | undefined;
                headers?: string[] | undefined;
            } | undefined;
            memory?: number | undefined;
            timeout?: number | undefined;
            concurrency?: number | undefined;
            minInstances?: number | undefined;
            maxInstances?: number | undefined;
            cpu?: number | undefined;
            env?: {
                key: string;
                value?: string | undefined;
                secret?: boolean | undefined;
                secretRef?: string | undefined;
            }[] | undefined;
            secrets?: string[] | undefined;
            vpc?: {
                enabled?: boolean | undefined;
                connector?: string | undefined;
                egress?: "all" | "private" | undefined;
            } | undefined;
            customDomain?: string | undefined;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url?: string | undefined;
        deployedBy?: string | undefined;
        buildId?: string | undefined;
        logs?: string | undefined;
        metrics?: string | undefined;
        health?: {
            status: "unknown" | "healthy" | "degraded" | "unhealthy";
            lastCheck?: Date | undefined;
            checks?: {
                status: "pass" | "fail";
                name: string;
                message?: string | undefined;
            }[] | undefined;
        } | undefined;
    } | undefined;
    logs?: string[] | undefined;
    deploymentId?: string | undefined;
    error?: string | undefined;
}>;
export type DeploymentResult = z.infer<typeof DeploymentResultSchema>;
//# sourceMappingURL=deployment.d.ts.map