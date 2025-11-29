import { ApiResponse } from '@/types/auth';

const API_URL = typeof window === 'undefined'
    ? (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL)
    : process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchAdminApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem('accessToken');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}/admin${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
    }

    return data;
}

export const adminApi = {
    getAllUsers: async (): Promise<any[]> => {
        return fetchAdminApi<any[]>('/users');
    },

    updateUser: async (id: number, data: any): Promise<any> => {
        return fetchAdminApi<any>(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteUser: async (id: number): Promise<void> => {
        return fetchAdminApi<void>(`/users/${id}`, {
            method: 'DELETE',
        });
    }
};
