"use client";

import Image from "next/image";
import { ImagePlus, Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ProductFileUploadProps = {
    value: File[];
    onValueChange: (files: File[]) => void;
    disabled?: boolean;
    maxFiles?: number;
    maxSize?: number;
    className?: string;
};

const getFileKey = (file: File) =>
    `${file.name}-${file.size}-${file.lastModified}`;

const formatFileSize = (size: number) => {
    if (size < 1024 * 1024) {
        return `${Math.round(size / 1024)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

function ProductImagePreview({
    file,
    onRemove,
    disabled,
}: {
    file: File;
    onRemove: () => void;
    disabled?: boolean;
}) {
    const previewUrl = React.useMemo(() => URL.createObjectURL(file), [file]);

    React.useEffect(() => {
        return () => URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    return (
        <div className="relative overflow-hidden rounded-md border bg-muted/30">
            <Image
                src={previewUrl}
                alt={file.name}
                width={220}
                height={160}
                unoptimized
                className="h-32 w-full object-cover"
            />
            <div className="grid gap-0.5 border-t px-3 py-2 text-xs">
                <p className="truncate font-medium text-foreground">
                    {file.name}
                </p>
                <p className="text-muted-foreground">
                    {formatFileSize(file.size)}
                </p>
            </div>
            <Button
                type="button"
                variant="secondary"
                size="icon"
                disabled={disabled}
                onClick={onRemove}
                className="absolute right-2 top-2 size-7 rounded-full"
                aria-label={`Remove ${file.name}`}
            >
                <X className="size-4" />
            </Button>
        </div>
    );
}

export function ProductFileUpload({
    value,
    onValueChange,
    disabled,
    maxFiles = 10,
    maxSize = 5 * 1024 * 1024,
    className,
}: ProductFileUploadProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const addFiles = React.useCallback(
        (selectedFiles: File[]) => {
            const validFiles: File[] = [];

            selectedFiles.forEach((file) => {
                if (!file.type.startsWith("image/")) {
                    toast.error(`${file.name} is not an image file.`);
                    return;
                }

                if (file.size > maxSize) {
                    toast.error(
                        `${file.name} is larger than ${formatFileSize(maxSize)}.`,
                    );
                    return;
                }

                validFiles.push(file);
            });

            if (!validFiles.length) {
                return;
            }

            const existingFileKeys = new Set(value.map(getFileKey));
            const uniqueFiles = validFiles.filter(
                (file) => !existingFileKeys.has(getFileKey(file)),
            );
            const nextFiles = [...value, ...uniqueFiles].slice(0, maxFiles);

            if (value.length + uniqueFiles.length > maxFiles) {
                toast.error(`You can upload up to ${maxFiles} images.`);
            }

            onValueChange(nextFiles);
        },
        [maxFiles, maxSize, onValueChange, value],
    );

    const removeFile = (fileToRemove: File) => {
        onValueChange(
            value.filter((file) => getFileKey(file) !== getFileKey(fileToRemove)),
        );
    };

    return (
        <div className={cn("grid gap-3", className)}>
            <div
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                    event.preventDefault();

                    if (disabled) {
                        return;
                    }

                    addFiles(Array.from(event.dataTransfer.files));
                }}
                className={cn(
                    "grid cursor-pointer place-items-center gap-3 rounded-md border border-dashed bg-muted/20 px-4 py-8 text-center",
                    disabled && "cursor-not-allowed opacity-60",
                )}
                onClick={() => {
                    if (!disabled) {
                        inputRef.current?.click();
                    }
                }}
                role="button"
                tabIndex={disabled ? -1 : 0}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        inputRef.current?.click();
                    }
                }}
            >
                <Input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={disabled}
                    className="hidden"
                    onChange={(event) => {
                        addFiles(Array.from(event.target.files ?? []));
                        event.target.value = "";
                    }}
                />
                <div className="rounded-full border bg-background p-3">
                    <Upload className="size-5 text-muted-foreground" />
                </div>
                <div className="grid gap-1">
                    <p className="text-sm font-medium">
                        Drag and drop product images here
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Up to {maxFiles} images, {formatFileSize(maxSize)} each
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={disabled}
                    onClick={(event) => {
                        event.stopPropagation();
                        inputRef.current?.click();
                    }}
                >
                    <ImagePlus className="size-4" />
                    Browse files
                </Button>
            </div>

            {value.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {value.map((file) => (
                        <ProductImagePreview
                            key={getFileKey(file)}
                            file={file}
                            disabled={disabled}
                            onRemove={() => removeFile(file)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
