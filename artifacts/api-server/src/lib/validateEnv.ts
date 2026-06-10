const REQUIRED_ENV_VARS = [
  "AI_INTEGRATIONS_OPENAI_API_KEY",
  "AI_INTEGRATIONS_OPENAI_BASE_URL",
] as const;

const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(
    `[startup] Missing required environment variable${missing.length > 1 ? "s" : ""}:\n` +
      missing.map((key) => `  - ${key}`).join("\n") +
      "\n\nEnsure all required integrations are provisioned before starting the server.",
  );
  process.exit(1);
}
