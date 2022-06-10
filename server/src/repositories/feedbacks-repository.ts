export interface FeedbackCreateData {
    type: string;
    comment: string;
    screenshot?: string;
    date: string;
    name?: string;
}

export interface FeedbacksRepository {
    create: (data: FeedbackCreateData) => Promise<void>;
}