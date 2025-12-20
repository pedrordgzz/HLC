import React, { useEffect, useRef } from 'react';

const MouseFollower = () => {
    const canvasRef = useRef(null);
    const particles = useRef([]);
    const animationFrameId = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', resize);
        resize();

        // Particle Class definition
        const createParticle = (x, y) => {
            // Theme colors: Deep Pink, Hot Pink, White, Pale Pink
            const colors = ['#ff007f', '#ff69b4', '#ffffff', '#ffcce6'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 1; // Speed of expansion

            return {
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                alpha: 1,
                size: Math.random() * 3 + 1,
                decay: Math.random() * 0.02 + 0.015, // How fast it fades
                gravity: 0.1 // Gravity effect
            };
        };

        const handleMouseMove = (e) => {
            // Spawn multiple particles per move for "firework" density
            for (let i = 0; i < 3; i++) {
                particles.current.push(createParticle(e.clientX, e.clientY));
            }
        };

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.current.length; i++) {
                const p = particles.current[i];

                // Physics
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.alpha -= p.decay;

                // Draw
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Remove dead particles
                if (p.alpha <= 0) {
                    particles.current.splice(i, 1);
                    i--;
                }
            }
            ctx.globalAlpha = 1;

            animationFrameId.current = requestAnimationFrame(render);
        };

        window.addEventListener('mousemove', handleMouseMove);
        render();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 9999
            }}
        />
    );
};

export default MouseFollower;
