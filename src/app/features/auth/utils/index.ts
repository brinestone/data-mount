import { environment } from '~/environments/environment';

export function isUserSignedIn() {
  const sessionJson = sessionStorage.getItem('session') ?? localStorage.getItem('session');
  const hasSessionCookie = !!getCookie(environment.sessionIdKey);
  return !!sessionJson && hasSessionCookie;
}

export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
  return null;
}
