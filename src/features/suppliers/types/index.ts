export interface Supplier {
    id: number;
    name: string;
    phone: string;
    email: string;
    createdAt: string;
}

export interface CreateSupplierDto {
    name: string;
    phone: string;
    email: string;
}
