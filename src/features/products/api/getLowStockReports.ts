import type { PaginatedProducts } from './getProducts';

/**
 * Función encargada de obtener la lista paginada de productos con bajo stock desde el backend.
 * @param page Página actual
 * @param limit Cantidad de elementos por página
 * @param threshold Límite debajo del cual se considera stock bajo
 */
export const getLowStockReports = async (page: number = 1, limit: number = 10, threshold: number = 15): Promise<PaginatedProducts> => {
    const response = await fetch(`http://localhost:3000/reports/low-stock?page=${page}&limit=${limit}&threshold=${threshold}`);

    if (!response.ok) {
        throw new Error('No se pudo obtener el reporte de bajo stock');
    }

    const data = await response.json();
    return data;
};
