/**
 * Cinematic Transitions Library
 * High-fidelity motion design patterns for ATDB Trade International
 * Preserves original color palette while adding sophisticated motion
 */

import { Variants } from "framer-motion";

// ─────────────────────────────────────────────────────────────────
// IMAGE TRANSITIONS
// ─────────────────────────────────────────────────────────────────

export const imageTransitions = {
  // Main image: Smooth blur-up with scale
  mainImageEnter: {
    initial: { opacity: 0, scale: 1.08, filter: "blur(12px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 0.92, filter: "blur(12px)" },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  } as Variants,

  // Thumbnail: Staggered pop-in with rotation
  thumbnailEnter: {
    initial: { opacity: 0, scale: 0.7, rotate: -8 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    exit: { opacity: 0, scale: 0.5, rotate: 8 },
    transition: { duration: 0.5, ease: "easeOut" },
  } as Variants,

  // Smooth cross-fade for rapid switching
  crossFade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.4 },
  } as Variants,

  // Directional slide: Left to right
  slideInFromLeft: {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 60 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  } as Variants,

  // Directional slide: Right to left
  slideInFromRight: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  } as Variants,
};

// ─────────────────────────────────────────────────────────────────
// FILTER & BUTTON TRANSITIONS
// ─────────────────────────────────────────────────────────────────

export const filterTransitions = {
  // Filter button: Elastic response
  filterButtonHover: {
    scale: 1.05,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },

  filterButtonTap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },

  // Active filter indicator: Smooth background transition
  activeFilterBackground: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { type: "spring", stiffness: 300, damping: 30 },
  } as Variants,

  // Filter container: Staggered children
  filterContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  } as Variants,
};

// ─────────────────────────────────────────────────────────────────
// TEXT & OVERLAY TRANSITIONS
// ─────────────────────────────────────────────────────────────────

export const textTransitions = {
  // Equipment name: Fade + slide up
  equipmentNameEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.6, ease: "easeOut", delay: 0.1 },
  } as Variants,

  // Equipment ID badge: Pop in with scale
  equipmentIdEnter: {
    initial: { opacity: 0, scale: 0.6 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.4 },
    transition: { duration: 0.4, ease: "easeOut" },
  } as Variants,

  // Overlay gradient: Fade in
  overlayFadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.8 },
  } as Variants,

  // Status text: Subtle pulse
  statusPulse: {
    animate: {
      opacity: [1, 0.7, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  } as Variants,
};

// ─────────────────────────────────────────────────────────────────
// CONTAINER & LAYOUT TRANSITIONS
// ─────────────────────────────────────────────────────────────────

export const layoutTransitions = {
  // Main gallery container: Smooth layout shift
  galleryContainer: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
  } as Variants,

  // Sidebar gallery: Staggered thumbnail grid
  thumbnailGrid: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.2,
      },
    },
  } as Variants,

  // Info panel: Slide up from bottom
  infoPanelEnter: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 30 },
    transition: { duration: 0.6, ease: "easeOut" },
  } as Variants,

  // Error message: Bounce in
  errorMessageEnter: {
    initial: { opacity: 0, y: -20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
    transition: { type: "spring", stiffness: 300, damping: 20 },
  } as Variants,
};

// ─────────────────────────────────────────────────────────────────
// LOADING & SKELETON TRANSITIONS
// ─────────────────────────────────────────────────────────────────

export const loadingTransitions = {
  // Skeleton shimmer: Smooth wave effect
  skeletonShimmer: {
    animate: {
      backgroundPosition: ["200% 0", "-200% 0"],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      },
    },
  } as Variants,

  // Loading spinner: Smooth rotation
  loadingSpinner: {
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      },
    },
  } as Variants,

  // Skeleton fade out when content loads
  skeletonFadeOut: {
    exit: { opacity: 0, transition: { duration: 0.3 } },
  } as Variants,

  // Content fade in
  contentFadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5, delay: 0.2 },
  } as Variants,
};

// ─────────────────────────────────────────────────────────────────
// BUTTON & INTERACTIVE TRANSITIONS
// ─────────────────────────────────────────────────────────────────

export const buttonTransitions = {
  // Primary button: Glow on hover
  primaryButtonHover: {
    scale: 1.02,
    boxShadow: "0 0 30px rgba(184, 134, 11, 0.5)",
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },

  primaryButtonTap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },

  // Refresh button: Spin animation
  refreshButtonSpin: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      },
    },
  } as Variants,

  // Live indicator: Pulse effect
  liveIndicatorPulse: {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.7, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  } as Variants,
};

// ─────────────────────────────────────────────────────────────────
// STAGGER SEQUENCES
// ─────────────────────────────────────────────────────────────────

export const staggerSequences = {
  // Stagger children with delay
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  } as Variants,

  // Stagger with faster timing
  fastStagger: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  } as Variants,

  // Stagger with slow timing
  slowStagger: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5,
      },
    },
  } as Variants,
};

// ─────────────────────────────────────────────────────────────────
// EASING FUNCTIONS
// ─────────────────────────────────────────────────────────────────

export const easingFunctions = {
  // Smooth cubic bezier
  smoothOut: [0.22, 1, 0.36, 1],
  // Elastic feel
  elastic: [0.175, 0.885, 0.32, 1.275],
  // Sharp entrance
  sharpIn: [0.4, 0, 1, 1],
  // Smooth exit
  smoothExit: [0, 0, 0.58, 1],
};

// ─────────────────────────────────────────────────────────────────
// SPRING PHYSICS
// ─────────────────────────────────────────────────────────────────

export const springPhysics = {
  // Bouncy spring
  bouncy: { type: "spring", stiffness: 300, damping: 10, mass: 1 },
  // Smooth spring
  smooth: { type: "spring", stiffness: 200, damping: 20, mass: 1 },
  // Tight spring
  tight: { type: "spring", stiffness: 400, damping: 30, mass: 1 },
  // Loose spring
  loose: { type: "spring", stiffness: 100, damping: 10, mass: 1 },
};
