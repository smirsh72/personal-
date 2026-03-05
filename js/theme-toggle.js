document.addEventListener('DOMContentLoaded', () => {
    // Get the theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let transitionTimer;
    let themeFrameOne;
    let themeFrameTwo;

    const clearThemeTransition = () => {
        clearTimeout(transitionTimer);
        window.cancelAnimationFrame(themeFrameOne);
        window.cancelAnimationFrame(themeFrameTwo);
        root.classList.remove('theme-transitioning');
    };

    const applyTheme = (nextTheme, animate = false) => {
        const setTheme = () => {
            root.setAttribute('data-theme', nextTheme);
            localStorage.setItem('theme', nextTheme);
        };

        if (animate && !prefersReducedMotion.matches) {
            clearThemeTransition();
            root.classList.add('theme-transitioning');

            themeFrameOne = window.requestAnimationFrame(() => {
                themeFrameTwo = window.requestAnimationFrame(() => {
                    setTheme();
                    transitionTimer = window.setTimeout(() => {
                        root.classList.remove('theme-transitioning');
                    }, 280);
                });
            });
            return;
        }

        clearThemeTransition();
        setTheme();
    };
    
    // Check for saved theme preference only
    const savedTheme = localStorage.getItem('theme');
    
    // Apply the saved theme or default to light mode
    if (savedTheme === 'dark') {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', () => {
        // Check current theme
        const currentTheme = root.getAttribute('data-theme') || 'light';
        
        // Toggle theme
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Apply new theme with controlled transition
        applyTheme(newTheme, true);
        
        // Add animation class to the toggle button
        themeToggle.classList.add('theme-toggle-animation');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            themeToggle.classList.remove('theme-toggle-animation');
        }, 500);
    });
    
    // Add hover animation for the toggle button
    themeToggle.addEventListener('mouseenter', () => {
        const currentTheme = root.getAttribute('data-theme') || 'light';
        const icon = currentTheme === 'light' ? 
            themeToggle.querySelector('.moon-icon') : 
            themeToggle.querySelector('.sun-icon');
        if (icon) {
            icon.classList.add('icon-hover-animation');
        }
    });
    
    themeToggle.addEventListener('mouseleave', () => {
        const icons = themeToggle.querySelectorAll('i');
        icons.forEach(icon => {
            icon.classList.remove('icon-hover-animation');
        });
    });
});
