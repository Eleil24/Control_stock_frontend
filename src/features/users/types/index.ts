export interface User {
    id: number;
    name: string;
    username: string;
    role: 'ADMIN' | 'VENDEDOR' | 'ALMACENISTA' | string;
    isActive?: boolean;
    createdAt?: string;
}

export interface PaginatedUsers {
    data: User[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
}
