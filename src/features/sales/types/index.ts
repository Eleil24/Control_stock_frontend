export interface SaleDetailDto {
    productId: number;
    quantity: number;
}

export interface CreateSaleDto {
    customerName: string;
    details: SaleDetailDto[];
}

export interface SaleDetail {
    id: number;
    saleId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    product?: {
        name: string;
    };
}

export interface SaleResponse {
    id: number;
    invoiceNumber: string;
    customerName: string;
    userId?: number;
    user?: {
        name: string;
    };
    total: number;
    createdAt: string;
    details: SaleDetail[];
}
