/**
 * Ghosted AI Terminal Animation
 * Handles terminal typing effect and response animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Handle navigation from main site to Ghosted page
    const ghostedLink = document.querySelector('a[href="ghosted.html"]');
    if (ghostedLink) {
        ghostedLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'ghosted.html';
        });
    }
    
    // Cursor blinking effect for deploy command
    const deployCommand = document.getElementById('deploy-command');
    if (deployCommand) {
        // After typing animation completes, add blinking cursor
        setTimeout(() => {
            deployCommand.style.borderRight = '2px solid var(--ghosted-green)';
            setInterval(() => {
                if (deployCommand.style.borderRightColor === 'transparent') {
                    deployCommand.style.borderRightColor = 'var(--ghosted-green)';
                } else {
                    deployCommand.style.borderRightColor = 'transparent';
                }
            }, 500);
        }, 5500); // Start after typing animation completes
    }
    
    // Simulate terminal response typing
    const responseLines = document.querySelectorAll('.terminal-deployment .response-line');
    responseLines.forEach((line, index) => {
        // Add a subtle typing effect to each line
        const text = line.innerHTML;
        const words = text.split(' ');
        
        if (index < 3) return; // Skip the first few lines for analysis
        
        // Add a subtle delay between words for lines that show progress
        if (line.classList.contains('success') || 
            line.textContent.includes('RUNNING') || 
            line.classList.contains('final')) {
            
            line.innerHTML = '';
            words.forEach((word, wordIndex) => {
                setTimeout(() => {
                    line.innerHTML += (wordIndex > 0 ? ' ' : '') + word;
                }, wordIndex * 50);
            });
        }
    });
    
    // Add back to portfolio navigation
    const backLink = document.querySelector('.back-link a');
    if (backLink) {
        backLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }
});
