// Utility: merge class names (lightweight cn helper)
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
