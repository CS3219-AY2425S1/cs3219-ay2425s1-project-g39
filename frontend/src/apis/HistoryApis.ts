import { PracticeHistoryItem, Progress } from '../types/History';
import { api } from './ApiClient';

export const getPracticeHistory = async (
    userId: string,
): Promise<PracticeHistoryItem[]> => {
return api.get(`/history/${userId}`);
}

export const getProgress = async (
    userId: string,
): Promise<Progress> => {
return api.get(`/history/progress/${userId}`);
}