export function isDarkTheme(): boolean {
  return localStorage.getItem('darkmode') === ('' + true);
}

export function setDarkTheme(isDark: boolean) {
  localStorage.setItem('darkmode', '' + isDark);
  document.dispatchEvent(new CustomEvent('darkmode', {detail: {dark: isDark}}));
}