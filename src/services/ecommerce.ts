import {
    CreateProductType,
    ProductResponse,
    ProductType,
    UpdateProductType,
} from "@/lib/products";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ecommerceApi = createApi({
    reducerPath: "ecommerceApi",
    tagTypes: ["Products"],
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_ISHOP_BASE_URL}`,
    }),
    endpoints: (builder) => ({
        // getAllProducts
        getAllProduct: builder.query<
            ProductResponse,
            { page: number; size: number }
        >({
            query: ({ page, size }) => `/products?page=${page}&size=${size}`,
            providesTags: ["Products"],
        }),
        //  getProductByUUid
        getProductByUuid: builder.query<ProductType, string>({
            query: (uuid: string) => ({
                url: `/products/${uuid}`,
            }),
        }),
        // create Product
        createProduct: builder.mutation<ProductType, CreateProductType>({
            query: (newProduct: CreateProductType) => ({
                url: `${window.location.origin}/api/products`,
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: newProduct,
            }),
            invalidatesTags: ["Products"],
        }),
        // update Product
        updateProduct: builder.mutation<
            ProductType,
            { uuid: string; product: UpdateProductType }
        >({
            query: ({ uuid, product }) => ({
                url: `${window.location.origin}/api/products/${uuid}`,
                method: "PUT",
                headers: {
                    "content-type": "application/json",
                },
                body: product,
            }),
            invalidatesTags: ["Products"],
        }),
        // delete Product
        deleteProduct: builder.mutation<{ message?: string } | null, string>({
            query: (uuid: string) => ({
                url: `${window.location.origin}/api/products/${uuid}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Products"],
        }),
    }),
});

export const {
    useGetAllProductQuery,
    useGetProductByUuidQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = ecommerceApi;
