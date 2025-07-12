'use client';

import { useEffect, useRef } from 'react';

export default function FloatingParticles() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // キャンバスサイズをウィンドウに合わせる
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // パーティクルクラス
    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height; // 初期位置をランダムに
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 50;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = -Math.random() * 1.5 - 0.5;
        this.radius = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.life = Math.random() * 200 + 100;
        this.maxLife = this.life;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        // 画面外に出たらリセット
        if (this.y < -50 || this.x < -50 || this.x > canvas.width + 50 || this.life <= 0) {
          this.reset();
        }

        // ふわふわした動き
        this.vx += (Math.random() - 0.5) * 0.02;
        this.vy += (Math.random() - 0.5) * 0.02;
        
        // 速度制限
        this.vx = Math.max(-1, Math.min(1, this.vx));
        this.vy = Math.max(-2, Math.min(0.5, this.vy));
      }

      draw(ctx) {
        const lifeRatio = this.life / this.maxLife;
        const currentOpacity = this.opacity * lifeRatio;
        
        ctx.save();
        ctx.globalAlpha = currentOpacity;
        
        // グラデーション
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, 'rgba(255, 192, 203, 0.9)'); // ピンク
        gradient.addColorStop(0.5, 'rgba(255, 182, 193, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    }

    // パーティクル初期化
    const particleCount = Math.min(50, Math.floor(canvas.width * canvas.height / 15000));
    particlesRef.current = [];
    
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new Particle());
    }

    // アニメーションループ
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        background: 'transparent',
        zIndex: 10
      }}
    />
  );
}