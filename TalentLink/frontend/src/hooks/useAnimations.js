import { useEffect, useState, useRef } from 'react';
import { getResponsiveVariants } from '../utils/animations';

export const useScrollAnimation = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    once: true,
    ...options,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (defaultOptions.once && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        threshold: defaultOptions.threshold,
        rootMargin: defaultOptions.rootMargin,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [defaultOptions.threshold, defaultOptions.rootMargin, defaultOptions.once]);

  return [elementRef, isVisible];
};

export const useParallax = (speed = 0.1) => {
  const [offsetY, setOffsetY] = useState(0);
  const elementRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const parallaxStyle = {
    transform: `translateY(${offsetY * speed}px)`,
  };

  return [elementRef, parallaxStyle];
};

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return mousePosition;
};

export const useReveal = (delay = 0, duration = 0.6) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const revealStyle = {
    opacity: isRevealed ? 1 : 0,
    transform: isRevealed ? 'translateY(0)' : 'translateY(30px)',
    transition: `opacity ${duration}s ease-out, transform ${duration}s ease-out`,
  };

  return [elementRef, revealStyle, isRevealed];
};

export const useTypingAnimation = (text, speed = 50) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!text) return;

    setDisplayText('');
    setIsTyping(true);

    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isTyping };
};

export function useCountUp(end, options = {}, ...rest) {
  // Handle both old syntax (end, duration, start) and new syntax (end, { duration, start, suffix })
  let duration, start, suffix;
  
  if (typeof options === 'number') {
    // Old syntax: useCountUp(end, duration, start)
    duration = options;
    start = rest[0] || 0;
  } else if (typeof options === 'object') {
    // New syntax: useCountUp(end, { duration, start, suffix })
    duration = options.duration || 2000;
    start = options.start || 0;
    suffix = options.suffix || '';
  } else {
    // Default values
    duration = 2000;
    start = 0;
    suffix = '';
  }
  
  const [count, setCount] = useState(start);
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);

  useEffect(() => {
    // Reset to start value when end value changes
    setCount(start);
    
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = Math.round(start + (end - start) * progress);

      if (frame === totalFrames) {
        setCount(end + suffix);
        clearInterval(counter);
      } else {
        setCount(currentCount + suffix);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [end, duration, start, totalFrames, suffix]);

  return count;
};

export const useSpring = (targetValue, config = {}) => {
  const [value, setValue] = useState(targetValue);
  const [velocity, setVelocity] = useState(0);
  const frameRef = useRef();

  const {
    stiffness = 170,
    damping = 26,
    mass = 1,
  } = config;

  useEffect(() => {
    const animate = () => {
      const distance = targetValue - value;
      const springForce = distance * stiffness;
      const dampingForce = velocity * damping;
      const acceleration = (springForce - dampingForce) / mass;
      
      const newVelocity = velocity + acceleration * 0.016;
      const newValue = value + newVelocity * 0.016;

      setVelocity(newVelocity);
      setValue(newValue);

      if (Math.abs(distance) > 0.01 || Math.abs(newVelocity) > 0.01) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [targetValue, value, velocity, stiffness, damping, mass]);

  return value;
};

export const useResponsiveAnimation = (componentType = 'message') => {
  const [screenSize, setScreenSize] = useState('desktop');
  const [animationVariants, setAnimationVariants] = useState({});

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);

    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  useEffect(() => {
    const variants = getResponsiveVariants(screenSize, componentType);
    setAnimationVariants(variants);
  }, [screenSize, componentType]);

  return animationVariants;
};

export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};