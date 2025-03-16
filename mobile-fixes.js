/**
 * Mobile Display Fixes - Châu Thái Sơn Website
 * This script adds additional functionality to improve mobile display
 */
document.addEventListener('DOMContentLoaded', function() {
    // Fix mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navContainer = document.querySelector('.nav-container');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navContainer.classList.toggle('show');
            // Toggle icon
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navContainer && navContainer.classList.contains('show') &&
            !navContainer.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            navContainer.classList.remove('show');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon && icon.classList.contains('fa-times')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // Close mobile menu when clicking on a menu item
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navContainer && navContainer.classList.contains('show')) {
                navContainer.classList.remove('show');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon && icon.classList.contains('fa-times')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
    
    // Fix logo display 
    const logo = document.querySelector('.logo img');
    const logoText = document.getElementById('logo-text');
    
    if (logo && logoText) {
        if (!logo.complete || logo.naturalWidth === 0 || logo.src === '') {
            logo.style.display = 'none';
            logoText.style.display = 'inline-block';
        }
        
        logo.addEventListener('error', function() {
            this.style.display = 'none';
            logoText.style.display = 'inline-block';
        });
    }
    
    // Fix hex grid display for different screen sizes
    function adjustHexGrid() {
        const hexGrid = document.querySelector('.hex-grid-container');
        if (hexGrid) {
            if (window.innerWidth < 480) {
                hexGrid.style.transform = 'scale(0.6)';
            } else if (window.innerWidth < 768) {
                hexGrid.style.transform = 'scale(0.7)';
            } else if (window.innerWidth < 992) {
                hexGrid.style.transform = 'scale(0.8)';
            } else {
                hexGrid.style.transform = 'scale(1)';
            }
        }
    }
    
    // Run initially and on resize
    adjustHexGrid();
    window.addEventListener('resize', adjustHexGrid);
    
    // Improve tap targets for mobile
    const smallButtons = document.querySelectorAll('.action-icons a');
    if (smallButtons.length > 0) {
        smallButtons.forEach(btn => {
            btn.style.minWidth = '44px';
            btn.style.minHeight = '44px';
        });
    }
    
    // Fix blurry text on mobile
    document.body.style.textRendering = 'optimizeLegibility';
    document.body.style.webkitFontSmoothing = 'antialiased';
    document.body.style.mozOsxFontSmoothing = 'grayscale';
    
    // Ensure proper hero image loading on mobile
    const heroBackgrounds = document.querySelectorAll('.hero-background');
    heroBackgrounds.forEach(bg => {
        const computedStyle = window.getComputedStyle(bg);
        const bgImage = computedStyle.backgroundImage;
        
        // If no background image or error
        if (bgImage === 'none' || bgImage.includes('undefined')) {
            // Check which slide this is
            const parentSlide = bg.closest('.hero-slide');
            if (parentSlide) {
                if (parentSlide.classList.contains('slide-gioi-thieu')) {
                    bg.style.backgroundImage = 'url("images/hero/slide-gioi-thieu.jpg")';
                } else if (parentSlide.classList.contains('slide-hop-carton')) {
                    bg.style.backgroundImage = 'url("images/hero/slide-hop-carton.jpg")';
                } else if (parentSlide.classList.contains('slide-hop-offset')) {
                    bg.style.backgroundImage = 'url("images/hero/slide-hop-offset.jpg")';
                } else {
                    // Default fallback
                    bg.style.backgroundImage = 'url("images/hero/default-slide.jpg")';
                }
            }
        }
        
        // Add opacity overlay for better text readability on mobile
        bg.style.position = 'relative';
        if (!bg.querySelector('.mobile-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'mobile-overlay';
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '1';
            bg.appendChild(overlay);
        }
    });

    // Fix color contrast issues for text elements
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, li');
    textElements.forEach(el => {
        const computedStyle = window.getComputedStyle(el);
        const color = computedStyle.color;
        
        // If text color is too light or transparent (difficult to read)
        if (color.includes('rgba') && color.split(',')[3].trim().replace(')', '') < 0.7) {
            el.style.color = 'var(--light-text)';
        }
    });
    
    // Improve form elements for mobile
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.style.fontSize = '16px'; // Prevent auto zoom on iOS
    });
    
    // Optimize slider for mobile
    const sliderSettings = {
        dots: true,
        arrows: window.innerWidth > 768, // Show arrows only on larger screens
        autoplay: true,
        autoplaySpeed: 5000
    };
    
    if (typeof $.fn.slick !== 'undefined') {
        $('.hero-slider').slick(sliderSettings);
    }
});
