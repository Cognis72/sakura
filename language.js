/**
 * Language switching functionality for Sakura Ramen website
 * Handles Thai/English language toggle with localStorage persistence
 */

(function() {
    'use strict';
    
    // Available languages
    const languages = {
        en: 'English',
        th: 'ไทย'
    };
    
    // Default language
    const defaultLanguage = 'en';
    
    // Current language
    let currentLanguage = defaultLanguage;
    
    /**
     * Initialize language functionality
     */
    function initLanguage() {
        // Load saved language preference
        loadLanguagePreference();
        
        // Set up language toggle button
        setupLanguageToggle();
        
        // Apply initial language
        applyLanguage(currentLanguage);
        
        console.log(`Language system initialized with: ${currentLanguage}`);
    }
    
    /**
     * Load language preference from localStorage
     */
    function loadLanguagePreference() {
        const savedLanguage = localStorage.getItem('sakura-language');
        if (savedLanguage && languages[savedLanguage]) {
            currentLanguage = savedLanguage;
        }
    }
    
    /**
     * Setup language toggle button functionality
     */
    function setupLanguageToggle() {
        const languageToggle = document.querySelector('.language-toggle');
        
        if (languageToggle) {
            languageToggle.addEventListener('click', toggleLanguage);
            
            // Add keyboard support
            languageToggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleLanguage();
                }
            });
        }
    }
    
    /**
     * Toggle between languages
     */
    function toggleLanguage() {
        const newLanguage = currentLanguage === 'en' ? 'th' : 'en';
        setLanguage(newLanguage);
    }
    
    /**
     * Set language and apply changes
     */
    function setLanguage(language) {
        if (!languages[language]) {
            console.warn(`Language '${language}' not supported. Available languages:`, Object.keys(languages));
            return;
        }
        
        currentLanguage = language;
        
        // Save preference
        localStorage.setItem('sakura-language', language);
        
        // Apply language changes
        applyLanguage(language);
        
        // Dispatch custom event for other scripts
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: language }
        }));
        
        console.log(`Language changed to: ${language}`);
    }
    
    /**
     * Apply language to the entire page
     */
    function applyLanguage(language) {
        // Update document language attribute
        document.documentElement.lang = language;
        
        // Update all elements with language data attributes
        updateTextContent(language);
        
        // Update form placeholders
        updatePlaceholders(language);
        
        // Update meta tags
        updateMetaTags(language);
        
        // Update page title
        updatePageTitle(language);
        
        // Update language toggle icons
        updateLanguageIcons(language);
    }
    
    /**
     * Update text content for elements with data attributes
     */
    function updateTextContent(language) {
        const elements = document.querySelectorAll(`[data-${language}]`);
        
        elements.forEach(element => {
            const text = element.getAttribute(`data-${language}`);
            if (text) {
                // Preserve HTML structure for certain elements
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            }
        });
    }
    
    /**
     * Update form placeholders
     */
    function updatePlaceholders(language) {
        const placeholderElements = document.querySelectorAll(`[data-${language}][placeholder]`);
        
        placeholderElements.forEach(element => {
            const placeholder = element.getAttribute(`data-${language}`);
            if (placeholder) {
                element.placeholder = placeholder;
            }
        });
    }
    
    /**
     * Update meta tags with language-specific content
     */
    function updateMetaTags(language) {
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        const titleElement = document.querySelector('title');
        
        if (metaDescription) {
            const description = metaDescription.getAttribute(`data-${language}`);
            if (description) {
                metaDescription.setAttribute('content', description);
            }
        }
        
        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        
        if (ogTitle && titleElement) {
            const title = titleElement.getAttribute(`data-${language}`);
            if (title) {
                ogTitle.setAttribute('content', title);
            }
        }
        
        if (ogDescription && metaDescription) {
            const description = metaDescription.getAttribute('content');
            if (description) {
                ogDescription.setAttribute('content', description);
            }
        }
    }
    
    /**
     * Update page title
     */
    function updatePageTitle(language) {
        const titleElement = document.querySelector('title');
        if (titleElement) {
            const title = titleElement.getAttribute(`data-${language}`);
            if (title) {
                titleElement.textContent = title;
            }
        }
    }
    
    /**
     * Update language toggle icons
     */
    function updateLanguageIcons(language) {
        const enIcon = document.querySelector('.lang-icon.en-icon');
        const thIcon = document.querySelector('.lang-icon.th-icon');
        
        if (enIcon && thIcon) {
            if (language === 'th') {
                enIcon.style.opacity = '0';
                thIcon.style.opacity = '1';
            } else {
                enIcon.style.opacity = '1';
                thIcon.style.opacity = '0';
            }
        }
    }
    
    /**
     * Get current language
     */
    function getCurrentLanguage() {
        return currentLanguage;
    }
    
    /**
     * Get available languages
     */
    function getAvailableLanguages() {
        return { ...languages };
    }
    
    /**
     * Check if a language is supported
     */
    function isLanguageSupported(language) {
        return languages.hasOwnProperty(language);
    }
    
    /**
     * Get localized text for a key
     */
    function getText(key, language = currentLanguage) {
        const element = document.querySelector(`[data-${language}]`);
        if (element) {
            return element.getAttribute(`data-${language}`);
        }
        return key;
    }
    
    /**
     * Format numbers according to language locale
     */
    function formatNumber(number, language = currentLanguage) {
        const locales = {
            en: 'en-US',
            th: 'th-TH'
        };
        
        return new Intl.NumberFormat(locales[language]).format(number);
    }
    
    /**
     * Format currency according to language locale
     */
    function formatCurrency(amount, currency = 'USD', language = currentLanguage) {
        const locales = {
            en: 'en-US',
            th: 'th-TH'
        };
        
        return new Intl.NumberFormat(locales[language], {
            style: 'currency',
            currency: currency
        }).format(amount);
    }
    
    /**
     * Format date according to language locale
     */
    function formatDate(date, language = currentLanguage) {
        const locales = {
            en: 'en-US',
            th: 'th-TH'
        };
        
        return new Intl.DateTimeFormat(locales[language], {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }
    
    /**
     * Handle browser language detection
     */
    function detectBrowserLanguage() {
        const browserLanguage = navigator.language || navigator.userLanguage;
        const languageCode = browserLanguage.split('-')[0];
        
        if (isLanguageSupported(languageCode)) {
            return languageCode;
        }
        
        return defaultLanguage;
    }
    
    /**
     * Initialize language based on browser settings if no preference is saved
     */
    function initLanguageBasedOnBrowser() {
        const savedLanguage = localStorage.getItem('sakura-language');
        
        if (!savedLanguage) {
            const detectedLanguage = detectBrowserLanguage();
            setLanguage(detectedLanguage);
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLanguage);
    } else {
        initLanguage();
    }
    
    // Export functions to global scope
    window.SakuraLanguage = {
        setLanguage,
        getCurrentLanguage,
        getAvailableLanguages,
        isLanguageSupported,
        getText,
        formatNumber,
        formatCurrency,
        formatDate,
        toggleLanguage,
        detectBrowserLanguage,
        initLanguageBasedOnBrowser
    };
    
    // Also add to main SakuraRamen object if it exists
    if (window.SakuraRamen) {
        window.SakuraRamen.Language = window.SakuraLanguage;
    }
    
})();
