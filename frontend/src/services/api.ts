const API_URL = 'http://localhost:8080/api';

export interface User {
    id: number;
    email: string;
    displayName?: string;
    avatarUrl?: string;
    authProvider: 'local' | 'google';
}

interface AuthResponse {
    id?: number;
    email?: string;
    displayName?: string;
    avatarUrl?: string;
    message: string;
}

interface LoginResponse {
    user: User;
    message: string;
}

export interface EventDto {
    id?: number;
    title: string;
    date: string; // YYYY-MM-DD
    time?: string;
    color: string;
    recurrence: string;
    endDate?: string;
    meetingLink?: string;
    userId?: number;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || 'Request failed');
    }
    return response.json();
};

const fetchWithCreds = (input: RequestInfo | URL, init?: RequestInit) => 
    fetch(input, { ...init, credentials: 'include' });

// Convert AuthResponse to LoginResponse format
const wrapAuthResponse = (res: AuthResponse, authProvider: 'local' | 'google'): LoginResponse => {
    if (!res.id || !res.email) {
        throw new Error(res.message || 'Login failed');
    }
    return {
        user: {
            id: res.id,
            email: res.email,
            displayName: res.displayName,
            avatarUrl: res.avatarUrl,
            authProvider,
        },
        message: res.message,
    };
};

export const api = {
    register: async (data: { email: string; password: string; displayName?: string }) => {
        const res = await fetchWithCreds(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }).then(r => handleResponse<AuthResponse>(r));
        return wrapAuthResponse(res, 'local');
    },

    login: async (data: { email: string; password: string }) => {
        const res = await fetchWithCreds(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }).then(r => handleResponse<AuthResponse>(r));
        return wrapAuthResponse(res, 'local');
    },

    // Google OAuth - redirect to backend OAuth flow
    getGoogleOAuthUrl: () => `${API_URL.replace('/api', '')}/oauth2/authorization/google`,

    getCurrentUser: () =>
        fetchWithCreds(`${API_URL}/auth/me`).then(res => handleResponse<AuthResponse>(res))
            .then(res => wrapAuthResponse(res, 'google')),

    getEvents: (userId: number) =>
        fetchWithCreds(`${API_URL}/events?userId=${userId}`).then(res => handleResponse<EventDto[]>(res)),

    createEvent: (event: Partial<EventDto>) =>
        fetchWithCreds(`${API_URL}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event),
        }).then(res => handleResponse<EventDto>(res)),

    updateEvent: (id: number, event: Partial<EventDto>) =>
        fetchWithCreds(`${API_URL}/events/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event),
        }).then(res => handleResponse<EventDto>(res)),

    deleteEvent: (id: number) =>
        fetchWithCreds(`${API_URL}/events/${id}`, { method: 'DELETE' }),
};

