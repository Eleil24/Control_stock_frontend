import { useState } from 'react';
import { createProduct } from '../api/createProduct';
import type { CreateProductDto, Product } from '../types';
interface UseCreateProductReturn {
    mutate: (data: CreateProductDto) => Promise<Product | undefined>;
    isLoading: boolean; 
    error: string | null;  
    isSuccess: boolean; 
}
export const useCreateProduct = (): UseCreateProductReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const mutate = async (data: CreateProductDto) => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);
        try {
            const newProduct = await createProduct(data);
            setIsSuccess(true);
            return newProduct;
        } catch (err: any) {
            setError(err.message || 'Ha ocurrido un error inesperado');
        } finally {
            setIsLoading(false);
        }
    };
    return { mutate, isLoading, error, isSuccess };
};