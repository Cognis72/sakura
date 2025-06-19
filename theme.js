/**
 * Theme switching functionality for Sakura Ramen website
 * Handles light/dark mode toggle with localStorage persistence
 */

(function() {
    'use strict';
    
    // Available themes
    const themes = {
        light: 'Light Mode',
        dark: 'Dark Mode'
    };
    
    // Default theme
    const defaultTheme = 'light';
    
    // Current theme
    let currentTheme = defaultTheme;
    
    /**
     * Initialize theme functionality
     */
    function initTheme() {
        // Load saved theme preference
        loadThemePreference();
        
        // Set up theme toggle button
        setupThemeToggle();
        
        // Apply initial theme
        applyTheme(currentTheme);
        
        // Listen for system theme changes
        setupSystemThemeListener();
        
        console.log(`Theme system initialized with: ${currentTheme}`);
    }
    
    /**
     * Load theme preference from localStorage or system preference
     */
    function loadThemePreference() {
        const savedTheme = localStorage.getItem('sakura-theme');
        
        if (savedTheme && themes[savedTheme]) {
            currentTheme = savedTheme;
        } else {
            // Check system preference
            currentTheme = getSystemTheme();
        }
    }
    
    /**
     * Get system theme preference
     */
    function getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    /**
     * Setup theme toggle button functionality
     */
    function setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
            
            // Add keyboard support
            themeToggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleTheme();
                }
            });
            
            // Update aria-label based on current theme
            updateThemeToggleLabel(themeToggle);
        }
    }
    
    /**
     * Setup system theme change listener
     */
    function setupSystemThemeListener() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addListener(function(e) {
                // Only auto-switch if user hasn't manually set a preference
                const savedTheme = localStorage.getItem('sakura-theme');
                if (!savedTheme) {
                    const systemTheme = e.matches ? 'dark' : 'light';
                    setTheme(systemTheme, false); // false = don't save to localStorage
                }
            });
        }
    }
    
    /**
     * Toggle between light and dark themes
     */
    function toggleTheme() {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }
    
    /**
     * Set theme and apply changes
     */
    function setTheme(theme, savePreference = true) {
        if (!themes[theme]) {
            console.warn(`Theme '${theme}' not supported. Available themes:`, Object.keys(themes));
            return;
        }
        
        currentTheme = theme;
        
        // Save preference if requested
        if (savePreference) {
            localStorage.setItem('sakura-theme', theme);
        }
        
        // Apply theme changes
        applyTheme(theme);
        
        // Update toggle button
        updateThemeToggleIcons();
        updateThemeToggleLabel();
        
        // Dispatch custom event for other scripts
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: theme }
        }));
        
        console.log(`Theme changed to: ${theme}`);
    }
    
    /**
     * Apply theme to the entire page
     */
    function applyTheme(theme) {
        // Update document data-theme attribute
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update meta theme-color for mobile browsers
        updateMetaThemeColor(theme);
        
        // Smooth transition for theme change
        addTransitionClass();
        
        // Store theme colors in CSS custom properties if needed
        updateThemeColors(theme);
    }
    
    /**
     * Update meta theme-color for mobile browsers
     */
    function updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        const colors = {
            light: '#ffffff',
            dark: '#1a1a1a'
        };
        
        metaThemeColor.content = colors[theme];
    }
    
    /**
     * Add transition class for smooth theme switching
     */
    function addTransitionClass() {
        document.documentElement.classList.add('theme-transition');
        
        // Remove transition class after animation completes
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 300);
    }
    
    /**
     * Update theme-specific color variables if needed
     */
    function updateThemeColors(theme) {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            // Add any additional dark theme specific colors
            root.style.setProperty('--bg-color-rgb', '26, 26, 26');
        } else {
            // Add any additional light theme specific colors
            root.style.setProperty('--bg-color-rgb', '255, 255, 255');
        }
    }
    
    /**
     * Update theme toggle icons
     */
    function updateThemeToggleIcons() {
        const lightIcon = document.querySelector('.theme-icon.light-icon');
        const darkIcon = document.querySelector('.theme-icon.dark-icon');
        
        if (lightIcon && darkIcon) {
            if (currentTheme === 'dark') {
                lightIcon.style.opacity = '0';
                darkIcon.style.opacity = '1';
            } else {
                lightIcon.style.opacity = '1';
                darkIcon.style.opacity = '0';
            }
        }
    }
    
    /**
     * Update theme toggle button aria-label
     */
    function updateThemeToggleLabel(button = null) {
        const themeToggle = button || document.querySelector('.theme-toggle');
        
        if (themeToggle) {
            const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
            const label = `Switch to ${themes[nextTheme]}`;
            themeToggle.setAttribute('aria-label', label);
        }
    }
    
    /**
     * Get current theme
     */
    function getCurrentTheme() {
        return currentTheme;
    }
    
    /**
     * Get available themes
     */
    function getAvailableThemes() {
        return { ...themes };
    }
    
    /**
     * Check if a theme is supported
     */
    function isThemeSupported(theme) {
        return themes.hasOwnProperty(theme);
    }
    
    /**
     * Reset to system theme
     */
    function resetToSystemTheme() {
        localStorage.removeItem('sakura-theme');
        const systemTheme = getSystemTheme();
        setTheme(systemTheme, false);
    }
    
    /**
     * Check if user has a saved theme preference
     */
    function hasUserPreference() {
        return localStorage.getItem('sakura-theme') !== null;
    }
    
    /**
     * Get theme preference (user preference or system preference)
     */
    function getThemePreference() {
        const savedTheme = localStorage.getItem('sakura-theme');
        return savedTheme || getSystemTheme();
    }
    
    /**
     * Add CSS for smooth theme transitions
     */
    function addThemeTransitionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .theme-transition,
            .theme-transition *,
            .theme-transition *:before,
            .theme-transition *:after {
                transition: background-color 0.3s ease, 
                           color 0.3s ease, 
                           border-color 0.3s ease, 
                           box-shadow 0.3s ease !important;
                transition-delay: 0s !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Auto-detect and apply appropriate theme based on time of day
     */
    function autoDetectTimeBasedTheme() {
        const hour = new Date().getHours();
        const isDayTime = hour >= 6 && hour < 18;
        return isDayTime ? 'light' : 'dark';
    }
    
    /**
     * Initialize theme with advanced options
     */
    function initAdvancedTheme(options = {}) {
        const {
            useSystemPreference = true,
            useTimeBasedDetection = false,
            respectReducedMotion = true
        } = options;
        
        if (respectReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Skip transitions for users who prefer reduced motion
            return;
        }
        
        let initialTheme = defaultTheme;
        
        if (hasUserPreference()) {
            initialTheme = localStorage.getItem('sakura-theme');
        } else if (useTimeBasedDetection) {
            initialTheme = autoDetectTimeBasedTheme();
        } else if (useSystemPreference) {
            initialTheme = getSystemTheme();
        }
        
        setTheme(initialTheme, false);
    }
    
    // Add theme transition styles
    addThemeTransitionStyles();
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
    
    // Export functions to global scope
    window.SakuraTheme = {
        setTheme,
        getCurrentTheme,
        getAvailableThemes,
        isThemeSupported,
        toggleTheme,
        resetToSystemTheme,
        hasUserPreference,
        getThemePreference,
        getSystemTheme,
        autoDetectTimeBasedTheme,
        initAdvancedTheme
    };
    
    // Also add to main SakuraRamen object if it exists
    if (window.SakuraRamen) {
        window.SakuraRamen.Theme = window.SakuraTheme;
    }
    
})();
