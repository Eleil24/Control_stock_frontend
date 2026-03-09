export interface Product {
    id: number | string; 
    name: string;        
    description: string; 
    price: number;       
    stock: number;       
    createdAt?: string;  
    valuation?: number;  
}
export interface CreateProductDto {
    name: string;
    description: string;
    price: number;
}
export interface UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
}
export interface CreateStockMovementDto {
    productId: number;
    type: string;
    quantity: number;
}
export interface StockMovement {
    id: number;
    type: 'IN' | 'OUT' | 'ADJUSTMENT' | string;
    quantity: number;
    productId: number;
    createdAt: string;
    product?: Product;
}
export interface ProductPerformance {
    id: number;
    name: string;
    stockCurrent: number;
    soldQuantity: number;
    estimatedRevenue: number;
    price: number;
}
export interface NetProfitReport {
    productId: number;
    productName: string;
    totalSalesForDate: number;
    totalSales: number;
    totalPurchases: number;
    netProfit: number;
}