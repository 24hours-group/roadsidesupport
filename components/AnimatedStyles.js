// Shared animation styles for rescue flow pages
// CSS Module export for use in components
import styles from "./AnimatedStyles.module.css";

// Export individual animation classes for use in components
export const animationClasses = {
  pulseRing: styles.pulseRing,
  pulseRingDelayed: styles.pulseRingDelayed,
  gentleBounce: styles.gentleBounce,
  fadeInUp: styles.fadeInUp,
  fadeInUp1: styles.fadeInUp1,
  fadeInUp2: styles.fadeInUp2,
  fadeInUp3: styles.fadeInUp3,
  fadeInUp4: styles.fadeInUp4,
  fadeInUp5: styles.fadeInUp5,
  float: styles.float,
  shimmerText: styles.shimmerText,
};

// Legacy support: Keep the inline styles for backward compatibility
// This can be removed once all components migrate to CSS modules
export const animationStyles = `
  @keyframes pulse-ring {
    0% { transform: scale(0.8); opacity: 0.8; }
    50% { transform: scale(1.2); opacity: 0; }
    100% { transform: scale(0.8); opacity: 0; }
  }
  @keyframes pulse-ring-delayed {
    0% { transform: scale(0.8); opacity: 0; }
    25% { transform: scale(0.8); opacity: 0.8; }
    75% { transform: scale(1.2); opacity: 0; }
    100% { transform: scale(0.8); opacity: 0; }
  }
  @keyframes gentle-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  .animate-pulse-ring {
    animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  .animate-pulse-ring-delayed {
    animation: pulse-ring-delayed 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  .animate-gentle-bounce {
    animation: gentle-bounce 2s ease-in-out infinite;
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.6s ease-out forwards;
  }
  .animate-fade-in-up-1 { animation-delay: 0.1s; opacity: 0; }
  .animate-fade-in-up-2 { animation-delay: 0.2s; opacity: 0; }
  .animate-fade-in-up-3 { animation-delay: 0.3s; opacity: 0; }
  .animate-fade-in-up-4 { animation-delay: 0.4s; opacity: 0; }
  .animate-fade-in-up-5 { animation-delay: 0.5s; opacity: 0; }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  .shimmer-text {
    background: linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 100%);
    background-size: 200% 100%;
    animation: shimmer 3s linear infinite;
  }
`;

export default function AnimatedStyles() {
  return <style>{animationStyles}</style>;
}

// Also export the styles object for direct CSS module usage
export { styles };
