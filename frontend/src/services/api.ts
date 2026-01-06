const API_URL = 'http://localhost:8080/api';

export interface User {
    id: number;
    email: string;
    displayName?: string;
    avatarUrl?: string;
    authProvider: 'local' | 'google';
}

interface LoginResponse {
    user: User;
    message: string;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || 'Request failed');
    }
    return response.json();
};

export const api = {
    register: (data: { email: string; password: string; displayName?: string }) =>
        fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }).then(res => handleResponse<LoginResponse>(res)),

    login: (data: { email: string; password: string }) =>
        fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }).then(res => handleResponse<LoginResponse>(res)),

    googleLogin: (credential: string) =>
        fetch(`${API_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential }),
        }).then(res => handleResponse<LoginResponse>(res)),

    getEvents: (userId: number) =>
        fetch(`${API_URL}/events?userId=${userId}`).then(res => handleResponse(res)),

    createEvent: (event: any) =>
        fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event),
        }).then(res => handleResponse(res)),

    updateEvent: (id: number, event: any) =>
        fetch(`${API_URL}/events/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event),
        }).then(res => handleResponse(res)),

    deleteEvent: (id: number) =>
        fetch(`${API_URL}/events/${id}`, { method: 'DELETE' }),
};
