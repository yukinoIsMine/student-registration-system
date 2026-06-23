export function getSupabaseEnv() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const url = rawUrl && isHttpUrl(rawUrl) ? rawUrl : "http://127.0.0.1:54321";

  return {
    url,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "local-anon-key",
  };
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
