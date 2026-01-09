// Auto-scroll functionality for screenshots gallery
(function() {
  'use strict';

  const container = document.querySelector('.screenshots-container');
  if (!container) return;

  let scrollAmount = 0;
  let isUserInteracting = false;
  let animationFrameId = null;
  let inactivityTimeout = null;
  const scrollSpeed = 0.5; // pixels per frame
  const inactivityDelay = 3000; // 3 seconds

  function autoScroll() {
    if (isUserInteracting) {
      animationFrameId = null;
      return;
    }

    scrollAmount += scrollSpeed;
    container.scrollLeft = scrollAmount;

    // Reset to beginning when reaching the end
    if (scrollAmount >= container.scrollWidth - container.clientWidth) {
      scrollAmount = 0;
    }

    animationFrameId = requestAnimationFrame(autoScroll);
  }

  function pauseAutoScroll() {
    isUserInteracting = true;
    
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    // Clear existing timeout
    if (inactivityTimeout) {
      clearTimeout(inactivityTimeout);
    }

    // Resume after inactivity
    inactivityTimeout = setTimeout(() => {
      isUserInteracting = false;
      scrollAmount = container.scrollLeft;
      autoScroll();
    }, inactivityDelay);
  }

  // Event listeners for user interaction
  container.addEventListener('touchstart', pauseAutoScroll, { passive: true });
  container.addEventListener('mousedown', pauseAutoScroll);
  container.addEventListener('wheel', pauseAutoScroll, { passive: true });
  container.addEventListener('scroll', () => {
    if (!isUserInteracting) {
      pauseAutoScroll();
    }
  }, { passive: true });

  // Start auto-scroll on page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      autoScroll();
    }, 1000); // Start after 1 second delay
  });

  // Pause when tab is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    } else if (!isUserInteracting) {
      scrollAmount = container.scrollLeft;
      autoScroll();
    }
  });
})();

