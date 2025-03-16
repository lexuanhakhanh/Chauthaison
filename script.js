document.addEventListener('DOMContentLoaded', function() {
    // Đảm bảo nền hero được tải
    document.querySelectorAll('.hero-background').forEach(bg => {
        const style = getComputedStyle(bg);
        const bgImage = style.backgroundImage;
        if (bgImage === 'none' || bgImage.includes('placekitten')) {
            bg.style.backgroundImage = 'url("images/hero/default-slide.jpg")';
        }
    });

    // Initialize Hero Slider
    $('.hero-slider').slick({
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
        autoplay: true,
        autoplaySpeed: 5000,
        prevArrow: '<button class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
        nextArrow: '<button class="slick-next"><i class="fas fa-chevron-right"></i></button>',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false
                }
            }
        ]
    });
    
    // Initialize AOS with more options
    AOS.init({
        once: false, // Change to false to make animations repeat on scroll
        offset: 100,
        duration: 800,
        easing: 'ease-in-out',
        delay: 100,
        mirror: true // Whether elements should animate out while scrolling past them
    });
    
    // Mobile Menu Toggle with animation
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('show');
            // Animate menu icon
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }
    
    // Enhanced Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            // Animate scroll to top with easing
            const scrollToTop = () => {
                const c = document.documentElement.scrollTop || document.body.scrollTop;
                if (c > 0) {
                    window.requestAnimationFrame(scrollToTop);
                    window.scrollTo(0, c - c / 8);
                }
            };
            scrollToTop();
        });
    }
    
    // Smooth Scrolling with enhanced easing
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    // Custom smooth scrolling with easing
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                    const startPosition = window.pageYOffset;
                    const distance = targetPosition - startPosition - 80;
                    let startTime = null;
                    
                    function animation(currentTime) {
                        if (startTime === null) startTime = currentTime;
                        const timeElapsed = currentTime - startTime;
                        const duration = 1000; // 1 second duration
                        
                        // Easing function (easeOutQuad)
                        const ease = function(t) { return t*(2-t); };
                        
                        const run = ease(Math.min(timeElapsed / duration, 1));
                        window.scrollTo(0, startPosition + distance * run);
                        
                        if (timeElapsed < duration) {
                            requestAnimationFrame(animation);
                        }
                    }
                    
                    requestAnimationFrame(animation);
                    
                    // Close mobile menu if open
                    navMenu.classList.remove('show');
                    if (mobileMenuBtn && mobileMenuBtn.querySelector('i').classList.contains('fa-times')) {
                        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                    }
                }
            }
        });
    });

    // Enhanced Form Validation with better feedback
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Add floating label effect
            if (input.parentElement.classList.contains('form-group')) {
                const placeholder = input.getAttribute('placeholder');
                input.setAttribute('placeholder', '');
                
                const label = document.createElement('label');
                label.textContent = placeholder;
                label.classList.add('floating-label');
                
                input.parentElement.appendChild(label);
                input.parentElement.classList.add('has-float-label');
                
                input.addEventListener('focus', () => {
                    label.classList.add('active');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        label.classList.remove('active');
                    }
                });
                
                // If input already has value (e.g. on page refresh)
                if (input.value) {
                    label.classList.add('active');
                }
            }
            
            // Real-time validation
            input.addEventListener('input', function() {
                validateInput(this);
            });
            
            input.addEventListener('blur', function() {
                validateInput(this);
            });
        });
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Show success animation
                this.classList.add('success-animation');
                const formData = new FormData(this);
                let formValues = {};
                
                for (let [key, value] of formData.entries()) {
                    formValues[key] = value;
                }
                
                console.log('Form data:', formValues);
                
                // Show animated success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = '<div class="success-icon"><i class="fas fa-check"></i></div><p>Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>';
                
                this.innerHTML = '';
                this.appendChild(successMessage);
                
                // Add success animation
                setTimeout(() => {
                    successMessage.classList.add('show');
                }, 100);
            }
        });
    });
    
    function validateInput(input) {
        const parent = input.parentElement;
        let isValid = true;
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        
        // Remove any existing error message
        const existingError = parent.querySelector('.error-message');
        if (existingError) {
            parent.removeChild(existingError);
        }
        
        // Check if required and empty
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            errorMessage.textContent = 'Trường này là bắt buộc';
            input.classList.add('error');
            parent.appendChild(errorMessage);
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                errorMessage.textContent = 'Email không hợp lệ';
                input.classList.add('error');
                parent.appendChild(errorMessage);
            }
        }
        
        // Phone validation
        if (input.type === 'tel' && input.value) {
            const phoneRegex = /^[\d\+\-\(\) ]{10,15}$/;
            if (!phoneRegex.test(input.value)) {
                isValid = false;
                errorMessage.textContent = 'Số điện thoại không hợp lệ';
                input.classList.add('error');
                parent.appendChild(errorMessage);
            }
        }
        
        if (isValid) {
            input.classList.remove('error');
        }
        
        return isValid;
    }
    
    // Parallax effect for hero section backgrounds
    $('.hero-background').each(function() {
        const $bg = $(this);
        $(window).scroll(function() {
            const yPos = -($(window).scrollTop() / 10);
            const coords = '50% ' + yPos + 'px';
            $bg.css({ backgroundPosition: coords });
        });
    });
    
    // Animated counters for stats
    const statItems = document.querySelectorAll('.stat-item h4');
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Function to animate number counting
    function animateCounter(elements, options = {}) {
        if (!elements || elements.length === 0) return;
        
        const defaultOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px',
            duration: 2000
        };
        
        const config = {...defaultOptions, ...options};
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    // Determine final value based on content and context
                    let finalValue = parseInt(target.innerText.replace(/,/g, ''));
                    let specialFormat = false;
                    
                    // Handle special cases
                    if (target.closest('.stats-container') || target.closest('.about-stats')) {
                        if (target.innerText === '4.500') {
                            finalValue = 4.500; // Tấn/Tháng
                            specialFormat = true;
                        } else if (target.innerText === '200.000') {
                            finalValue = 200.000; // Sản Phẩm/Giờ
                            specialFormat = true;
                        }
                    }
                    
                    let count = 0;
                    const increment = finalValue / (config.duration / 16); // ~60fps
                    
                    const updateCount = () => {
                        count += increment;
                        if (count < finalValue) {
                            // Format display based on context
                            if (specialFormat) {
                                target.innerText = Math.floor(count).toLocaleString('vi-VN');
                            } else {
                                target.innerText = Math.floor(count).toLocaleString();
                            }
                            requestAnimationFrame(updateCount);
                        } else {
                            // Final display format
                            if (specialFormat) {
                                if (finalValue >= 200.000) {
                                    target.innerText = '200.000';
                                } else if (finalValue === 4.500) {
                                    target.innerText = '4.500';
                                } else {
                                    target.innerText = finalValue.toLocaleString('vi-VN');
                                }
                            } else {
                                target.innerText = finalValue.toLocaleString();
                            }
                        }
                    };
                    
                    updateCount();
                    observer.unobserve(target);
                }
            });
        }, {
            threshold: config.threshold,
            rootMargin: config.rootMargin
        });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Initialize counter animations for different sections
    animateCounter(statItems);
    animateCounter(statNumbers);
    
    // Animate policy items on scroll
    const policyItems = document.querySelectorAll('.policy-item');
    if (policyItems.length > 0) {
        const options = {
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        policyItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transitionDelay = (index * 0.1) + 's';
            observer.observe(item);
        });
    }
    
    // Enhanced search bar functionality
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        const searchInput = searchBar.querySelector('input');
        const searchButton = searchBar.querySelector('button');
        
        // Prevent form submission if input is empty
        searchBar.addEventListener('submit', function(e) {
            if (!searchInput.value.trim()) {
                e.preventDefault();
                searchInput.focus();
                // Add shake animation
                searchBar.classList.add('shake');
                setTimeout(() => {
                    searchBar.classList.remove('shake');
                }, 500);
            }
        });
        
        // Add focus effect
        searchInput.addEventListener('focus', function() {
            searchBar.classList.add('focused');
        });
        
        searchInput.addEventListener('blur', function() {
            searchBar.classList.remove('focused');
        });
        
        // Add button hover effect
        searchButton.addEventListener('mouseenter', function() {
            this.innerHTML = '<i class="fas fa-arrow-right"></i>';
        });
        
        searchButton.addEventListener('mouseleave', function() {
            this.innerHTML = '<i class="fas fa-search"></i>';
        });
    }
    
    // Enhanced hexagon interaction for evenly spaced layout
    const hexItems = document.querySelectorAll('.hex-item');
    if (hexItems.length > 0) {
        hexItems.forEach(hex => {
            // Ensure text is properly displayed
            const hexText = hex.querySelector('p');
            if (hexText) {
                hexText.style.transition = 'all 0.5s ease';
            }
            
            // Add interaction that maintains symmetry
            hex.addEventListener('mouseenter', function() {
                // Highlight this hexagon and fade others slightly
                hexItems.forEach(otherHex => {
                    if (otherHex !== this) {
                        otherHex.style.opacity = '0.7';
                    }
                });
            });
            
            hex.addEventListener('mouseleave', function() {
                // Restore all hexagons
                hexItems.forEach(otherHex => {
                    otherHex.style.opacity = '1';
                });
            });
        });
    }
    
    // Add subtle animation to the center hex
    const centerHex = document.querySelector('.center-hex');
    if (centerHex) {
        centerHex.addEventListener('mouseenter', function() {
            this.style.transform = 'translate(-50%, -50%) scale(1.1)';
        });
        
        centerHex.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(-50%, -50%)';
        });
    }
    
    // Add animation to newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            let isValid = true;
            
            if (!emailInput.value.trim()) {
                isValid = false;
                emailInput.classList.add('error');
                newsletterForm.classList.add('shake');
                setTimeout(() => {
                    newsletterForm.classList.remove('shake');
                }, 500);
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value)) {
                    isValid = false;
                    emailInput.classList.add('error');
                    newsletterForm.classList.add('shake');
                    setTimeout(() => {
                        newsletterForm.classList.remove('shake');
                    }, 500);
                } else {
                    emailInput.classList.remove('error');
                }
            }
            
            if (isValid) {
                // Here you would normally send the email to your server
                console.log('Newsletter subscription:', emailInput.value);
                
                // Change button text and add animation
                const submitBtn = this.querySelector('button');
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Đã Đăng Ký!';
                submitBtn.classList.add('success');
                
                // Add success animation to the form
                newsletterForm.classList.add('success-animation');
                
                // Reset form after some time
                setTimeout(() => {
                    emailInput.value = '';
                    submitBtn.innerHTML = 'ĐĂNG KÝ';
                    submitBtn.classList.remove('success');
                    newsletterForm.classList.remove('success-animation');
                }, 3000);
            }
        });
    }
    
    // ===== XỬ LÝ HÌNH ẢNH =====
    
    // Function to handle image error and set placeholder
    function setupImageErrorHandling(selector, placeholderText) {
        const images = document.querySelectorAll(selector);
        if (!images.length) return;
        
        images.forEach(img => {
            // Add lazy loading attribute
            img.loading = 'lazy';
            
            // Set up error handler with local fallback first, then placeholder
            img.addEventListener('error', function() {
                if (!this.src.includes('placeholder.com') && !this.src.includes('/fallback/')) {
                    // Try a local fallback first
                    const imgName = this.alt.toLowerCase().replace(/ /g, '-');
                    this.src = `images/fallback/${imgName}.jpg`;
                    
                    // Set second error handler for fallback
                    this.onerror = function() {
                        const text = placeholderText || this.alt || 'Hình ảnh';
                        const size = this.closest('.product-img') ? '500x500' : '700x500';
                        this.src = `https://via.placeholder.com/${size}/333333/FFFFFF?text=${text.replace(/ /g, '+')}`;
                    };
                }
            });
            
            // Handle hover effects
            const container = img.parentElement;
            if (container) {
                container.addEventListener('mouseenter', function() {
                    img.style.transform = 'scale(1.05)';
                });
                
                container.addEventListener('mouseleave', function() {
                    img.style.transform = 'scale(1)';
                });
            }
        });
    }
    
    // Set up error handling for different image types
    setupImageErrorHandling('.about-image img, .about-us-image img', 'Nhà máy Châu Thái Sơn');
    setupImageErrorHandling('.product-img img', 'Sản phẩm');
    setupImageErrorHandling('.category-img img', 'Danh mục sản phẩm');
    
    // Enhance product cards with interactive effects
    const productCards = document.querySelectorAll('.product-card');
    if (productCards.length > 0) {
        productCards.forEach(card => {
            // Add hover class
            card.addEventListener('mouseenter', function() {
                this.classList.add('hover');
            });
            
            card.addEventListener('mouseleave', function() {
                this.classList.remove('hover');
            });
            
            // Handle action icons
            const actionIcons = card.querySelectorAll('.action-icons a');
            actionIcons.forEach(icon => {
                icon.addEventListener('click', function(e) {
                    e.preventDefault();
                    this.classList.add('clicked');
                    
                    setTimeout(() => {
                        this.classList.remove('clicked');
                    }, 300);
                    
                    // Handle heart icon (wishlist)
                    if (this.querySelector('.fa-heart')) {
                        this.classList.toggle('active');
                    }
                    
                    // Handle search icon (quick view)
                    if (this.querySelector('.fa-search')) {
                        const productName = card.querySelector('h3')?.textContent || 'Sản phẩm';
                        console.log('Quick view:', productName);
                    }
                });
            });
        });
    }
    
    // Set up lazy loading for products using Intersection Observer
    if ('IntersectionObserver' in window) {
        const lazyLoadElements = document.querySelectorAll('.product-card, .category-card, .about-image, .about-us-image');
        
        if (lazyLoadElements.length > 0) {
            const lazyLoadObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        
                        // For elements with data-src attributes
                        const img = element.querySelector('img[data-src]');
                        if (img && img.dataset.src) {
                            img.src = img.dataset.src;
                            delete img.dataset.src;
                        }
                        
                        // Add animation class
                        element.classList.add('visible');
                        
                        // Stop observing once loaded
                        lazyLoadObserver.unobserve(element);
                    }
                });
            }, {
                rootMargin: '50px',
                threshold: 0.1
            });
            
            lazyLoadElements.forEach(element => {
                lazyLoadObserver.observe(element);
            });
        }
    }

    // Kiểm tra hình ảnh nền hero và cập nhật nếu không tải được
    document.querySelectorAll('.hero-slide').forEach((slide, index) => {
        const bgElement = slide.querySelector('.hero-background');
        if (bgElement) {
            const style = getComputedStyle(bgElement);
            const bgImage = style.backgroundImage;
            
            // Kiểm tra nếu là URL placeholder hoặc không có hình
            if (bgImage === 'none' || bgImage.includes('placekitten')) {
                // Xác định slide nào để cấp đúng hình ảnh phù hợp
                let slideImagePath;
                if (slide.classList.contains('slide-gioi-thieu')) {
                    slideImagePath = 'images/hero/slide-gioi-thieu.jpg';
                } else if (slide.classList.contains('slide-hop-carton')) {
                    slideImagePath = 'images/hero/slide-hop-carton.jpg';
                } else if (slide.classList.contains('slide-hop-offset')) {
                    slideImagePath = 'images/hero/slide-hop-offset.jpg';
                } else {
                    // Fallback nếu không xác định được slide
                    slideImagePath = `images/hero/slide${index + 1}.jpg`;
                }
                
                // Thử tải hình ảnh tương ứng với slide
                bgElement.style.backgroundImage = `url("${slideImagePath}")`;
                console.log(`Đã thay thế hình ảnh hero slide ${index + 1} với ${slideImagePath}`);
                
                // Thêm error handler nếu cả ảnh này cũng không tải được
                const img = new Image();
                img.onerror = function() {
                    bgElement.style.backgroundImage = 'url("images/hero/default-slide.jpg")';
                    console.log('Dùng ảnh mặc định do không tải được ảnh slide chỉ định');
                };
                img.src = slideImagePath;
            }
        }
    });

    // Kiểm tra logo
    const logo = document.querySelector('.logo img');
    if (logo) {
        logo.onerror = function() {
            this.style.display = 'none';
            const logoText = document.getElementById('logo-text');
            if (logoText) {
                logoText.style.display = 'inline-block';
            }
        };
    }
});