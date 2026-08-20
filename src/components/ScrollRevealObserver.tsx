'use client';

import { useEffect } from 'react';

export default function ScrollRevealObserver() {
  useEffect(() => {
    // 1. Scroll Reveal avec IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    // 2. Effet Parallaxe au défilement
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const heroVideo = document.querySelector<HTMLElement>('.hero-video-bg');
      if (heroVideo && scrolled < window.innerHeight * 1.5) {
        heroVideo.style.transform = `translate3d(0, ${scrolled * 0.35}px, 0)`;
      }

      const parallaxLayers = document.querySelectorAll<HTMLElement>('.parallax-layer');
      parallaxLayers.forEach((layer) => {
        const speed = parseFloat(layer.dataset.speed || '0.2');
        layer.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null;
}
