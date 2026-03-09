export interface Supplier {
    id: number;
    name: string;
    phone: string;
    email: string;
    createdAt: string;
}
export interface PaginatedSuppliers {
    data: Supplier[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
}
export interface CreateSupplierDto {
    name: string;
    phone: string;
    email: string;
}