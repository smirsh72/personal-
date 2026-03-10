document.addEventListener('DOMContentLoaded', () => {
    // Get the theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    let toggleAnimationTimer;
    
    // Check for saved theme preference only
    const savedTheme = localStorage.getItem('theme');
    
    // Apply the saved theme or default to light mode
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', () => {
        // Check current theme
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        
        // Toggle theme
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Apply new theme
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Save theme preference
        localStorage.setItem('theme', newTheme);
        
        // Replay the click animation on every toggle.
        themeToggle.classList.remove('theme-toggle-animation');
        void themeToggle.offsetWidth;
        themeToggle.classList.add('theme-toggle-animation');
        
        clearTimeout(toggleAnimationTimer);
        toggleAnimationTimer = setTimeout(() => {
            themeToggle.classList.remove('theme-toggle-animation');
        }, 430);
    });
});
