/* ==========================================================================
   Shruti Roy Portfolio - Primary Application Controller (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --------------------------------------------------------------------------
       1. Custom Loader Simulation
       -------------------------------------------------------------------------- */
    const loader = document.getElementById('loader');
    const loaderBar = document.querySelector('.loader-bar');
    
    if (loader && loaderBar) {
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                // Hide loader with a smooth fade
                loader.style.opacity = 0;
                loader.style.visibility = 'hidden';
                
                // Initialize typing and AOS animations only after loader completes
                initTyped();
                initAOS();
            } else {
                width += Math.floor(Math.random() * 15) + 5;
                if (width > 100) width = 100;
                loaderBar.style.width = width + '%';
            }
        }, 100);
    }

    /* --------------------------------------------------------------------------
       2. Custom Cursor / Glow Tracking
       -------------------------------------------------------------------------- */
    const cursorGlow = document.getElementById('cursor-glow');
    const cursorDot = document.getElementById('cursor-dot');

    if (cursorGlow && cursorDot) {
        document.addEventListener('mousemove', (e) => {
            // Use requestAnimationFrame for smooth cursor rendering
            window.requestAnimationFrame(() => {
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
                
                cursorDot.style.left = e.clientX + 'px';
                cursorDot.style.top = e.clientY + 'px';
            });
        });

        // Add class on hoverable elements to resize/glow cursor dot
        const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-category-card, input, textarea');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover-active');
            });
            target.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover-active');
            });
        });
    }

    /* --------------------------------------------------------------------------
       3. Theme Toggle (Light & Dark UI)
       -------------------------------------------------------------------------- */
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        enableLightTheme();
    } else {
        enableDarkTheme();
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (document.body.classList.contains('light-theme')) {
                enableDarkTheme();
            } else {
                enableLightTheme();
            }
        });
    }

    function enableLightTheme() {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
        if (themeIcon) {
            themeIcon.className = 'fa-solid fa-sun theme-icon';
        }
    }

    function enableDarkTheme() {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        if (themeIcon) {
            themeIcon.className = 'fa-solid fa-moon theme-icon';
        }
    }

    /* --------------------------------------------------------------------------
       4. Mobile Navigation Drawer Toggle
       -------------------------------------------------------------------------- */
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu drawer when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    /* --------------------------------------------------------------------------
       5. Scroll Progress Bar & Sticky Header
       -------------------------------------------------------------------------- */
    const scrollProgress = document.getElementById('scroll-progress');
    const header = document.querySelector('.navbar-header');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        
        // Update progress bar
        if (scrollProgress && totalScrollHeight > 0) {
            const percentage = (currentScroll / totalScrollHeight) * 100;
            scrollProgress.style.width = percentage + '%';
        }

        // Handle sticky header class
        if (header) {
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Back to top button visibility (hide in hero section)
        if (backToTop) {
            if (currentScroll > window.innerHeight * 0.5) {
                backToTop.style.opacity = '1';
                backToTop.style.pointerEvents = 'all';
                backToTop.style.transform = 'translateY(0)';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.pointerEvents = 'none';
                backToTop.style.transform = 'translateY(15px)';
            }
        }

        // Highlighting active section navigation links
        highlightActiveSection();
        
        // Trigger skill progress bars when section is visible
        checkSkillsVisibility();
    });

    /* --------------------------------------------------------------------------
       6. Active Navigation Link Highlighting
       -------------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    
    function highlightActiveSection() {
        const scrollPosition = window.scrollY + 120; // offset header height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    /* --------------------------------------------------------------------------
       7. Skill Level Progress Animations
       -------------------------------------------------------------------------- */
    const skillsSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.skill-progress');
    let skillsAnimated = false;

    function checkSkillsVisibility() {
        if (!skillsSection || skillsAnimated) return;
        
        const rect = skillsSection.getBoundingClientRect();
        const triggerPoint = window.innerHeight - 100;
        
        if (rect.top <= triggerPoint) {
            progressBars.forEach(bar => {
                const targetPercentage = bar.getAttribute('data-progress');
                bar.style.width = targetPercentage;
            });
            skillsAnimated = true;
        }
    }

    /* --------------------------------------------------------------------------
       8. Typed.js Instantiation
       -------------------------------------------------------------------------- */
    function initTyped() {
        const typedElement = document.getElementById('typed-text');
        if (typedElement && window.Typed) {
            new Typed('#typed-text', {
                strings: [
                    'Machine Learning Enthusiast.',
                    'Python Developer.',
                    'Android Developer.',
                    'Full Stack Learner.'
                ],
                typeSpeed: 60,
                backSpeed: 40,
                backDelay: 2000,
                loop: true
            });
        }
    }

    /* --------------------------------------------------------------------------
       9. AOS (Animate On Scroll) Instantiation
       -------------------------------------------------------------------------- */
    function initAOS() {
        if (window.AOS) {
            window.AOS.init({
                once: true,
                offset: 80,
                duration: 900,
                easing: 'ease-out-cubic'
            });
        }
    }

    /* --------------------------------------------------------------------------
       10. Interactive Contact Form Validation & Simulated Submission
       -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('portfolio-contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Clean statuses
            formStatus.className = 'form-status-box';
            formStatus.textContent = '';
            
            const nameField = document.getElementById('form-name');
            const emailField = document.getElementById('form-email');
            const messageField = document.getElementById('form-message');
            
            let isValid = true;
            
            // Name validation
            if (!nameField.value.trim()) {
                nameField.parentElement.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                nameField.parentElement.parentElement.classList.remove('invalid');
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailField.value.trim() || !emailRegex.test(emailField.value.trim())) {
                emailField.parentElement.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                emailField.parentElement.parentElement.classList.remove('invalid');
            }
            
            // Message validation
            if (!messageField.value.trim()) {
                messageField.parentElement.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                messageField.parentElement.parentElement.classList.remove('invalid');
            }
            
            if (!isValid) return;

            // Form validation passed. Run submission simulator.
            const submitBtn = contactForm.querySelector('.btn-submit');
            const btnText = submitBtn.querySelector('span');
            const btnIcon = submitBtn.querySelector('i');
            
            // Set state to loading
            submitBtn.disabled = true;
            btnText.textContent = 'Sending Message...';
            btnIcon.className = 'fa-solid fa-circle-notch fa-spin icon-right';
            
            setTimeout(() => {
                // Success feedback
                submitBtn.disabled = false;
                btnText.textContent = 'Send Message';
                btnIcon.className = 'fa-regular fa-paper-plane icon-right';
                
                formStatus.classList.add('success');
                formStatus.textContent = 'Thank you! Your message was sent successfully. Shruti will get back to you shortly.';
                
                // Reset fields
                contactForm.reset();
            }, 1800);
        });
        
        // Remove invalid classes on input typing
        const fields = contactForm.querySelectorAll('input, textarea');
        fields.forEach(field => {
            field.addEventListener('input', () => {
                field.parentElement.parentElement.classList.remove('invalid');
            });
        });
    }

    /* --------------------------------------------------------------------------
       11. Custom Interactive Button Ripple Click Effects
       -------------------------------------------------------------------------- */
    const rippleButtons = document.querySelectorAll('.btn');
    
    rippleButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'click-ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            // Cleanup ripple element after completion
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});
