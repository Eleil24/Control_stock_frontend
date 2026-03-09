import { useState } from 'react';
import { createStockMovement } from '../api/createStockMovement';
import type { CreateStockMovementDto } from '../types';
export const useCreateStockMovement = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const mutate = async (
        movementData: CreateStockMovementDto,
        options?: { onSuccess?: () => void }
    ) => {
        setIsLoading(true);
        setIsSuccess(false);
        setError(null);
        try {
            await createStockMovement(movementData);
            setIsSuccess(true);
            if (options?.onSuccess) {
                options.onSuccess();
            }
        } catch (err: any) {
            setError(err.message || 'Error desconocido al registrar el movimiento');
        } finally {
            setIsLoading(false);
        }
    };
    return {
        mutate,
        isLoading,
        isSuccess,
        error,
    };
};