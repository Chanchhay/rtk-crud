"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../ui/data-table-column-header";
import {
    getProductImageSrc,
    PRODUCT_PLACEHOLDER_IMAGE,
} from "@/lib/product-image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// This type is used to define the shape of our data.

export type ProductHeader = {
    uuid: string;
    name: string;
    thumbnail: string;
    priceOut: number;
};

type ColumnsProps = {
    onViewDetail: (uuid: string) => void;
    onUpdateProduct: (uuid: string) => void;
    onDeleteProduct: (uuid: string) => void;
    isUpdatingProduct?: boolean;
    isDeletingProduct?: boolean;
};

const ProductThumbnail = ({ src, name }: { src: string; name: string }) => {
    const productImageSrc = getProductImageSrc(src);
    const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);
    const imageSrc =
        failedImageSrc === productImageSrc
            ? PRODUCT_PLACEHOLDER_IMAGE
            : productImageSrc;

    return (
        <Image
            loading="eager"
            height={75}
            width={75}
            src={imageSrc}
            alt={name}
            onError={() => {
                if (productImageSrc !== PRODUCT_PLACEHOLDER_IMAGE) {
                    setFailedImageSrc(productImageSrc);
                }
            }}
            className="size-[75px] object-contain"
        />
    );
};

export const columns = ({
    onViewDetail,
    onUpdateProduct,
    onDeleteProduct,
    isUpdatingProduct,
    isDeletingProduct,
}: ColumnsProps): ColumnDef<ProductHeader>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "uuid",
        header: "UUID",
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Name" />;
        },
    },
    {
        accessorKey: "thumbnail",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Thumbnail" />;
        },
        cell: ({ getValue, row }) => {
            const url = getValue();
            return (
                <ProductThumbnail
                    src={url as string}
                    name={row.original.name}
                />
            );
        },
    },
    {
        accessorKey: "priceOut",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Price$" />;
        },
        cell: ({ getValue }) => {
            const price = getValue();
            return (
                <h1 className="text-red-500 font-bold">{price as number}$</h1>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const product = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-12 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="overflow p-0">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(product.uuid)
                            }
                        >
                            Copy Product UUID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onViewDetail(product?.uuid)}
                        >
                            View Product Detail
                        </DropdownMenuItem>
                        {/* The students will implements these 2 functions */}
                        <DropdownMenuItem
                            disabled={isUpdatingProduct}
                            onClick={() => onUpdateProduct(product.uuid)}
                        >
                            {isUpdatingProduct
                                ? "Updating Product"
                                : "Update Product"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled={isDeletingProduct}
                            onClick={() => onDeleteProduct(product.uuid)}
                        >
                            {isDeletingProduct
                                ? "Deleting Product"
                                : "Delete Product"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
