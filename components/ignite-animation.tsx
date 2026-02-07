'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: { r: number; g: number; b: number };
    type: 'ember' | 'spark' | 'flame';
    opacity: number;
}

interface AnimationPhase {
    current: 'ember' | 'igniting' | 'peak' | 'idle';
    progress: number;
}

// ============================================================================
// COLOR PALETTE
// ============================================================================

const COLORS = {
    ember: { r: 255, g: 100, b: 50 },
    emberCore: { r: 255, g: 200, b: 100 },
    flameOuter: { r: 255, g: 69, b: 0 },
    flameMid: { r: 255, g: 140, b: 0 },
    flameInner: { r: 255, g: 215, b: 0 },
    spark: { r: 255, g: 255, b: 200 },
    white: { r: 255, g: 255, b: 255 },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

function randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

function easeOutQuart(t: number): number {
    return 1 - Math.pow(1 - t, 4);
}

function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ============================================================================
// PARTICLE CREATION
// ============================================================================

function createEmberParticle(centerX: number, centerY: number): Particle {
    const angle = Math.random() * Math.PI * 2;
    const distance = randomRange(0, 8);
    return {
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        vx: randomRange(-0.3, 0.3),
        vy: randomRange(-0.8, -0.3),
        life: 1,
        maxLife: randomRange(60, 120),
        size: randomRange(2, 5),
        color: Math.random() > 0.5 ? COLORS.ember : COLORS.emberCore,
        type: 'ember',
        opacity: 1,
    };
}

function createSparkParticle(centerX: number, centerY: number, intensity: number): Particle {
    const angle = randomRange(-Math.PI * 0.8, -Math.PI * 0.2);
    const speed = randomRange(2, 6) * intensity;
    return {
        x: centerX + randomRange(-20, 20) * intensity,
        y: centerY + randomRange(-10, 10),
        vx: Math.cos(angle) * speed * randomRange(-1, 1),
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: randomRange(30, 60),
        size: randomRange(1, 3),
        color: COLORS.spark,
        type: 'spark',
        opacity: 1,
    };
}

function createFlameParticle(centerX: number, centerY: number, intensity: number): Particle {
    const spread = 60 * intensity;
    const colorChoice = Math.random();
    let color;
    if (colorChoice < 0.3) {
        color = COLORS.flameOuter;
    } else if (colorChoice < 0.6) {
        color = COLORS.flameMid;
    } else if (colorChoice < 0.9) {
        color = COLORS.flameInner;
    } else {
        color = COLORS.white;
    }

    return {
        x: centerX + randomRange(-spread, spread),
        y: centerY + randomRange(-10, 20),
        vx: randomRange(-1, 1) * intensity,
        vy: randomRange(-4, -1.5) * (0.5 + intensity * 0.5),
        life: 1,
        maxLife: randomRange(40, 100),
        size: randomRange(8, 25) * intensity,
        color,
        type: 'flame',
        opacity: 1,
    };
}

// ============================================================================
// IGNITE ANIMATION COMPONENT
// ============================================================================

interface IgniteAnimationProps {
    className?: string;
    showText?: boolean;
    textContent?: string;
    autoIgnite?: boolean;
    igniteDelay?: number;
}

export default function IgniteAnimation({
    className = '',
    showText = true,
    textContent = 'Ignite',
    autoIgnite = true,
    igniteDelay = 1500,
}: IgniteAnimationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const phaseRef = useRef<AnimationPhase>({ current: 'ember', progress: 0 });
    const animationIdRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

    const [textVisible, setTextVisible] = useState(false);
    const [textOpacity, setTextOpacity] = useState(0);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    // Handle resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setDimensions({ width: rect.width, height: rect.height });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Mouse interaction
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                mouseRef.current = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                    active: true,
                };
            }
        };

        const handleMouseLeave = () => {
            mouseRef.current.active = false;
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
                container.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    // Main animation loop
    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const { width, height } = dimensions;
        const centerX = width / 2;
        const centerY = height * 0.6;
        const phase = phaseRef.current;
        const now = performance.now();
        const elapsed = now - startTimeRef.current;

        // Clear with fade effect for trails
        ctx.fillStyle = 'rgba(10, 10, 15, 0.15)';
        ctx.fillRect(0, 0, width, height);

        // ========================================================================
        // PHASE MANAGEMENT
        // ========================================================================

        if (phase.current === 'ember') {
            // Gentle ember phase
            if (elapsed > igniteDelay && autoIgnite) {
                phase.current = 'igniting';
                phase.progress = 0;
            }

            // Create occasional ember particles
            if (Math.random() < 0.1) {
                particlesRef.current.push(createEmberParticle(centerX, centerY));
            }

            // Draw central ember glow
            const emberPulse = 0.7 + Math.sin(elapsed * 0.003) * 0.3;
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40);
            gradient.addColorStop(0, `rgba(255, 200, 100, ${0.9 * emberPulse})`);
            gradient.addColorStop(0.3, `rgba(255, 120, 50, ${0.6 * emberPulse})`);
            gradient.addColorStop(0.7, `rgba(255, 69, 0, ${0.3 * emberPulse})`);
            gradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

        } else if (phase.current === 'igniting') {
            phase.progress = Math.min(1, phase.progress + 0.008);
            const intensity = easeOutQuart(phase.progress);

            // Create particles based on ignition progress
            const flameCount = Math.floor(3 + intensity * 8);
            for (let i = 0; i < flameCount; i++) {
                particlesRef.current.push(createFlameParticle(centerX, centerY, intensity));
            }

            if (Math.random() < 0.3 + intensity * 0.5) {
                particlesRef.current.push(createSparkParticle(centerX, centerY, intensity));
            }

            // Draw expanding glow
            const glowSize = 50 + intensity * 200;
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowSize);
            gradient.addColorStop(0, `rgba(255, 220, 150, ${0.8 * intensity})`);
            gradient.addColorStop(0.2, `rgba(255, 140, 50, ${0.6 * intensity})`);
            gradient.addColorStop(0.5, `rgba(255, 69, 0, ${0.3 * intensity})`);
            gradient.addColorStop(1, 'rgba(255, 30, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            if (phase.progress >= 1) {
                phase.current = 'peak';
                phase.progress = 0;
                if (showText) {
                    setTextVisible(true);
                }
            }

        } else if (phase.current === 'peak') {
            phase.progress = Math.min(1, phase.progress + 0.005);
            const intensity = 1;

            // Text fade in
            if (showText && phase.progress < 0.5) {
                setTextOpacity(easeInOutCubic(phase.progress * 2));
            } else if (showText) {
                setTextOpacity(1);
            }

            // Steady flame production
            for (let i = 0; i < 6; i++) {
                particlesRef.current.push(createFlameParticle(centerX, centerY, intensity));
            }

            if (Math.random() < 0.4) {
                particlesRef.current.push(createSparkParticle(centerX, centerY, intensity));
            }

            // Full glow
            const pulse = 0.9 + Math.sin(elapsed * 0.002) * 0.1;
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 280);
            gradient.addColorStop(0, `rgba(255, 230, 180, ${0.7 * pulse})`);
            gradient.addColorStop(0.15, `rgba(255, 160, 60, ${0.5 * pulse})`);
            gradient.addColorStop(0.4, `rgba(255, 80, 20, ${0.25 * pulse})`);
            gradient.addColorStop(1, 'rgba(200, 50, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            if (phase.progress >= 1) {
                phase.current = 'idle';
            }

        } else if (phase.current === 'idle') {
            // Gentle idle flame
            const idlePulse = 0.6 + Math.sin(elapsed * 0.002) * 0.15 + Math.sin(elapsed * 0.005) * 0.1;

            // Mouse interaction boost
            let mouseBoost = 0;
            if (mouseRef.current.active) {
                const dx = mouseRef.current.x - centerX;
                const dy = mouseRef.current.y - centerY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                mouseBoost = Math.max(0, 1 - dist / 200) * 0.3;
            }

            const intensity = idlePulse + mouseBoost;

            for (let i = 0; i < Math.floor(3 + mouseBoost * 5); i++) {
                particlesRef.current.push(createFlameParticle(centerX, centerY, intensity));
            }

            if (Math.random() < 0.15 + mouseBoost) {
                particlesRef.current.push(createSparkParticle(centerX, centerY, intensity));
            }

            // Idle glow with pulse
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200 + mouseBoost * 80);
            gradient.addColorStop(0, `rgba(255, 210, 140, ${0.6 * intensity})`);
            gradient.addColorStop(0.2, `rgba(255, 130, 50, ${0.4 * intensity})`);
            gradient.addColorStop(0.5, `rgba(255, 60, 10, ${0.2 * intensity})`);
            gradient.addColorStop(1, 'rgba(180, 40, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }

        // ========================================================================
        // PARTICLE RENDERING
        // ========================================================================

        ctx.globalCompositeOperation = 'lighter';

        particlesRef.current = particlesRef.current.filter((p) => {
            p.life -= 1 / p.maxLife;
            if (p.life <= 0) return false;

            // Physics
            p.x += p.vx;
            p.y += p.vy;
            p.vy -= 0.02; // Upward acceleration (flames rise)
            p.vx *= 0.99; // Drag

            // Render
            const alpha = p.life * p.opacity;
            const size = p.size * (0.5 + p.life * 0.5);

            if (p.type === 'flame') {
                // Soft flame particle
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
                gradient.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha * 0.8})`);
                gradient.addColorStop(0.4, `rgba(${p.color.r}, ${p.color.g * 0.7}, ${p.color.b * 0.3}, ${alpha * 0.4})`);
                gradient.addColorStop(1, `rgba(${p.color.r}, ${p.color.g * 0.3}, 0, 0)`);
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.type === 'spark') {
                // Bright spark
                ctx.shadowBlur = 15;
                ctx.shadowColor = `rgba(255, 200, 100, ${alpha})`;
                ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            } else if (p.type === 'ember') {
                // Glowing ember
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 2);
                gradient.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`);
                gradient.addColorStop(0.5, `rgba(${p.color.r}, ${p.color.g * 0.5}, 0, ${alpha * 0.5})`);
                gradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(p.x, p.y, size * 2, 0, Math.PI * 2);
                ctx.fill();
            }

            return true;
        });

        ctx.globalCompositeOperation = 'source-over';

        // Limit particle count for performance
        if (particlesRef.current.length > 500) {
            particlesRef.current = particlesRef.current.slice(-400);
        }

        animationIdRef.current = requestAnimationFrame(animate);
    }, [dimensions, autoIgnite, igniteDelay, showText]);

    // Start animation
    useEffect(() => {
        startTimeRef.current = performance.now();
        phaseRef.current = { current: 'ember', progress: 0 };
        particlesRef.current = [];

        animationIdRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
        };
    }, [animate]);

    // Trigger ignition manually
    const triggerIgnite = useCallback(() => {
        if (phaseRef.current.current === 'ember') {
            phaseRef.current.current = 'igniting';
            phaseRef.current.progress = 0;
        }
    }, []);

    // Intersection Observer for scroll trigger
    useEffect(() => {
        if (!autoIgnite) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting && phaseRef.current.current === 'ember') {
                            triggerIgnite();
                        }
                    });
                },
                { threshold: 0.5 }
            );

            if (containerRef.current) {
                observer.observe(containerRef.current);
            }

            return () => observer.disconnect();
        }
    }, [autoIgnite, triggerIgnite]);

    return (
        <div
            ref={containerRef}
            className={`ignite-container ${className}`}
            onClick={triggerIgnite}
        >
            <canvas
                ref={canvasRef}
                width={dimensions.width}
                height={dimensions.height}
                className="ignite-canvas"
            />

            {showText && textVisible && (
                <div
                    className="ignite-text"
                    style={{ opacity: textOpacity }}
                >
                    <h1 className="ignite-title">{textContent}</h1>
                    <div className="ignite-subtitle">Awaken your potential</div>
                </div>
            )}

            <style jsx>{`
        .ignite-container {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 100vh;
          background: linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%);
          overflow: hidden;
          cursor: pointer;
        }

        .ignite-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .ignite-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 10;
          pointer-events: none;
          transition: opacity 0.5s ease;
        }

        .ignite-title {
          font-size: clamp(4rem, 12vw, 10rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          background: linear-gradient(
            180deg,
            #fff8f0 0%,
            #ffd700 30%,
            #ff8c00 60%,
            #ff4500 100%
          );
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          text-shadow: 
            0 0 40px rgba(255, 140, 0, 0.5),
            0 0 80px rgba(255, 69, 0, 0.3),
            0 0 120px rgba(255, 30, 0, 0.2);
          margin: 0;
          animation: ignite-text-glow 2s ease-in-out infinite alternate;
        }

        .ignite-subtitle {
          font-size: clamp(1rem, 3vw, 1.5rem);
          color: rgba(255, 200, 150, 0.8);
          margin-top: 1rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          animation: ignite-fade-up 1s ease-out 0.5s both;
        }

        @keyframes ignite-text-glow {
          0% {
            filter: brightness(1) drop-shadow(0 0 20px rgba(255, 140, 0, 0.4));
          }
          100% {
            filter: brightness(1.1) drop-shadow(0 0 40px rgba(255, 200, 100, 0.6));
          }
        }

        @keyframes ignite-fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}
