"use client";

import { toast } from "sonner";

type MutationToastOptions = {
    title: string;
    description: string;
    confirmLabel: string;
    loading: string;
    success: string;
    error: string;
    onConfirm: () => Promise<unknown>;
};

export const showMutationConfirmation = ({
    title,
    description,
    confirmLabel,
    loading,
    success,
    error,
    onConfirm,
}: MutationToastOptions) => {
    toast.warning(title, {
        description,
        duration: 10000,
        closeButton: true,
        action: {
            label: confirmLabel,
            onClick: () => {
                toast.promise(onConfirm(), {
                    loading,
                    success,
                    error,
                });
            },
        },
        cancel: {
            label: "Cancel",
            onClick: () => undefined,
        },
    });
};
