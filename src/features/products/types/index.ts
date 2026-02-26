/**
 * Este archivo define los "Tipos" o "Interfaces" de nuestro dominio de Productos.
 * En TypeScript, las interfaces son como "contratos" que le dicen al código 
 * qué forma exacta debe tener un objeto para que no cometamos errores.
 */

// Esta interfaz representa cómo luce un Producto que ya existe en nuestra Base de Datos.
// Por eso incluye el 'id', ya que la BD se encarga de asignárselo.
export interface Product {
    id: number | string; // Permitimos que el ID sea número o texto dependiendo de tu base de datos
    name: string;        // Nombre del producto (obligatorio)
    description: string; // Descripción detallada (obligatoria)
    price: number;       // Precio en formato numérico (obligatorio)
    stock: number;       // Cantidad en stock (obligatorio)
    createdAt?: string;  // Fecha de creación
    valuation?: number;  // Valoración total del producto (price * stock)
}

// Esta interfaz o DTO (Data Transfer Object) representa los datos exactos que 
// necesitamos enviarle al Backend cuando queremos CREAR un producto nuevo.
// Nota que NO tiene 'id', porque el backend nos lo va a generar.
export interface CreateProductDto {
    name: string;
    description: string;
    price: number;
}

export interface CreateStockMovementDto {
    productId: number;
    type: string;
    quantity: number;
}

// Representa un Movimiento de Stock devuelto por el backend
export interface StockMovement {
    id: number;
    type: 'IN' | 'OUT' | 'ADJUSTMENT' | string;
    quantity: number;
    productId: number;
    createdAt: string;
    // Opcionalmente podemos recibir el producto anidado si el backend usa un JOIN
    product?: Product;
}

// Representa el reporte de desempeño de un producto
export interface ProductPerformance {
    id: number;
    name: string;
    stockCurrent: number;
    soldQuantity: number;
    estimatedRevenue: number;
    price: number;
}