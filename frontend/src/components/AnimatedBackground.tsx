import { useEffect, useRef } from "react";

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Detect mobile device
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    // Create particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      hue: number;
    }> = [];

    // Reduce particle count on mobile for better performance
    const particleCount = isMobile ? 40 : isTablet ? 60 : 80;
    const connectionDistance = isMobile ? 120 : 150;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        hue: 217 + Math.random() * 30,
      });
    }

    let animationId: number;
    let startTime = Date.now();
    const cycleDuration = 120000; // 2 minutes in milliseconds (1 min drawing + 1 min erasing)
    const drawingPhase = 60000; // 1 minute for drawing
    const erasingPhase = 60000; // 1 minute for erasing

    const animate = () => {
      if (!ctx) return;
      
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) % cycleDuration;
      
      // Determine which phase we're in
      const isDrawingPhase = elapsed < drawingPhase;
      const phaseProgress = isDrawingPhase 
        ? elapsed / drawingPhase // 0 to 1 during drawing
        : (elapsed - drawingPhase) / erasingPhase; // 0 to 1 during erasing
      
      if (isDrawingPhase) {
        // Drawing phase: light fade to build up traces gradually
        // Start with very light fade, gradually increase as pattern builds
        const fadeIntensity = 0.015 + (phaseProgress * 0.025); // 0.015 to 0.04
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeIntensity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        // Erasing phase: progressively stronger fade to completely erase traces
        // Start strong to erase quickly, then maintain moderate fade
        const eraseIntensity = 0.25 - (phaseProgress * 0.15); // 0.25 to 0.1
        ctx.fillStyle = `rgba(0, 0, 0, ${eraseIntensity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Update and draw particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Connect nearby particles - these are visible
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = 1 - distance / connectionDistance;
            // Use colorful gradient for connections - reduced intensity
            ctx.globalCompositeOperation = "lighter";
            const gradient = ctx.createLinearGradient(
              particle.x,
              particle.y,
              otherParticle.x,
              otherParticle.y
            );
            gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 60%, ${opacity * 0.08})`);
            gradient.addColorStop(0.5, `hsla(${Math.floor((particle.hue + otherParticle.hue) / 2)}, 70%, 55%, ${opacity * 0.1})`);
            gradient.addColorStop(1, `hsla(${otherParticle.hue}, 70%, 60%, ${opacity * 0.08})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.15;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Reposition particles if needed when resizing
      particles.forEach((particle) => {
        if (particle.x > canvas.width) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = canvas.height;
      });
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full z-0 pointer-events-none"
        style={{ filter: "blur(0.5px)", opacity: 0.6 }}
      />
      
      {/* 3D Gradient Orb Effects - Hidden on mobile for performance */}
      <div className="hidden md:block fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-float" style={{ animationDuration: "15s" }}>
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-transparent rounded-full animate-rotate" style={{ animationDuration: "20s" }}></div>
        </div>
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDuration: "12s", animationDelay: "2s" }}>
          <div className="w-full h-full bg-gradient-to-bl from-primary/8 to-transparent rounded-full animate-rotate" style={{ animationDuration: "25s", animationDirection: "reverse" }}></div>
        </div>
        <div className="absolute top-[50%] left-[50%] w-64 h-64 bg-primary/3 rounded-full blur-2xl animate-float" style={{ animationDuration: "18s", animationDelay: "4s" }}>
          <div className="w-full h-full bg-gradient-to-tr from-primary/5 to-transparent rounded-full animate-rotate" style={{ animationDuration: "30s" }}></div>
        </div>
        <div className="absolute bottom-[30%] left-[20%] w-72 h-72 bg-primary/4 rounded-full blur-3xl animate-float" style={{ animationDuration: "14s", animationDelay: "6s" }}>
          <div className="w-full h-full bg-gradient-to-tl from-primary/6 to-transparent rounded-full animate-rotate" style={{ animationDuration: "22s", animationDirection: "reverse" }}></div>
        </div>
      </div>

      {/* Grid pattern overlay - Hidden on mobile */}
      <div className="hidden md:block fixed inset-0 pointer-events-none z-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(55, 125, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(55, 125, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            animation: "gradient 60s ease infinite"
          }}
        />
      </div>

      {/* Scanning line effect - Hidden on mobile */}
      <div className="hidden md:block fixed inset-0 pointer-events-none z-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent animate-gradient" style={{ height: "200%", animation: "gradient-shift 4s linear infinite" }}></div>
      </div>
    </>
  );
};

export default AnimatedBackground;

