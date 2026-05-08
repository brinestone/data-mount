export function isUserSignedIn() {
	const sessionJson = sessionStorage.getItem('session') ?? localStorage.getItem('session')
	return !!sessionJson;
}
