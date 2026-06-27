"use client";

import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateProductType } from "@/lib/products";
import { ProductFileUpload } from "@/components/products/ProductFileUpload";
import {
    useCreateProductMutation,
    useUploadMultipleFilesMutation,
} from "@/services/ecommerce";

const formSchema = z.object({
    name: z.string().min(1, "Product name is required."),
    description: z.string().optional(),
    stockQuantity: z.number().int().min(0, "Stock cannot be negative."),
    priceIn: z.number().positive("Cost price must be greater than 0."),
    priceOut: z.number().positive("Sale price must be greater than 0."),
    discount: z.number().min(0, "Discount cannot be negative."),
    warranty: z.string().optional(),
    availability: z.boolean(),
    colorName: z.string().optional(),
    categoryUuid: z.string().min(1, "Category UUID is required."),
    supplierUuid: z.string().min(1, "Supplier UUID is required."),
    brandUuid: z.string().min(1, "Brand UUID is required."),
    processor: z.string().optional(),
    ram: z.string().optional(),
    storage: z.string().optional(),
    gpu: z.string().optional(),
    os: z.string().optional(),
    screenSize: z.string().optional(),
    battery: z.string().optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

const defaultValues: ProductFormValues = {
    name: "",
    description: "",
    stockQuantity: 0,
    priceIn: 1,
    priceOut: 1,
    discount: 0,
    warranty: "",
    availability: true,
    colorName: "",
    categoryUuid: "",
    supplierUuid: "",
    brandUuid: "",
    processor: "",
    ram: "",
    storage: "",
    gpu: "",
    os: "",
    screenSize: "",
    battery: "",
};

const getMutationErrorMessage = (error: unknown) => {
    if (
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
    ) {
        return error.data.message;
    }

    return "Failed to create product.";
};

export default function CreateProduct() {
    const [createProduct, { isLoading: isCreating }] =
        useCreateProductMutation();
    const [uploadMultipleFiles, { isLoading: isUploading }] =
        useUploadMultipleFilesMutation();
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const {
        control,
        formState: { errors },
        handleSubmit,
        register,
        reset,
    } = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const resetForm = () => {
        reset(defaultValues);
        setImageFiles([]);
    };

    const uploadFiles = async (files: File[]) => {
        if (!files.length) {
            return [];
        }

        const formData = files.reduce((data, file) => {
            data.append("files", file);
            return data;
        }, new FormData());

        const uploadedFiles = await uploadMultipleFiles(formData).unwrap();

        return uploadedFiles
            .map((file) => file.uri)
            .filter((uri): uri is string => Boolean(uri));
    };

    const onSubmit = async (values: ProductFormValues) => {
        try {
            if (!imageFiles.length) {
                toast.error("Please choose at least one image file.");
                return;
            }

            const imageUris = await uploadFiles(imageFiles);
            const imageUri = imageUris[0];

            if (!imageUri) {
                toast.error("Image upload did not return a file URL.");
                return;
            }

            const product: CreateProductType = {
                name: values.name,
                description: values.description ?? "",
                stockQuantity: values.stockQuantity,
                priceIn: values.priceIn,
                priceOut: values.priceOut,
                discount: values.discount,
                thumbnail: imageUri,
                warranty: values.warranty ?? "",
                availability: values.availability,
                images: imageUris,
                color: values.colorName
                    ? [
                          {
                              color: values.colorName,
                              images: imageUris,
                          },
                      ]
                    : [],
                computerSpec: {
                    processor: values.processor ?? "",
                    ram: values.ram ?? "",
                    storage: values.storage ?? "",
                    gpu: values.gpu ?? "",
                    os: values.os ?? "",
                    screenSize: values.screenSize ?? "",
                    battery: values.battery ?? "",
                },
                categoryUuid: values.categoryUuid,
                supplierUuid: values.supplierUuid,
                brandUuid: values.brandUuid,
            };

            const response = await createProduct(product).unwrap();

            toast.success(response.message ?? "Product created.");
            resetForm();
        } catch (error) {
            toast.error(getMutationErrorMessage(error));
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto grid w-full max-w-5xl gap-6 p-4"
        >
            <div className="grid gap-4 rounded-lg border bg-card p-4 shadow-sm">
                <div>
                    <h1 className="text-lg font-semibold">Create Product</h1>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field data-invalid={!!errors.name}>
                        <FieldLabel htmlFor="name">Name</FieldLabel>
                        <Input
                            id="name"
                            aria-invalid={!!errors.name}
                            {...register("name")}
                        />
                        <FieldError errors={[errors.name]} />
                    </Field>

                    <Field className="md:col-span-2">
                        <FieldLabel>Images</FieldLabel>
                        <ProductFileUpload
                            value={imageFiles}
                            onValueChange={setImageFiles}
                            disabled={isCreating || isUploading}
                        />
                    </Field>

                    <Field
                        className="md:col-span-2"
                        data-invalid={!!errors.description}
                    >
                        <FieldLabel htmlFor="description">Description</FieldLabel>
                        <Textarea
                            id="description"
                            aria-invalid={!!errors.description}
                            {...register("description")}
                        />
                        <FieldError errors={[errors.description]} />
                    </Field>
                </div>
            </div>

            <div className="grid gap-4 rounded-lg border bg-card p-4 shadow-sm">
                <h2 className="text-base font-semibold">Pricing and Stock</h2>

                <div className="grid gap-4 md:grid-cols-4">
                    <Field data-invalid={!!errors.stockQuantity}>
                        <FieldLabel htmlFor="stockQuantity">Stock</FieldLabel>
                        <Input
                            id="stockQuantity"
                            type="number"
                            min={0}
                            aria-invalid={!!errors.stockQuantity}
                            {...register("stockQuantity", { valueAsNumber: true })}
                        />
                        <FieldError errors={[errors.stockQuantity]} />
                    </Field>

                    <Field data-invalid={!!errors.priceIn}>
                        <FieldLabel htmlFor="priceIn">Cost Price</FieldLabel>
                        <Input
                            id="priceIn"
                            type="number"
                            min={0}
                            step="0.01"
                            aria-invalid={!!errors.priceIn}
                            {...register("priceIn", { valueAsNumber: true })}
                        />
                        <FieldError errors={[errors.priceIn]} />
                    </Field>

                    <Field data-invalid={!!errors.priceOut}>
                        <FieldLabel htmlFor="priceOut">Sale Price</FieldLabel>
                        <Input
                            id="priceOut"
                            type="number"
                            min={0}
                            step="0.01"
                            aria-invalid={!!errors.priceOut}
                            {...register("priceOut", { valueAsNumber: true })}
                        />
                        <FieldError errors={[errors.priceOut]} />
                    </Field>

                    <Field data-invalid={!!errors.discount}>
                        <FieldLabel htmlFor="discount">Discount</FieldLabel>
                        <Input
                            id="discount"
                            type="number"
                            min={0}
                            step="0.01"
                            aria-invalid={!!errors.discount}
                            {...register("discount", { valueAsNumber: true })}
                        />
                        <FieldError errors={[errors.discount]} />
                    </Field>
                </div>
            </div>

            <div className="grid gap-4 rounded-lg border bg-card p-4 shadow-sm">
                <h2 className="text-base font-semibold">Relations</h2>

                <div className="grid gap-4 md:grid-cols-3">
                    <Field data-invalid={!!errors.categoryUuid}>
                        <FieldLabel htmlFor="categoryUuid">Category UUID</FieldLabel>
                        <Input
                            id="categoryUuid"
                            aria-invalid={!!errors.categoryUuid}
                            {...register("categoryUuid")}
                        />
                        <FieldError errors={[errors.categoryUuid]} />
                    </Field>

                    <Field data-invalid={!!errors.supplierUuid}>
                        <FieldLabel htmlFor="supplierUuid">Supplier UUID</FieldLabel>
                        <Input
                            id="supplierUuid"
                            aria-invalid={!!errors.supplierUuid}
                            {...register("supplierUuid")}
                        />
                        <FieldError errors={[errors.supplierUuid]} />
                    </Field>

                    <Field data-invalid={!!errors.brandUuid}>
                        <FieldLabel htmlFor="brandUuid">Brand UUID</FieldLabel>
                        <Input
                            id="brandUuid"
                            aria-invalid={!!errors.brandUuid}
                            {...register("brandUuid")}
                        />
                        <FieldError errors={[errors.brandUuid]} />
                    </Field>
                </div>
            </div>

            <div className="grid gap-4 rounded-lg border bg-card p-4 shadow-sm">
                <h2 className="text-base font-semibold">Media and Specs</h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field data-invalid={!!errors.colorName}>
                        <FieldLabel htmlFor="colorName">Color</FieldLabel>
                        <Input
                            id="colorName"
                            aria-invalid={!!errors.colorName}
                            {...register("colorName")}
                        />
                        <FieldError errors={[errors.colorName]} />
                    </Field>

                    <Field data-invalid={!!errors.processor}>
                        <FieldLabel htmlFor="processor">Processor</FieldLabel>
                        <Input
                            id="processor"
                            aria-invalid={!!errors.processor}
                            {...register("processor")}
                        />
                        <FieldError errors={[errors.processor]} />
                    </Field>

                    <Field data-invalid={!!errors.ram}>
                        <FieldLabel htmlFor="ram">RAM</FieldLabel>
                        <Input
                            id="ram"
                            aria-invalid={!!errors.ram}
                            {...register("ram")}
                        />
                        <FieldError errors={[errors.ram]} />
                    </Field>

                    <Field data-invalid={!!errors.storage}>
                        <FieldLabel htmlFor="storage">Storage</FieldLabel>
                        <Input
                            id="storage"
                            aria-invalid={!!errors.storage}
                            {...register("storage")}
                        />
                        <FieldError errors={[errors.storage]} />
                    </Field>

                    <Field data-invalid={!!errors.gpu}>
                        <FieldLabel htmlFor="gpu">GPU</FieldLabel>
                        <Input
                            id="gpu"
                            aria-invalid={!!errors.gpu}
                            {...register("gpu")}
                        />
                        <FieldError errors={[errors.gpu]} />
                    </Field>

                    <Field data-invalid={!!errors.os}>
                        <FieldLabel htmlFor="os">OS</FieldLabel>
                        <Input
                            id="os"
                            aria-invalid={!!errors.os}
                            {...register("os")}
                        />
                        <FieldError errors={[errors.os]} />
                    </Field>

                    <Field data-invalid={!!errors.screenSize}>
                        <FieldLabel htmlFor="screenSize">Screen Size</FieldLabel>
                        <Input
                            id="screenSize"
                            aria-invalid={!!errors.screenSize}
                            {...register("screenSize")}
                        />
                        <FieldError errors={[errors.screenSize]} />
                    </Field>

                    <Field data-invalid={!!errors.battery}>
                        <FieldLabel htmlFor="battery">Battery</FieldLabel>
                        <Input
                            id="battery"
                            aria-invalid={!!errors.battery}
                            {...register("battery")}
                        />
                        <FieldError errors={[errors.battery]} />
                    </Field>

                    <Field data-invalid={!!errors.warranty}>
                        <FieldLabel htmlFor="warranty">Warranty</FieldLabel>
                        <Input
                            id="warranty"
                            aria-invalid={!!errors.warranty}
                            {...register("warranty")}
                        />
                        <FieldError errors={[errors.warranty]} />
                    </Field>

                    <Controller
                        control={control}
                        name="availability"
                        render={({ field }) => (
                            <Field
                                orientation="horizontal"
                                className="items-center gap-3 pt-6"
                            >
                                <Checkbox
                                    id="availability"
                                    checked={field.value}
                                    onCheckedChange={(checked) =>
                                        field.onChange(checked === true)
                                    }
                                />
                                <FieldLabel htmlFor="availability">
                                    Available
                                </FieldLabel>
                            </Field>
                        )}
                    />
                </div>
            </div>

            <div className="flex items-center justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    disabled={isCreating || isUploading}
                    onClick={resetForm}
                >
                    Reset
                </Button>
                <Button type="submit" disabled={isCreating || isUploading}>
                    {isUploading
                        ? "Uploading..."
                        : isCreating
                          ? "Creating..."
                          : "Create product"}
                </Button>
            </div>
        </form>
    );
}
