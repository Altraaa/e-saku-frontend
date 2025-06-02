export interface INotification {
    id: number;
    recipient_id: number;
    sender_id: number;
    message: string;
    is_read: boolean;
    created_at: string;
    updated_at: string;
}