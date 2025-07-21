// OZZ Promotional Catalog Configuration
// Optimized for performance and mobile experience

const CONFIG = {
    // Application Settings
    APP_NAME: 'OZZ Cash & Carry - July 2025 Promo',
    VERSION: '1.0.0',
    
    // Performance Settings
    PRODUCTS_PER_PAGE: 20,
    IMAGE_LAZY_LOAD_THRESHOLD: 0.1,
    SEARCH_DEBOUNCE_MS: 300,
    ANIMATION_DURATION: 300,
    
    // Google Drive API Configuration
    GOOGLE_DRIVE: {
        API_KEY: 'AIzaSyDHKDrY2UUT9_HZhBY6GMAkyHYHIdv7OsA',
        FOLDER_ID: '1tG66zQTXGR-BQwjYZheRHVQ7s4n6-Jan',
        CACHE_TTL: 24 * 60 * 60 * 1000, // 24 hours
        CACHE_KEY_PREFIX: 'ozz_image_mapping',
        IMAGE_SIZES: {
            THUMBNAIL: 'w200-h150-c',
            PRODUCT: 'w400-h300-c',
            MODAL: 'w800-h600-c'
        }
    },
    
    // Data Sources
    DATA_SOURCES: {
        EXCEL_FILE: './JULY PROMO.xlsx',
        SHEET_NAME: 'Sheet1',
        REQUIRED_COLUMNS: ['SKU', 'PAGE 1', 'PRICE']
    },
    
    // UI Settings
    UI: {
        THEME_COLOR: '#dc2626',
        ACCENT_COLOR: '#2563eb',
        SUCCESS_COLOR: '#16a34a',
        WARNING_COLOR: '#d97706',
        
        BREAKPOINTS: {
            MOBILE: 480,
            TABLET: 768,
            DESKTOP: 1024
        },
        
        GRID_SETTINGS: {
            MOBILE_COLS: 2,
            TABLET_COLS: 3,
            DESKTOP_COLS: 4,
            MAX_COLS: 5
        }
    },
    
    // Product Categories
    CATEGORIES: {
        'BOWLS': {
            keywords: ['bowl'],
            icon: '🥣',
            color: '#3b82f6'
        },
        'CUPS & MUGS': {
            keywords: ['cup', 'mug'],
            icon: '☕',
            color: '#8b5cf6'
        },
        'PLATES': {
            keywords: ['plate', 'dinner'],
            icon: '🍽️',
            color: '#10b981'
        },
        'GLASSWARE': {
            keywords: ['glass', 'tumbler', 'wine', 'water'],
            icon: '🥛',
            color: '#06b6d4'
        },
        'STORAGE': {
            keywords: ['storage', 'container', 'cont'],
            icon: '📦',
            color: '#f59e0b'
        },
        'KITCHEN TOOLS': {
            keywords: ['kitchen', 'utensil', 'cook'],
            icon: '🔪',
            color: '#ef4444'
        },
        'CUTLERY': {
            keywords: ['cutlery', 'knife', 'fork', 'spoon'],
            icon: '🍴',
            color: '#6b7280'
        },
        'TRAYS & PLATTERS': {
            keywords: ['tray', 'platter'],
            icon: '🍯',
            color: '#84cc16'
        },
        'BOTTLES & JUGS': {
            keywords: ['bottle', 'jug', 'pitcher'],
            icon: '🍶',
            color: '#14b8a6'
        }
    },
    
    // Pricing Configuration
    PRICING: {
        MARKUP_PERCENTAGE: 20, // 20% markup for original price calculation
        CURRENCY_SYMBOL: 'R',
        DECIMAL_PLACES: 2
    },
    
    // Contact Information
    CONTACT: {
        BUSINESS_NAME: 'OZZ Cash & Carry',
        PHONE: '+27313327192',
        PHONE_DISPLAY: '+27 31 332 7192',
        EMAIL: null, // Add if available
        
        ADDRESSES: {
            MAIN: {
                name: 'OZZ CASH & CARRY',
                street: '40 Mazeppa & Gull Street',
                city: 'Durban',
                province: 'KwaZulu-Natal',
                postal: '4001',
                country: 'South Africa'
            },
            IKHAYA: {
                name: 'IKHAYA HOMESTORE',
                street: 'Block D, Shop 88 China City',
                city: 'Springfield Park, Durban',
                province: 'KwaZulu-Natal',
                postal: null,
                country: 'South Africa'
            }
        },
        
        HOURS: {
            WEEKDAYS: 'Monday - Friday: 8:00 AM - 5:00 PM',
            SATURDAY: 'Saturday: 8:00 AM - 1:00 PM',
            SUNDAY: 'Sunday: Closed'
        }
    },
    
    // SEO and Social Media
    SEO: {
        TITLE: 'July 2025 Promotional Catalog - OZZ Cash & Carry',
        DESCRIPTION: 'Exclusive promotional deals on premium home & kitchen products from OZZ Cash & Carry. Save up to 50% on quality items.',
        KEYWORDS: 'OZZ Cash & Carry, July 2025, promo, deals, kitchen, home, South Africa, Durban',
        OG_IMAGE: 'https://raw.githubusercontent.com/Iamabhih/OZZPromotions/main/OZZ-logo-transparent-1-1.png'
    },
    
    // Analytics and Tracking
    ANALYTICS: {
        ENABLED: false, // Set to true when you want to add analytics
        GOOGLE_ANALYTICS_ID: null, // Add your GA4 ID here
        FACEBOOK_PIXEL_ID: null // Add your Facebook Pixel ID here
    },
    
    // Feature Flags
    FEATURES: {
        OFFLINE_SUPPORT: true,
        PUSH_NOTIFICATIONS: false,
        SHOPPING_CART: false,
        USER_ACCOUNTS: false,
        WISHLIST: false,
        SOCIAL_SHARING: true,
        PRINT_CATALOG: true
    },
    
    // Performance Monitoring
    PERFORMANCE: {
        MONITOR_LOADING: true,
        LOG_SLOW_OPERATIONS: true,
        SLOW_THRESHOLD_MS: 2000,
        ENABLE_CONSOLE_LOGS: true
    },
    
    // Error Handling
    ERROR_HANDLING: {
        SHOW_ERROR_DETAILS: false, // Set to true for development
        FALLBACK_ERROR_MESSAGE: 'Something went wrong. Please try again or contact us.',
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY_MS: 1000
    }
};

