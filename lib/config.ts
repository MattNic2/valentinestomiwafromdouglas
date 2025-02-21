const getEnvironmentVariable = (environmentVariable: string): string => {
  const unvalidatedEnvironmentVariable = process.env[environmentVariable];

  // Add more detailed debugging for deployment environments
  if (!unvalidatedEnvironmentVariable) {
    const errorMessage = `Missing environment variable: ${environmentVariable}`;
    console.error(errorMessage, {
      isClient: typeof window !== "undefined",
      nodeEnv: process.env.NODE_ENV,
      availableEnvVars: Object.keys(process.env),
    });

    // Don't throw on client side
    if (typeof window !== "undefined") {
      console.warn(errorMessage);
      return "";
    }
    throw new Error(errorMessage);
  }
  return unvalidatedEnvironmentVariable;
};

// Validate that both Supabase variables exist before creating config
const supabaseUrl = getEnvironmentVariable("NEXT_PUBLIC_SUPABASE_URL");
const supabaseAnonKey = getEnvironmentVariable("NEXT_PUBLIC_SUPABASE_ANON_KEY");

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing required Supabase configuration:", {
    hasUrl: !!supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
  });
}

export const config = {
  supabase: {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  },
} as const;
