/**
 * Seamless transition for Ghosted page back navigation
 */

document.addEventListener('DOMContentLoaded', function() {
  // Set up the back button navigation
  const backLink = document.querySelector('.back-link a');
  if (backLink) {
    backLink.addEventListener('click', handleBackNavigation);
  }
  
  // Preload the portfolio page for instant transition
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.as = 'document';
  preloadLink.href = 'index.html';
  document.head.appendChild(preloadLink);
});

/**
 * Handle back navigation with instant transition
 */
function handleBackNavigation(e) {
  e.preventDefault();
  
  // Create a fade transition overlay
  const fadeOverlay = document.createElement('div');
  fadeOverlay.style.position = 'fixed';
  fadeOverlay.style.top = '0';
  fadeOverlay.style.left = '0';
  fadeOverlay.style.width = '100%';
  fadeOverlay.style.height = '100%';
  fadeOverlay.style.backgroundColor = '#000';
  fadeOverlay.style.zIndex = '9999';
  fadeOverlay.style.opacity = '0';
  fadeOverlay.style.transition = 'opacity 0.3s ease';
  document.body.appendChild(fadeOverlay);
  
  // Prevent scrolling
  document.body.style.overflow = 'hidden';
  
  // Set flags for the main page to show hero immediately
  sessionStorage.setItem('bypassLoading', 'true');
  sessionStorage.setItem('directToHero', 'true');
  sessionStorage.setItem('instantTransition', 'true');
  
  // Fade in the overlay
  setTimeout(() => {
    fadeOverlay.style.opacity = '1';
    
    // Navigate after fade completes
    setTimeout(() => {
      window.location.href = 'index.html?skipLoading=true#hero';
    }, 300);
  }, 10);
  
  return false;
}
