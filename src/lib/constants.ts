/**
 * Application-wide constants
 */

// Storage keys
export const STORAGE_KEYS = {
    SITES: "sites",
    SCHEDULES: "schedules",
    ENABLED: "enabled",
    ITEMS_PER_PAGE: "itemsPerPage",
    THEME: "theme",
    STATISTICS: "statistics",
    CHART_TIME_RANGE: "chartTimeRange",
    CHART_TOP_SITES_LIMIT: "chartTopSitesLimit",
    HEATMAP_TIME_RANGE: "heatmapTimeRange"
} as const;

// Pagination
export const PAGINATION = {
    DEFAULT_ITEMS_PER_PAGE: 10,
    ITEMS_PER_PAGE_OPTIONS: [5, 10, 25, 50, 100],
    MAX_PAGES_TO_SHOW: 5
} as const;

// Animation
export const ANIMATION = {
    DEFAULT_DURATION: 150,
    SCROLL_DELAY: 150
} as const;

// Schedule defaults
export const SCHEDULE_DEFAULTS = {
    WEEKDAYS: [1, 2, 3, 4, 5], // Monday to Friday
    TIME_FROM: "09:00",
    TIME_TO: "17:00"
} as const;

// URLs
export const URLS = {
    BLOCKED_PAGE: "blocked.html",
    OPTIONS_PAGE: "options.html",
    FAVICON_API: "https://s2.googleusercontent.com/s2/favicons?domain_url="
} as const;
