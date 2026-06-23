"use client";
import { useState } from "react";
import { columns } from "@/components/tables/Columns";
import { DataTable } from "@/components/tables/TableComponent";
import { ViewProductDetail } from "@/components/ui/view-detail-product";
import {
    useDeleteProductMutation,
    useGetAllProductQuery,
    useUpdateProductMutation,
} from "@/services/ecommerce";
import { UpdateProductType } from "@/lib/products";

const updateProductData: UpdateProductType = {
    name: "Dell XPS 15 9530 Updated",
    description:
        "Updated premium ultrabook with InfinityEdge display for creative professionals and power users.",
    stockQuantity: 30,
    priceIn: 1425,
    priceOut: 1849,
    discount: 8,
    color: [
        {
            color: "Platinum Silver",
            images: [
                "https://example.com/images/dell-xps-15/silver-1.jpg",
                "https://example.com/images/dell-xps-15/silver-2.jpg",
            ],
        },
        {
            color: "Graphite Black",
            images: [
                "https://example.com/images/dell-xps-15/black-1.jpg",
                "https://example.com/images/dell-xps-15/black-2.jpg",
            ],
        },
    ],
    thumbnail:
        "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/touch-black/notebook-xps-15-9530-t-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=320&wid=520&qlt=100,1&resMode=sharp2&size=520,320&chrss=full",
    warranty: "2 years international warranty",
    availability: true,
    images: [
        "https://example.com/images/dell-xps-15/main-1.jpg",
        "https://example.com/images/dell-xps-15/main-2.jpg",
        "https://example.com/images/dell-xps-15/main-3.jpg",
    ],
    categoryUuid: "462d9f60-8346-45ab-b8b3-a597d240965b",
    supplierUuid: "a34496d2-370e-4332-8c6d-b4a6bc069bf1",
    brandUuid: "8f2e3bcb-bb0b-45a1-b9bc-1d43f08f0ddb",
};

export default function DataTablePage() {
    const { data } = useGetAllProductQuery({
        page: 0,
        size: 10000,
    });
    const [updateProduct, { isLoading: isUpdatingProduct }] =
        useUpdateProductMutation();
    const [deleteProduct, { isLoading: isDeletingProduct }] =
        useDeleteProductMutation();
    const tableData = Array.isArray(data?.content) ? data?.content : [];

    const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

    const handleViewDetail = (uuid: string) => {
        setSelectedUuid(uuid);
    };

    const handleClose = () => {
        setSelectedUuid(null);
    };

    const handleUpdateProduct = async (uuid: string) => {
        try {
            await updateProduct({
                uuid,
                product: updateProductData,
            }).unwrap();
        } catch (error) {
            console.error("Failed to update product", error);
        }
    };

    const handleDeleteProduct = async (uuid: string) => {
        try {
            await deleteProduct(uuid).unwrap();
        } catch (error) {
            console.error("Failed to delete product", error);
        }
    };

    return (
        <div className="container mx-auto py-10">
            <DataTable
                columns={columns({
                    onViewDetail: handleViewDetail,
                    onUpdateProduct: handleUpdateProduct,
                    onDeleteProduct: handleDeleteProduct,
                    isUpdatingProduct,
                    isDeletingProduct,
                })}
                data={tableData}
            />

            {/* Modal */}
            {selectedUuid && (
                <ViewProductDetail
                    uuid={selectedUuid}
                    open={true}
                    onOpenChange={(open) => {
                        if (!open) handleClose();
                    }}
                />
            )}
        </div>
    );
}
