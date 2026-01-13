import { motion } from 'framer-motion';

export const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
};

export const fadeInUpVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
};

export const slideInRight = {
  0: { opacity: 0, x: 50 },
  1: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
};

export const hoverScale = {
  scale: 1.05,
  transition: {
    duration: 0.2,
    ease: "easeOut"
  }
};

export const hoverLift = {
  y: -5,
  transition: {
    duration: 0.2,
    ease: "easeOut"
  }
};

export const buttonVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  },
};

export const cardVariants = {
  initial: { 
    opacity: 0, 
    y: 30,
    scale: 0.95,
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      type: "spring",
      stiffness: 100,
      damping: 15,
    }
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
};

export const loadingVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
};

export const modalVariants = {
  initial: { 
    opacity: 0, 
    scale: 0.8,
    y: 20,
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      type: "spring",
      stiffness: 300,
      damping: 25,
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  },
};

export const overlayVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  },
};

export const messageVariants = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.9,
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      type: "spring",
      stiffness: 200,
      damping: 20,
    }
  },
};

export const notificationVariants = {
  initial: { 
    opacity: 0, 
    x: 100,
    scale: 0.8,
  },
  animate: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      type: "spring",
      stiffness: 200,
      damping: 20,
    }
  },
  exit: { 
    opacity: 0, 
    x: 100,
    scale: 0.8,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  },
};

export const heroVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.2,
    }
  },
};

export const heroItem = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
};

export const mobileMenuVariants = {
  initial: { 
    opacity: 0, 
    x: -100,
    scale: 0.95,
  },
  animate: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      type: "spring",
      stiffness: 300,
      damping: 30,
    }
  },
  exit: { 
    opacity: 0, 
    x: -100,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  },
};

export const scrollReveal = {
  initial: { opacity: 0, y: 50 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      type: "spring",
      stiffness: 100,
      damping: 15,
    }
  },
};

export const textVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
};

export const gradientVariants = {
  animate: {
    background: [
      "linear-gradient(45deg, #3b82f6, #8b5cf6)",
      "linear-gradient(45deg, #8b5cf6, #06b6d4)",
      "linear-gradient(45deg, #06b6d4, #3b82f6)",
    ],
    transition: {
      duration: 8,
      ease: "linear",
      repeat: Infinity,
    }
  },
};

export const responsiveVariants = {
  mobile: {
    message: {
      initial: { opacity: 0, y: 10, scale: 0.95 },
      animate: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          duration: 0.2,
          ease: "easeOut"
        }
      },
    },
    card: {
      initial: { opacity: 0, y: 15, scale: 0.98 },
      animate: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          duration: 0.3,
          ease: "easeOut"
        }
      },
    },
    button: {
      initial: { scale: 1 },
      hover: { scale: 1.05 },
      tap: { scale: 0.95 },
    },
  },
  tablet: {
    message: {
      initial: { opacity: 0, y: 15, scale: 0.9 },
      animate: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          duration: 0.25,
          ease: "easeOut"
        }
      },
    },
    card: {
      initial: { opacity: 0, y: 20, scale: 0.95 },
      animate: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          duration: 0.4,
          ease: "easeOut"
        }
      },
    },
    button: {
      initial: { scale: 1 },
      hover: { scale: 1.08 },
      tap: { scale: 0.92 },
    },
  },
  desktop: {
    message: {
      initial: { opacity: 0, y: 20, scale: 0.9 },
      animate: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          duration: 0.3,
          ease: "easeOut",
          type: "spring",
          stiffness: 200,
          damping: 20,
        }
      },
    },
    card: {
      initial: { opacity: 0, y: 30, scale: 0.95 },
      animate: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          duration: 0.5,
          ease: "easeOut",
          type: "spring",
          stiffness: 100,
          damping: 15,
        }
      },
    },
    button: {
      initial: { scale: 1 },
      hover: { scale: 1.02 },
      tap: { scale: 0.98 },
    },
  },
};

export const createAnimation = (config) => {
  return {
    initial: config.initial || {},
    animate: config.animate || {},
    transition: config.transition || {},
  };
};

export const sidebarVariants = {
  initial: { 
    opacity: 0, 
    x: -50,
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      type: "spring",
      stiffness: 200,
      damping: 25,
    }
  },
};

export const menuItemVariants = {
  initial: { 
    opacity: 0, 
    x: -20,
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  hover: {
    x: 5,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
};

export const getResponsiveVariants = (screenSize, component) => {
  const variants = responsiveVariants[screenSize] || responsiveVariants.desktop;
  return variants[component] || responsiveVariants.desktop[component];
};