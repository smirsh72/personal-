/**
 * Handle ultra-smooth transition when arriving at the Ghosted page
 */

document.addEventListener('DOMContentLoaded', function() {
  // Prevent any scroll movement during page load
  document.body.style.overflow = 'hidden';
  
  // Create a fade-in overlay that will fade out after page loads
  const style = document.createElement('style');
  style.textContent = `
    .page-transition-in {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000;
      z-index: 9999;
      opacity: 1;
      transition: opacity 0.4s ease;
    }
    
    body.no-scroll {
      overflow: hidden;
      position: fixed;
      width: 100%;
      top: 0;
      left: 0;
    }
  `;
  document.head.appendChild(style);
  
  // Create the transition overlay element
  const fadeOverlay = document.createElement('div');
  fadeOverlay.className = 'page-transition-in';
  document.body.appendChild(fadeOverlay);
  
  // Add no-scroll class to body
  document.body.classList.add('no-scroll');
  
  // Ensure the page is positioned at the top
  window.scrollTo(0, 0);
  
  // Fade out the overlay after a short delay
  setTimeout(() => {
    fadeOverlay.style.opacity = '0';
    
    // Remove the overlay and restore scrolling after transition completes
    setTimeout(() => {
      fadeOverlay.remove();
      document.body.classList.remove('no-scroll');
      document.body.style.overflow = '';
      // Ensure we're still at the top after transition
      window.scrollTo(0, 0);
    }, 400);
  }, 100);
});
