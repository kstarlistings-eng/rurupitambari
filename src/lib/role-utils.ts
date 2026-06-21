export const ROLE_DEFAULT_PATHS: Record<string, string> = {
  admin_finance: "/",
  production_operator: "/production",
  store_operator: "/store",
};

export function getHomePath(role: string | undefined): string {
  if (!role) return "/login";
  return ROLE_DEFAULT_PATHS[role] || "/login";
}
