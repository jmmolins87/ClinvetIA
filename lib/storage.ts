/**
 * SSR-safe localStorage and sessionStorage utilities
 * All functions guard against server-side rendering
 */

// ============================================================================
// localStorage Utilities
// ============================================================================

export function getItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const item = window.localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Failed to get item "${key}" from localStorage:`, error);
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to set item "${key}" in localStorage:`, error);
  }
}

export function removeItem(key: string): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove item "${key}" from localStorage:`, error);
  }
}

// Aliases for consistency
export const getLocalStorage = getItem;
export const setLocalStorage = setItem;
export const removeLocalStorage = removeItem;

// ============================================================================
// sessionStorage Utilities
// ============================================================================

export function getSessionItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const item = window.sessionStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Failed to get item "${key}" from sessionStorage:`, error);
    return null;
  }
}

export function setSessionItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to set item "${key}" in sessionStorage:`, error);
  }
}

export function removeSessionItem(key: string): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove item "${key}" from sessionStorage:`, error);
  }
}

// Aliases for consistency
export const getSessionStorage = getSessionItem;
export const setSessionStorage = setSessionItem;
export const removeSessionStorage = removeSessionItem;
