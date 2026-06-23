import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { Profile, ProfileRole } from "@/types/database";

export async function getSessionProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  return { supabase, user, profile };
}

export async function requireUser() {
  const session = await getSessionProfile();
  if (!session.user) redirect("/login");
  return session;
}

export async function requireRole(roles: ProfileRole[]) {
  const session = await requireUser();
  if (!session.profile || !roles.includes(session.profile.role)) {
    redirect("/");
  }
  return session;
}
