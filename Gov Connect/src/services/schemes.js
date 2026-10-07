import { mockSchemes } from '@/data/mockSchemes';
// In-memory mutable copy so save toggles persist across calls during a session
let schemesStore = mockSchemes.map((s) => ({ ...s }));
// ─── Helpers ─────────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// ─── Schemes Service ─────────────────────────────────────────────────────────
/**
 * Fetch all schemes, optionally filtered.
 *
 * Future: GET to API_ENDPOINTS.schemes.list with query params
 */
export const getSchemes = async (filters) => {
    await delay(400);
    let results = [...schemesStore];
    if (filters?.search) {
        const q = filters.search.toLowerCase().trim();
        results = results.filter((s) => s.title.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            s.ministry.toLowerCase().includes(q) ||
            s.tags.some((t) => t.toLowerCase().includes(q)));
    }
    if (filters?.category) {
        results = results.filter((s) => s.category === filters.category);
    }
    if (filters?.ministry && filters.ministry.trim() !== '') {
        const m = filters.ministry.toLowerCase();
        results = results.filter((s) => s.ministry.toLowerCase().includes(m));
    }
    if (filters?.state && filters.state.trim() !== '') {
        if (filters.state === 'central') {
            results = results.filter((s) => !s.state);
        }
        else {
            results = results.filter((s) => !s.state || s.state.toLowerCase() === filters.state.toLowerCase());
        }
    }
    return results;
};
/**
 * Fetch top recommended schemes for the logged-in user, sorted by matchPercentage.
 *
 * Future: GET to API_ENDPOINTS.schemes.recommended
 */
export const getRecommendedSchemes = async () => {
    await delay(400);
    return [...schemesStore]
        .sort((a, b) => (b.matchPercentage ?? 0) - (a.matchPercentage ?? 0))
        .slice(0, 6);
};
/**
 * Fetch a single scheme by its ID.
 * Throws if the scheme is not found.
 *
 * Future: GET to API_ENDPOINTS.schemes.detail(id)
 */
export const getSchemeById = async (id) => {
    await delay(300);
    const scheme = schemesStore.find((s) => s.id === id);
    if (!scheme) {
        throw new Error(`Scheme with id "${id}" not found.`);
    }
    return { ...scheme };
};
/**
 * Toggle the isSaved flag for a scheme.
 * Returns the updated scheme.
 *
 * Future: POST to API_ENDPOINTS.schemes.save(id)
 */
export const saveScheme = async (id) => {
    await delay(200);
    const index = schemesStore.findIndex((s) => s.id === id);
    if (index === -1) {
        throw new Error(`Scheme with id "${id}" not found.`);
    }
    schemesStore[index] = {
        ...schemesStore[index],
        isSaved: !schemesStore[index].isSaved,
    };
    return { ...schemesStore[index] };
};
/**
 * Fetch all schemes that the user has saved.
 *
 * Future: GET to API_ENDPOINTS.schemes.list with saved=true param
 */
export const getSavedSchemes = async () => {
    await delay(300);
    return schemesStore.filter((s) => s.isSaved).map((s) => ({ ...s }));
};
