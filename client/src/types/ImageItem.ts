export interface ImageItem {
    id: string;
    title: string;
    description?: string;
    date_created: string; // Match backend schema
    url: string;
    source: string;
    confidence?: number; // Match backend schema
}
