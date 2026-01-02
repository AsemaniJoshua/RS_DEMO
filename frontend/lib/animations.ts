// Scroll animation utilities using Intersection Observer
export function addScrollAnimations() {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
               }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Observe all elements with animate classes
    document.querySelectorAll('.fade-in, .slide-up, .slide-in-left, .slide-in-right, .scale-in').forEach((el) => {
        observer.observe(el);
    });

    return () => observer.disconnect();
}

// Animation CSS classes (add to globals.css)
export const animationStyles = `
  /* Base states - hidden before animation */
  .fade-in:not(.animate-in) {
    opacity: 0;
  }
  
  .slide-up:not(.animate-in) {
    opacity: 0;
    transform: translateY(30px);
  }
  
  .slide-in-left:not(.animate-in) {
    opacity: 0;
    transform: translateX(-30px);
  }
  
  .slide-in-right:not(.animate-in) {
    opacity: 0;
    transform: translateX(30px);
  }
  
  .scale-in:not(.animate-in) {
    opacity: 0;
    transform: scale(0.95);
  }
  
  /* Animated states */
  .animate-in {
    opacity: 1;
    transform: translate(0, 0) scale(1);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }
  
  /* Staggered animations for children */
  .stagger-children > * {
    opacity: 0;
    transform: translateY(20px);
  }
  
  .stagger-children.animate-in > * {
    animation: staggerFadeIn 0.5s ease-out forwards;
  }
  
  .stagger-children.animate-in > *:nth-child(1) { animation-delay: 0.1s; }
  .stagger-children.animate-in > *:nth-child(2) { animation-delay: 0.2s; }
  .stagger-children.animate-in > *:nth-child(3) { animation-delay: 0.3s; }
  .stagger-children.animate-in > *:nth-child(4) { animation-delay: 0.4s; }
  .stagger-children.animate-in > *:nth-child(5) { animation-delay: 0.5s; }
  .stagger-children.animate-in > *:nth-child(6) { animation-delay: 0.6s; }
  
  @keyframes staggerFadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Respect user preferences */
  @media (prefers-reduced-motion: reduce) {
    .fade-in, .slide-up, .slide-in-left, .slide-in-right, .scale-in,
    .stagger-children > * {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
      animation: none !important;
    }
  }
`;
