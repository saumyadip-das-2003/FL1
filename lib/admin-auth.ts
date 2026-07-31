export const adminTokenStorageKey = "modern-age-admin-token";

export function getFirebaseApiKey() {
  return process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "";
}
