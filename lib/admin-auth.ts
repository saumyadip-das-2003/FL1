export const adminTokenStorageKey = "modern-age-admin-token";
export const adminEmailStorageKey = "modern-age-admin-email";

export function getFirebaseApiKey() {
  return process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "";
}
