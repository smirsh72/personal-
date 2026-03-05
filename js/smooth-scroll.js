/**
 * Smooth Scroll Navigation
 * Adds smooth scrolling behavior to navigation links
 * Controls header visibility based on scroll position
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get all links inside the navbar
  const navbarLinks = document.querySelectorAll('.navbar-link');
  const navbar = document.querySelector('.navbar');
  const entrySection = document.getElementById('about') || document.getElementById('hero');
  if (!navbar) return;

  const getNavOffset = () => {
    const navHeight = navbar ? navbar.offsetHeight : 0;
    return navHeight + 12;
  };
  const isMobileView = () => window.matchMedia('(max-width: 768px)').matches;
  let lastScrollY = window.scrollY;
  let navHidden = false;
  let rafPending = false;
  
  // Check if we should scroll to hero section (coming back from Ghosted page)
  if (localStorage.getItem('scrollToHero') === 'true') {
    // Clear the flag
    localStorage.removeItem('scrollToHero');
    
    // Scroll to hero section with a slight delay to ensure page is loaded
    setTimeout(() => {
      if (entrySection) {
        window.scrollTo({
          top: Math.max(0, entrySection.offsetTop - getNavOffset()),
          behavior: 'smooth'
        });
      }
    }, 100);
  }
  
  // Add click event listener to each navbar link
  navbarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip processing for the Ghosted link
      if (href === 'ghosted.html') {
        return; // Let the default navigation happen
      }
      
      // Only apply smooth scroll to links that start with #
      if (href.startsWith('#')) {
        e.preventDefault();
        
        const targetId = href === '#' ? (entrySection ? entrySection.id : 'about') : href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: Math.max(0, targetElement.offsetTop - getNavOffset()),
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // Function to control header visibility based on scroll position
  function setNavbarHidden(hidden) {
    if (navHidden === hidden) return;
    navHidden = hidden;
    navbar.classList.toggle('navbar-hidden', hidden);
  }

  function handleHeaderVisibility() {
    rafPending = false;
    if (!entrySection) {
      setNavbarHidden(false);
      return;
    }

    const currentScrollY = window.scrollY;
    const entryBottom = entrySection.getBoundingClientRect().bottom;
    const directionDown = currentScrollY > lastScrollY + 2;
    const directionUp = currentScrollY < lastScrollY - 2;

    // Keep desktop behavior stable; hide-on-scroll is mobile-only.
    if (!isMobileView()) {
      setNavbarHidden(false);
      lastScrollY = currentScrollY;
      return;
    }

    const passedEntry = entryBottom <= 24;
    const nearEntry = entryBottom > 56;

    if (directionUp || nearEntry) {
      setNavbarHidden(false);
    } else if (directionDown && passedEntry) {
      setNavbarHidden(true);
    }

    lastScrollY = currentScrollY;
  }

  function onScroll() {
    if (rafPending) return;
    rafPending = true;
    window.requestAnimationFrame(handleHeaderVisibility);
  }
  
  // Initial check for header visibility
  handleHeaderVisibility();
  
  // Check on scroll
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', handleHeaderVisibility, { passive: true });
});
