// Currency formatting utilities
export function formatCurrency(amount, compact = false) {
    if (compact) {
        if (amount >= 10000000)
            return `₹${(amount / 10000000).toFixed(1)}Cr`;
        if (amount >= 100000)
            return `₹${(amount / 100000).toFixed(1)}L`;
        if (amount >= 1000)
            return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}
export function formatFileSize(bytes) {
    if (bytes < 1024)
        return `${bytes} B`;
    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
