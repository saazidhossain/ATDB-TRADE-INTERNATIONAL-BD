/**
 * Cinematic Transitions Library
 * High-fidelity motion design patterns for ATDB Trade International
 * Preserves original color palette while adding sophisticated motion
 */

import type { Variants, Transition } from "framer-motion";

type CubicBezier = [number, number, number, number];

// ─────────────────────────────────────────────────────────────────
// IMAGE TRANSITIONS
// ─────────────────────────────────────────────────────────────────

export const imageTransitions = {
  mainImageEnter: {
    initial: { opacity: 0, scale: 1.08, filter: "blur(12px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 0.92, filter: "blur(12px)" },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as CubicBezier },
  } as Variants,

  thumbnailEnter: {
    initial: { opacity: 0, scale: 0.7, rotate: -8 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    exit: { opacity: 0, scale: 0.5, rotate: 8 },
    transition: { duration: 0.5, ease: "easeOut" as const },
  } as Variants,

  crossFade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.4 },
  } as Variants,

  slideInFromLeft: {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 60 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as CubicBezier },
  } as Variants,

  slideInFromRight: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as CubicBezier },
  } as Variants,
};

// ─────────────────────────────────────────────────────────────────
// FILTER & BUTTON TRANSITIONS
// ─────────────────────────────────────────────────────────────────

export const filterTransitions = {
  filterButtonHover: {
    scale: 1.05,
    transition: { type: "spring" as const, stiffness: 400, damping: 10 },
  },

  filterButtonTap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },

  activeFilterBackground: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  } as Variants,

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
  equipmentNameEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.6, ease: "easeOut" as const, delay: 0.1 },
  } as Variants,

  equipmentIdEnter: {
    initial: { opacity: 0, scale: 0.6 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.4 },
    transition: { duration: 0.4, ease: "easeOut" as const },
  } as Variants,

  overlayFadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.8 },
  } as Variants,

  statusPulse: {
    animate: {
      opacity: [1, 0.7, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  } as Variants,
};

// ─────────────────────────────────────────────────────────────────
// CONTAINER & LAYOUT TRANSITIONS
// ─────────────────────────────────────────────────────────────────

export const layoutTransitions = {
  galleryContainer: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
  } as Variants,

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

  infoPanelEnter: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 30 },
    transition: { duration: 0.6, ease: "easeOut" as const },
  } as Variants,

  errorMessageEnter: {
    initial: { opacity: 0, y: -20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  } as Variants,
};

// ─────────────────────────────────────────────────────────────────
// LOADING & SKELETON TRANSITIONS
// ─────────────────────────────────────────────────────────────────

export const loadingTransitions = {
  skeletonShimmer: {
    animate: {
      backgroundPosition: ["200% 0", "-200% 0"],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear" as const,
      },
    },
  } as Variants,

  loadingSpinner: {
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear" as const,
      },
    },
  } as Variants,

  skeletonFadeOut: {
    exit: { opacity: 0, transition: { duration: 0.3 } },
  } as Variants,

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
  primaryButtonHover: {
    scale: 1.02,
    boxShadow: "0 0 30px rgba(184, 134, 11, 0.5)",
    transition: { type: "spring" as const, stiffness: 400, damping: 10 },
  },

  primaryButtonTap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },

  refreshButtonSpin: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear" as const,
      },
    },
  } as Variants,

  liveIndicatorPulse: {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.7, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  } as Variants,
};

// ─────────────────────────────────────────────────────────────────
// STAGGER SEQUENCES
// ─────────────────────────────────────────────────────────────────

export const staggerSequences = {
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
  smoothOut: [0.22, 1, 0.36, 1] as CubicBezier,
  elastic: [0.175, 0.885, 0.32, 1.275] as CubicBezier,
  sharpIn: [0.4, 0, 1, 1] as CubicBezier,
  smoothExit: [0, 0, 0.58, 1] as CubicBezier,
};

// ─────────────────────────────────────────────────────────────────
// SPRING PHYSICS
// ─────────────────────────────────────────────────────────────────

export const springPhysics: Record<string, Transition> = {
  bouncy: { type: "spring", stiffness: 300, damping: 10, mass: 1 },
  smooth: { type: "spring", stiffness: 200, damping: 20, mass: 1 },
  tight: { type: "spring", stiffness: 400, damping: 30, mass: 1 },
  loose: { type: "spring", stiffness: 100, damping: 10, mass: 1 },
};
