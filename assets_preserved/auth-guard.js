(async function guardTulipSection() {
  document.documentElement.style.visibility = 'hidden';
  try {
    const response = await fetch('https://api.tulip-pirads.com/api/me', {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Session check failed');
    const user = await response.json();
    if (!user || user.ok !== true) return location.replace('../?login=required');
    document.documentElement.style.visibility = '';
  } catch (_) {
    location.replace('../?login=required');
  }
})();
