import { useState } from 'react';
import { createSale } from '../api/createSale';
import type { CreateSaleDto } from '../types';

export const useCreateSale = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutateAsync = async (data: CreateSaleDto) => {
        setIsLoading(true);
        setIsSuccess(false);
        setIsError(false);
        setError(null);

        try {
            const response = await createSale(data);
            setIsSuccess(true);
            return response;
        } catch (err: any) {
            setIsError(true);
            setError(err.message || 'Error desconocido al registrar la venta');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        mutate: mutateAsync,
        isLoading,
        isSuccess,
        isError,
        error
    };
};
