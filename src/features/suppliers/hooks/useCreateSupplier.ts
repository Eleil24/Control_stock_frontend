import { useState } from 'react';
import { createSupplier } from '../api/createSupplier';
import type { CreateSupplierDto, Supplier } from '../types';

export const useCreateSupplier = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutate = async (data: CreateSupplierDto): Promise<Supplier> => {
        setIsLoading(true);
        setIsError(false);
        setError(null);

        try {
            const response = await createSupplier(data);
            return response;
        } catch (err: any) {
            setIsError(true);
            setError(err.message || 'Error occurred during supplier creation');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { mutate, isLoading, isError, error };
};
