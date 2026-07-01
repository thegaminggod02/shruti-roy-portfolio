/* ==========================================================================
   Shruti Roy Portfolio - Canvas Particles Background (particles.js)
   ========================================================================== */

class CanvasParticles {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particlesList = [];
        this.mouse = { x: null, y: null, radius: 120 };
        
        this.init();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resizeCanvas() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.offsetWidth;
        this.canvas.height = parent.offsetHeight;
    }

    createParticles() {
        this.particlesList = [];
        // Scale particle count with screen width
        const density = Math.min(Math.floor(this.canvas.width * 0.05), 80);
        
        for (let i = 0; i < density; i++) {
            const size = Math.random() * 2 + 1; // particle size 1px to 3px
            const x = Math.random() * (this.canvas.width - size * 2) + size;
            const y = Math.random() * (this.canvas.height - size * 2) + size;
            const directionX = (Math.random() * 0.4) - 0.2;
            const directionY = (Math.random() * 0.4) - 0.2;
            
            // Get custom color variables from CSS variables
            const styles = getComputedStyle(document.body);
            const color = styles.getPropertyValue('--primary-color').trim() || '#7c3aed';
            
            this.particlesList.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });

        // Track mouse position on the hero section
        const heroSection = document.getElementById('hero');
        if (heroSection) {
            heroSection.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            });

            heroSection.addEventListener('mouseleave', () => {
                this.mouse.x = null;
                this.mouse.y = null;
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw and update each particle
        for (let i = 0; i < this.particlesList.length; i++) {
            this.particlesList[i].update(this.canvas.width, this.canvas.height, this.mouse);
            this.particlesList[i].draw(this.ctx);
        }
        
        this.connectParticles();
        requestAnimationFrame(() => this.animate());
    }

    connectParticles() {
        const maxDistance = 110;
        
        for (let a = 0; a < this.particlesList.length; a++) {
            for (let b = a + 1; b < this.particlesList.length; b++) {
                const dx = this.particlesList[a].x - this.particlesList[b].x;
                const dy = this.particlesList[a].y - this.particlesList[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    // Fade line opacity as points drift apart
                    const opacity = 1 - (distance / maxDistance);
                    const styles = getComputedStyle(document.body);
                    const isDark = document.body.classList.contains('dark-theme');
                    
                    // Match line stroke color style dynamically to theme
                    const strokeColor = isDark 
                        ? `rgba(124, 58, 237, ${opacity * 0.12})` 
                        : `rgba(109, 40, 217, ${opacity * 0.08})`;
                    
                    this.ctx.strokeStyle = strokeColor;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particlesList[a].x, this.particlesList[a].y);
                    this.ctx.lineTo(this.particlesList[b].x, this.particlesList[b].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(canvasWidth, canvasHeight, mouse) {
        // Handle borders
        if (this.x > canvasWidth) {
            this.x = canvasWidth;
            this.directionX = -Math.abs(this.directionX);
        } else if (this.x < 0) {
            this.x = 0;
            this.directionX = Math.abs(this.directionX);
        }
        if (this.y > canvasHeight) {
            this.y = canvasHeight;
            this.directionY = -Math.abs(this.directionY);
        } else if (this.y < 0) {
            this.y = 0;
            this.directionY = Math.abs(this.directionY);
        }

        // Mouse interaction (repelling effect)
        if (mouse.x !== null && mouse.y !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                
                // Accelerate away from mouse
                this.x += Math.cos(angle) * force * 2;
                this.y += Math.sin(angle) * force * 2;
            }
        }

        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;
    }
}

// Initialise on load
document.addEventListener('DOMContentLoaded', () => {
    new CanvasParticles('hero-particles');
});
