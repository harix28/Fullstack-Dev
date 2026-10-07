import { mockDocuments } from '@/data/mockDocuments';
// In-memory mutable copy so mutations (delete/upload) persist during a session
let documentsStore = mockDocuments.map((d) => ({ ...d }));
// ─── Helpers ─────────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// ─── Documents Service ────────────────────────────────────────────────────────
/**
 * Fetch all documents for the current user.
 *
 * Future: GET to API_ENDPOINTS.documents.list
 */
export const getDocuments = async () => {
    await delay(400);
    return documentsStore.map((d) => ({ ...d }));
};
/**
 * Fetch documents filtered by category.
 *
 * Future: GET to API_ENDPOINTS.documents.list?category=...
 */
export const getDocumentsByCategory = async (category) => {
    await delay(350);
    return documentsStore
        .filter((d) => d.category === category)
        .map((d) => ({ ...d }));
};
/**
 * Fetch a single document by its ID.
 * Throws if the document is not found.
 *
 * Future: GET to API_ENDPOINTS.documents.detail(id)
 */
export const getDocumentById = async (id) => {
    await delay(300);
    const doc = documentsStore.find((d) => d.id === id);
    if (!doc) {
        throw new Error(`Document with id "${id}" not found.`);
    }
    return { ...doc };
};
/**
 * Simulate uploading a new document.
 * Adds the document to the in-memory store with status 'processing'.
 *
 * Future: POST multipart/form-data to API_ENDPOINTS.documents.upload
 */
export const uploadDocument = async (data) => {
    await delay(1200);
    const newDocument = {
        id: `doc_${Date.now()}`,
        name: data.name,
        type: data.type,
        category: data.category,
        fileName: data.fileName,
        fileSize: data.fileSize,
        fileType: data.fileType,
        uploadDate: new Date().toISOString(),
        expiryDate: data.expiryDate,
        status: 'processing',
        ocrStatus: 'pending',
        extractedData: {},
        tags: data.tags ?? [],
        usedIn: [],
    };
    documentsStore = [newDocument, ...documentsStore];
    return { ...newDocument };
};
/**
 * Delete a document by its ID.
 * Returns the id of the deleted document.
 *
 * Future: DELETE to API_ENDPOINTS.documents.delete(id)
 */
export const deleteDocument = async (id) => {
    await delay(300);
    const exists = documentsStore.some((d) => d.id === id);
    if (!exists) {
        throw new Error(`Document with id "${id}" not found.`);
    }
    documentsStore = documentsStore.filter((d) => d.id !== id);
    return id;
};
