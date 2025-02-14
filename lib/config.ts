const getEnvironmentVariable = (environmentVariable: string): string => {
  // Add debugging
  console.log("Environment check:", {
    variable: environmentVariable,
    value: process.env[environmentVariable],
    isClient: typeof window !== "undefined",
    allEnv: process.env,
  });

  const unvalidatedEnvironmentVariable = process.env[environmentVariable];
  if (!unvalidatedEnvironmentVariable) {
    // Don't throw on client side
    if (typeof window !== "undefined") {
      console.warn(`Missing environment variable: ${environmentVariable}`);
      return "";
    }
    throw new Error(
      `Couldn't find environment variable: ${environmentVariable}`
    );
  }
  return unvalidatedEnvironmentVariable;
};

export const config = {
  supabase: {
    url: getEnvironmentVariable("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: getEnvironmentVariable("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  },
} as const;
