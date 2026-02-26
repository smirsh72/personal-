// This script will clear any saved theme preference and force light mode
localStorage.removeItem('theme');
document.documentElement.setAttribute('data-theme', 'light');
console.log('Theme reset to light mode');
