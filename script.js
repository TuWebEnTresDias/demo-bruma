/* ========================================
   ISLA BRUMA — Landing Page Scripts
   Interactivity & Animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ── HEADER SCROLL EFFECT ─────────── */
    const header = document.getElementById('header');
    let lastScroll = 0;

    const handleHeaderScroll = () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 60) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();


    /* ── MOBILE MENU ──────────────────── */
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');

    const toggleMenu = () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    };

    const closeMenu = () => {
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    };

    burger.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));


    /* ── SMOOTH SCROLL ─────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });


    /* ── MENU TABS ─────────────────────── */
    const menuTabs = document.querySelectorAll('.menu__tab');
    const menuCategories = document.querySelectorAll('.menu__category');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            // Update active tab
            menuTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show corresponding category with animation
            menuCategories.forEach(cat => {
                if (cat.dataset.category === targetTab) {
                    cat.classList.add('active');
                    // Re-trigger reveal animations for items in this category
                    const items = cat.querySelectorAll('.reveal');
                    items.forEach((item, index) => {
                        item.classList.remove('visible');
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, 50 + (index * 80));
                    });
                } else {
                    cat.classList.remove('active');
                }
            });
        });
    });

    // Initialize first category items
    const firstCategory = document.querySelector('.menu__category.active');
    if (firstCategory) {
        const items = firstCategory.querySelectorAll('.reveal');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, 300 + (index * 100));
        });
    }


    /* ── SCROLL REVEAL ANIMATIONS ─────── */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Don't handle items that are inside non-active menu categories
                const parentCategory = entry.target.closest('.menu__category');
                if (parentCategory && !parentCategory.classList.contains('active')) {
                    return;
                }
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    /* ── RESERVATION FORM → WHATSAPP ──── */
    const reservationForm = document.getElementById('reservationForm');
    const whatsappNumber = '5491158055802';

    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('resName').value.trim();
            const phone = document.getElementById('resPhone').value.trim();
            const date = document.getElementById('resDate').value;
            const people = document.getElementById('resPeople').value;
            const notes = document.getElementById('resNotes').value.trim();

            // Format date nicely
            let formattedDate = date;
            if (date) {
                const [year, month, day] = date.split('-');
                const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
                formattedDate = `${parseInt(day)} de ${months[parseInt(month) - 1]} ${year}`;
            }

            // Build message
            let message = `Hola, me gustaría hacer una reserva en Isla Bruma.\n\n`;
            message += `👤 *Nombre:* ${name}\n`;
            message += `📞 *Teléfono:* ${phone}\n`;
            message += `📅 *Fecha:* ${formattedDate}\n`;
            message += `👥 *Personas:* ${people}\n`;

            if (notes) {
                message += `📝 *Anotaciones:* ${notes}\n`;
            }

            message += `\n¡Gracias!`;

            // Encode and open WhatsApp
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        });
    }


    /* ── SET MIN DATE FOR RESERVATION ──── */
    const dateInput = document.getElementById('resDate');
    if (dateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateInput.setAttribute('min', `${year}-${month}-${day}`);
    }


    /* ── PARALLAX SUBTLE EFFECT ────────── */
    let ticking = false;

    const handleParallax = () => {
        const scrollY = window.scrollY;
        const hero = document.querySelector('.hero');

        if (hero && scrollY < window.innerHeight) {
            const palm = document.querySelector('.hero__palm');
            const content = document.querySelector('.hero__content');

            if (palm) {
                palm.style.transform = `translateY(${scrollY * 0.15}px)`;
            }
            if (content) {
                content.style.transform = `translateY(${scrollY * 0.08}px)`;
                content.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
            }
        }
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });


    /* ── WHATSAPP FLOAT VISIBILITY ─────── */
    const whatsappFloat = document.getElementById('whatsappFloat');

    if (whatsappFloat) {
        // Show/hide based on scroll position
        whatsappFloat.style.opacity = '0';
        whatsappFloat.style.transform = 'scale(0.8)';
        whatsappFloat.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

        const handleWhatsappVisibility = () => {
            if (window.scrollY > 300) {
                whatsappFloat.style.opacity = '1';
                whatsappFloat.style.transform = 'scale(1)';
            } else {
                whatsappFloat.style.opacity = '0';
                whatsappFloat.style.transform = 'scale(0.8)';
            }
        };

        window.addEventListener('scroll', handleWhatsappVisibility, { passive: true });
    }


    /* ── GALLERY LIGHTBOX EFFECT ───────── */
    const galleryItems = document.querySelectorAll('.gallery__item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (!img) return;

            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.style.cssText = `
                position: fixed;
                inset: 0;
                z-index: 2000;
                background-color: rgba(13, 16, 32, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 40px;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;

            const lightboxImg = document.createElement('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxImg.style.cssText = `
                max-width: 90%;
                max-height: 85vh;
                object-fit: contain;
                border-radius: 8px;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            `;

            // Close button
            const closeBtn = document.createElement('div');
            closeBtn.innerHTML = '✕';
            closeBtn.style.cssText = `
                position: absolute;
                top: 24px;
                right: 24px;
                font-size: 24px;
                color: rgba(245, 239, 227, 0.6);
                cursor: pointer;
                transition: color 0.2s ease;
                font-family: var(--font-body);
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                border: 1px solid rgba(245, 239, 227, 0.1);
            `;

            closeBtn.addEventListener('mouseenter', () => {
                closeBtn.style.color = '#F5EFE3';
                closeBtn.style.borderColor = 'rgba(245, 239, 227, 0.3)';
            });
            closeBtn.addEventListener('mouseleave', () => {
                closeBtn.style.color = 'rgba(245, 239, 227, 0.6)';
                closeBtn.style.borderColor = 'rgba(245, 239, 227, 0.1)';
            });

            lightbox.appendChild(lightboxImg);
            lightbox.appendChild(closeBtn);
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';

            // Animate in
            requestAnimationFrame(() => {
                lightbox.style.opacity = '1';
                lightboxImg.style.transform = 'scale(1)';
            });

            // Close handlers
            const closeLightbox = () => {
                lightbox.style.opacity = '0';
                lightboxImg.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    lightbox.remove();
                    document.body.style.overflow = '';
                }, 300);
            };

            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox || e.target === closeBtn || closeBtn.contains(e.target)) {
                    closeLightbox();
                }
            });

            const handleEsc = (e) => {
                if (e.key === 'Escape') {
                    closeLightbox();
                    document.removeEventListener('keydown', handleEsc);
                }
            };
            document.addEventListener('keydown', handleEsc);
        });
    });

});
