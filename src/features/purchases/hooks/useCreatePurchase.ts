import { useState } from 'react';
import { createPurchase } from '../api/createPurchase';
import type { CreatePurchaseDto, PurchaseResponse } from '../types';

export const useCreatePurchase = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutate = async (data: CreatePurchaseDto): Promise<PurchaseResponse> => {
        setIsLoading(true);
        setIsError(false);
        setError(null);

        try {
            const response = await createPurchase(data);
            return response;
        } catch (err: any) {
            setIsError(true);
            setError(err.message || 'Error occurred during purchase creation');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { mutate, isLoading, isError, error };
};
