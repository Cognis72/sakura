/**
 * Main JavaScript file for Sakura Ramen website
 * Handles navigation, forms, animations, and general functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initForms();
    initAnimations();
    initScrollEffects();
    
    console.log('Sakura Ramen website initialized');
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navToggle && navMenu) {
        // Mobile menu toggle
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Update aria attributes for accessibility
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.style.boxShadow = 'var(--shadow-medium)';
                header.style.backdropFilter = 'blur(10px)';
                header.style.backgroundColor = 'rgba(var(--bg-color-rgb), 0.95)';
            } else {
                header.style.boxShadow = 'none';
                header.style.backdropFilter = 'none';
                header.style.backgroundColor = 'var(--bg-color)';
            }
            
            lastScrollY = currentScrollY;
        });
    }
    
    // Active navigation link highlighting
    updateActiveNavLink();
    window.addEventListener('popstate', updateActiveNavLink);
}

/**
 * Update active navigation link based on current page
 */
function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/')) {
            link.classList.add('active');
        }
    });
}

/**
 * Form handling and validation
 */
function initForms() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Franchise form
    const franchiseForm = document.getElementById('franchiseForm');
    if (franchiseForm) {
        franchiseForm.addEventListener('submit', handleFranchiseForm);
    }
    
    // Add input validation
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearValidationError);
    });
}

/**
 * Handle contact form submission
 */
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateContactForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = getCurrentLanguage() === 'th' ? 'กำลังส่ง...' : 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showNotification(
            getCurrentLanguage() === 'th' 
                ? 'ข้อความของคุณถูกส่งเรียบร้อยแล้ว เราจะติดต่อกลับภายใน 24 ชั่วโมง' 
                : 'Your message has been sent successfully! We\'ll get back to you within 24 hours.',
            'success'
        );
        
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

/**
 * Handle franchise form submission
 */
function handleFranchiseForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateFranchiseForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = getCurrentLanguage() === 'th' ? 'กำลังส่งใบสมัคร...' : 'Submitting Application...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showNotification(
            getCurrentLanguage() === 'th' 
                ? 'ใบสมัครของคุณถูกส่งเรียบร้อยแล้ว ทีมแฟรนไชส์จะติดต่อคุณภายใน 24 ชั่วโมง' 
                : 'Your franchise application has been submitted! Our franchise team will contact you within 24 hours.',
            'success'
        );
        
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

/**
 * Validate contact form
 */
function validateContactForm(data) {
    let isValid = true;
    
    // Required fields
    const requiredFields = ['name', 'email', 'subject', 'message'];
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(field, getCurrentLanguage() === 'th' ? 'กรุณากรอกข้อมูลนี้' : 'This field is required');
            isValid = false;
        }
    });
    
    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        showFieldError('email', getCurrentLanguage() === 'th' ? 'กรุณากรอกอีเมลที่ถูกต้อง' : 'Please enter a valid email address');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Validate franchise form
 */
function validateFranchiseForm(data) {
    let isValid = true;
    
    // Required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'city', 'country', 'investment'];
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(field, getCurrentLanguage() === 'th' ? 'กรุณากรอกข้อมูลนี้' : 'This field is required');
            isValid = false;
        }
    });
    
    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        showFieldError('email', getCurrentLanguage() === 'th' ? 'กรุณากรอกอีเมลที่ถูกต้อง' : 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation
    if (data.phone && !isValidPhone(data.phone)) {
        showFieldError('phone', getCurrentLanguage() === 'th' ? 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง' : 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Validate individual input
 */
function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    
    // Clear previous errors
    clearValidationError(e);
    
    // Check if required
    if (input.hasAttribute('required') && !value) {
        showFieldError(input.name, getCurrentLanguage() === 'th' ? 'กรุณากรอกข้อมูลนี้' : 'This field is required');
        return;
    }
    
    // Type-specific validation
    if (value) {
        switch (input.type) {
            case 'email':
                if (!isValidEmail(value)) {
                    showFieldError(input.name, getCurrentLanguage() === 'th' ? 'กรุณากรอกอีเมลที่ถูกต้อง' : 'Please enter a valid email address');
                }
                break;
            case 'tel':
                if (!isValidPhone(value)) {
                    showFieldError(input.name, getCurrentLanguage() === 'th' ? 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง' : 'Please enter a valid phone number');
                }
                break;
        }
    }
}

/**
 * Clear validation error for input
 */
function clearValidationError(e) {
    const input = e.target;
    const errorElement = document.getElementById(`${input.name}-error`);
    
    if (errorElement) {
        errorElement.remove();
    }
    
    input.classList.remove('error');
}

/**
 * Show field error
 */
function showFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (!field) return;
    
    // Remove existing error
    const existingError = document.getElementById(`${fieldName}-error`);
    if (existingError) {
        existingError.remove();
    }
    
    // Add error class
    field.classList.add('error');
    
    // Create error element
    const errorElement = document.createElement('div');
    errorElement.id = `${fieldName}-error`;
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--cherry-red)';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = 'var(--space-xs)';
    
    // Insert after field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

/**
 * Email validation
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Phone validation
 */
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: 'var(--space-md) var(--space-lg)',
        backgroundColor: type === 'success' ? 'var(--bamboo-green)' : 'var(--primary-color)',
        color: 'white',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-medium)',
        zIndex: '10000',
        maxWidth: '400px',
        fontSize: '0.9rem',
        lineHeight: '1.4',
        animation: 'slideInRight 0.3s ease-out'
    });
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
}

/**
 * Initialize animations
 */
function initAnimations() {
    // Add CSS for notification animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .field-error {
            animation: fadeInUp 0.3s ease-out;
        }
        
        input.error,
        textarea.error,
        select.error {
            border-color: var(--cherry-red) !important;
            box-shadow: 0 0 0 3px rgba(220, 20, 60, 0.1) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .benefit-card, .mission-card, .menu-item, .step, .contact-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Initialize scroll effects
 */
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Back to top functionality
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    
    Object.assign(backToTop.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '20px',
        zIndex: '1000',
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'all var(--transition-normal)',
        boxShadow: 'var(--shadow-medium)'
    });
    
    document.body.appendChild(backToTop);
    
    // Show/hide back to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.transform = 'translateY(0)';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.transform = 'translateY(20px)';
        }
    });
    
    // Back to top click handler
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Get current language from localStorage or default
 */
function getCurrentLanguage() {
    return localStorage.getItem('sakura-language') || 'en';
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for use in other modules
window.SakuraRamen = {
    showNotification,
    getCurrentLanguage,
    debounce
};
