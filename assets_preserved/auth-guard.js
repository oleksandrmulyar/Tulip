(async function guardTulipSection() {
  document.documentElement.style.visibility = 'hidden';
  try {
    const response = await fetch('https://api.tulip-pirads.com/api/me', { credentials: 'include' });
    const user = await response.json();
    if (!user.ok) return location.replace('../?login=required');
    document.documentElement.style.visibility = '';
  } catch (_) {
    location.replace('../?login=required');
  }
})();
