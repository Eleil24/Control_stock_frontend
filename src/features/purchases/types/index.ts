export interface PurchaseDetailDto {
    productId: number;
    quantity: number;
    unitCost: number;
}

export interface CreatePurchaseDto {
    invoiceNumber: string;
    supplierId: number;
    details: PurchaseDetailDto[];
}

export interface PurchaseResponse {
    id: number;
    invoiceNumber: string;
    supplierId: number;
    total: number;
    createdAt: string;
    details: any[]; // Extended as needed
}
