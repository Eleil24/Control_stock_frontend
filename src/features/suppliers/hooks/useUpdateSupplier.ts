import { useState } from 'react';
import { updateSupplier } from '../api/updateSupplier';

export const useUpdateSupplier = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutate = async (id: number, data: { name: string; phone?: string; email?: string }) => {
        setIsLoading(true);
        setIsError(false);
        setError(null);

        try {
            const response = await updateSupplier(id, data);
            return response;
        } catch (err: any) {
            setIsError(true);
            setError(err.message || 'Error occurred during supplier update');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { mutate, isLoading, isError, error };
};
