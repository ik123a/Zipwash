import React from 'react';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
}

export function AnimatedBackground({ children }: AnimatedBackgroundProps) {
  return (
    <div className="animated-page">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="animated-bg-gradient" />
        <div className="animated-bg-pattern" />
        {/* Floating Bubbles */}
        <div className="animated-bubble animated-bubble-1" />
        <div className="animated-bubble animated-bubble-2" />
        <div className="animated-bubble animated-bubble-3" />
        <div className="animated-bubble animated-bubble-4" />
        <div className="animated-bubble animated-bubble-5" />
      </div>

      {/* Content */}
      <div className="animated-content">
        {children}
      </div>

      {/* Styles */}
      <style>{`
        .animated-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
        }

        .animated-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
        }

        .animated-bg-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            #0f172a 0%,
            #1e293b 25%,
            #0c4a6e 50%,
            #164e63 75%,
            #0f172a 100%
          );
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }

        .animated-bg-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          background-image:
            radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, white 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .animated-bubble {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(14, 165, 233, 0.08));
          backdrop-filter: blur(2px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          animation: float linear infinite;
        }

        .animated-bubble-1 {
          width: 300px; height: 300px;
          left: -80px; top: -80px;
          animation-duration: 20s;
        }
        .animated-bubble-2 {
          width: 200px; height: 200px;
          right: -60px; top: 30%;
          animation-duration: 25s;
          animation-delay: -5s;
        }
        .animated-bubble-3 {
          width: 150px; height: 150px;
          left: 15%; bottom: 10%;
          animation-duration: 18s;
          animation-delay: -3s;
        }
        .animated-bubble-4 {
          width: 100px; height: 100px;
          right: 20%; bottom: 25%;
          animation-duration: 22s;
          animation-delay: -8s;
        }
        .animated-bubble-5 {
          width: 180px; height: 180px;
          left: 50%; top: -50px;
          animation-duration: 28s;
          animation-delay: -12s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          25% { transform: translateY(-30px) rotate(5deg) scale(1.03); }
          50% { transform: translateY(-15px) rotate(-3deg) scale(0.97); }
          75% { transform: translateY(-40px) rotate(4deg) scale(1.02); }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animated-content {
          position: relative;
          z-index: 10;
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
}
