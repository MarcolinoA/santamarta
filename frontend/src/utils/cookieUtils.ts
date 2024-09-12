export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null; // Check for SSR
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// Aggiungi questa funzione di debug
export function logAllCookies() {
  console.log('All cookies:', document.cookie);
}