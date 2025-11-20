import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Sanitizes a site URL by:
 * - Trimming whitespace
 * - Removing protocol (http://, https://)
 * - Removing www. prefix
 * - Converting to lowercase for consistency
 * @param url - The URL to sanitize
 * @returns Sanitized URL string
 */
export function sanitizeSiteUrl(url: string): string {
    if (!url) return "";

    let sanitized = url.trim().toLowerCase();

    // Remove protocol
    sanitized = sanitized.replace(/^https?:\/\//i, "");

    // Remove www. prefix
    sanitized = sanitized.replace(/^www\./i, "");

    // Remove trailing slashes
    sanitized = sanitized.replace(/\/+$/, "");

    return sanitized;
}

/**
 * Validates that a string is a valid domain name
 * @param domain - The domain to validate
 * @returns True if valid domain, false otherwise
 */
export function isValidDomain(domain: string): boolean {
    if (!domain || typeof domain !== "string") return false;

    // Basic domain pattern: at least one dot, valid characters
    const domainPattern = /^([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i;

    return domainPattern.test(domain);
}
