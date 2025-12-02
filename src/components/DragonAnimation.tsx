import { useEffect, useRef } from 'react';

interface DragonAnimationProps {
  className?: string;
}

export function DragonAnimation({ className }: DragonAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width || 400;
      canvas.height = rect.height || 300;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Dragon state
    let time = 0;
    const dragon = {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
    };

    // Colors for dragon
    const colors = {
      body: '#FF6B6B',
      belly: '#FFE66D',
      wing: '#4ECDC4',
      eye: '#FF0000',
      fire: '#FF8C00',
    };

    const drawDragon = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Center point
      const centerX = width / 2;
      const centerY = height / 2;

      // Animate dragon position (flying motion)
      dragon.x = centerX + Math.sin(time * 0.5) * 20;
      dragon.y = centerY + Math.cos(time * 0.3) * 15;
      dragon.scale = 1 + Math.sin(time * 0.8) * 0.1;
      dragon.rotation = Math.sin(time * 0.4) * 0.2;

      ctx.save();
      ctx.translate(dragon.x, dragon.y);
      ctx.scale(dragon.scale, dragon.scale);
      ctx.rotate(dragon.rotation);

      // Draw dragon body (oval)
      ctx.fillStyle = colors.body;
      ctx.beginPath();
      ctx.ellipse(0, 0, 60, 40, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw belly (lighter oval)
      ctx.fillStyle = colors.belly;
      ctx.beginPath();
      ctx.ellipse(0, 10, 45, 25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw head
      ctx.fillStyle = colors.body;
      ctx.beginPath();
      ctx.arc(-50, -10, 25, 0, Math.PI * 2);
      ctx.fill();

      // Draw snout
      ctx.beginPath();
      ctx.arc(-70, -5, 12, 0, Math.PI * 2);
      ctx.fill();

      // Draw eyes
      ctx.fillStyle = colors.eye;
      ctx.beginPath();
      ctx.arc(-55, -15, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-50, -15, 6, 0, Math.PI * 2);
      ctx.fill();

      // Draw wings (animated)
      const wingFlap = Math.sin(time * 2) * 0.3;
      
      // Left wing
      ctx.fillStyle = colors.wing;
      ctx.save();
      ctx.translate(-20, -20);
      ctx.rotate(-0.5 + wingFlap);
      ctx.beginPath();
      ctx.ellipse(0, 0, 40, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Right wing
      ctx.save();
      ctx.translate(-20, 20);
      ctx.rotate(0.5 - wingFlap);
      ctx.beginPath();
      ctx.ellipse(0, 0, 40, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw tail
      ctx.strokeStyle = colors.body;
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(50, 0);
      ctx.quadraticCurveTo(80, -20, 100 + Math.sin(time) * 10, -30);
      ctx.stroke();

      // Draw fire breath
      const fireIntensity = (Math.sin(time * 3) + 1) / 2;
      const fireLength = 30 + fireIntensity * 20;
      
      const gradient = ctx.createLinearGradient(-75, -5, -75 - fireLength, -5);
      gradient.addColorStop(0, colors.fire);
      gradient.addColorStop(0.5, '#FF4500');
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(-75, -5, fireLength * 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Draw fire particles
      for (let i = 0; i < 5; i++) {
        const particleX = -75 - fireLength * (0.3 + Math.random() * 0.7);
        const particleY = -5 + (Math.random() - 0.5) * 15;
        const particleSize = 3 + Math.random() * 4;
        
        ctx.fillStyle = `rgba(255, ${140 + Math.random() * 50}, 0, ${0.6 + Math.random() * 0.4})`;
        ctx.beginPath();
        ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Draw sparkles around dragon
      for (let i = 0; i < 8; i++) {
        const angle = (time * 0.5 + i * Math.PI / 4) % (Math.PI * 2);
        const radius = 120 + Math.sin(time + i) * 20;
        const sparkleX = centerX + Math.cos(angle) * radius;
        const sparkleY = centerY + Math.sin(angle) * radius;
        const sparkleSize = 3 + Math.sin(time * 2 + i) * 2;
        
        ctx.fillStyle = `rgba(255, 215, 0, ${0.6 + Math.sin(time * 3 + i) * 0.4})`;
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw sparkle cross
        ctx.strokeStyle = `rgba(255, 215, 0, ${0.8})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sparkleX - sparkleSize, sparkleY);
        ctx.lineTo(sparkleX + sparkleSize, sparkleY);
        ctx.moveTo(sparkleX, sparkleY - sparkleSize);
        ctx.lineTo(sparkleX, sparkleY + sparkleSize);
        ctx.stroke();
      }

      time += 0.02;
    };

    const animate = () => {
      drawDragon();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}

