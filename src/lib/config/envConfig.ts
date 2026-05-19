interface EnvConfig {
    BASE_URL: string;
  }

  export const envConfig: EnvConfig = {
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "/api",
  };

  export function validateEnvConfig(): void {
    const missingVars = Object.entries(envConfig)
      .filter(([, value]) => value === "")
      .map(([key]) => key);
    if (missingVars.length > 0) {
      throw new Error(`Missing environment variables: ${missingVars.join(", ")}`);
    }
  }
  validateEnvConfig();
