export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null; // Check for SSR
  const cookies = document.cookie.split(';');
  console.log('All cookies:', cookies); // Debug line
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
    console.log('Checking cookie:', cookieName, cookieValue); // Debug line
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/* Aggiungi questa funzione di debug
export function logAllCookies() {
  console.log('All cookies:', document.cookie);
} */