// Utility functions
CONFIG.UTILS = {
    // Format price with currency
    formatPrice: (price) => {
        return `${CONFIG.PRICING.CURRENCY_SYMBOL}${price.toFixed(CONFIG.PRICING.DECIMAL_PLACES)}`;
    },
    
    // Calculate original price from promo price
    calculateOriginalPrice: (promoPrice) => {
        return promoPrice * (1 + CONFIG.PRICING.MARKUP_PERCENTAGE / 100);
    },
    
    // Calculate savings
    calculateSavings: (originalPrice, promoPrice) => {
        return {
            amount: originalPrice - promoPrice,
            percentage: Math.round(((originalPrice - promoPrice) / originalPrice) * 100)
        };
    },
    
    // Get category info
    getCategoryInfo: (categoryName) => {
        return CONFIG.CATEGORIES[categoryName] || {
            keywords: [],
            icon: '📦',
            color: '#6b7280'
        };
    },
    
    // Check if mobile device
    isMobile: () => {
        return window.innerWidth <= CONFIG.UI.BREAKPOINTS.MOBILE;
    },
    
    // Check if tablet device
    isTablet: () => {
        const width = window.innerWidth;
        return width > CONFIG.UI.BREAKPOINTS.MOBILE && width <= CONFIG.UI.BREAKPOINTS.TABLET;
    },
    
    // Get optimal grid columns for current screen size
    getOptimalColumns: () => {
        const width = window.innerWidth;
        if (width <= CONFIG.UI.BREAKPOINTS.MOBILE) {
            return CONFIG.UI.GRID_SETTINGS.MOBILE_COLS;
        } else if (width <= CONFIG.UI.BREAKPOINTS.TABLET) {
            return CONFIG.UI.GRID_SETTINGS.TABLET_COLS;
        } else {
            return CONFIG.UI.GRID_SETTINGS.DESKTOP_COLS;
        }
    },
    
    // Log performance metric
    logPerformance: (operation, duration) => {
        if (CONFIG.PERFORMANCE.MONITOR_LOADING && CONFIG.PERFORMANCE.ENABLE_CONSOLE_LOGS) {
            if (duration > CONFIG.PERFORMANCE.SLOW_THRESHOLD_MS) {
                console.warn(`⚠️ Slow operation: ${operation} took ${duration.toFixed(2)}ms`);
            } else {
                console.log(`⚡ ${operation}: ${duration.toFixed(2)}ms`);
            }
        }
    },
    
    // Format phone number for display
    formatPhoneDisplay: () => {
        return CONFIG.CONTACT.PHONE_DISPLAY;
    },
    
    // Format phone number for tel: links
    formatPhoneLink: () => {
        return CONFIG.CONTACT.PHONE;
    },
    
    // Get full address string
    getFullAddress: (location = 'MAIN') => {
        const addr = CONFIG.CONTACT.ADDRESSES[location];
        if (!addr) return '';
        
        return [
            addr.street,
            addr.city,
            addr.province,
            addr.postal,
            addr.country
        ].filter(Boolean).join(', ');
    }
};

// Environment detection
CONFIG.ENV = {
    IS_DEVELOPMENT: location.hostname === 'localhost' || location.hostname === '127.0.0.1',
    IS_GITHUB_PAGES: location.hostname.includes('github.io'),
    IS_PRODUCTION: location.protocol === 'https:' && !location.hostname.includes('localhost')
};

// Export for use in modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// Make available globally
window.CONFIG = CONFIG;

// Initialize configuration
console.log(`🔧 OZZ Catalog Configuration loaded - Version ${CONFIG.VERSION}`);
if (CONFIG.ENV.IS_DEVELOPMENT) {
    console.log('🛠️ Development mode detected');
    CONFIG.PERFORMANCE.ENABLE_CONSOLE_LOGS = true;
    CONFIG.ERROR_HANDLING.SHOW_ERROR_DETAILS = true;
}
