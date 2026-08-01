export const adminTokenStorageKey = "modern-age-admin-token";
export const adminEmailStorageKey = "modern-age-admin-email";
export const protectedAdminEmail = "studio.modern.age@gmail.com";

export function getFirebaseApiKey() {
  return process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "";
}

export function isProtectedAdminEmail(email: string) {
  return email.trim().toLowerCase() === protectedAdminEmail;
}
