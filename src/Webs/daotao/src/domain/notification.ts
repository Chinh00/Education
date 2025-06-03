export interface Notification {
    id: string;
    title: string;
    content: string;
    isRead: boolean;
    roles: string[];
    createdAt: string; 
    updatedAt: string | null;
}
