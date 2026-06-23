"use client";

import * as React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { DataTablePagination } from "../ui/data-pagination";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DataTableFacetedFilter } from "../ui/command-range";
import { useCreateProductMutation } from "@/services/ecommerce";
import { CreateProductType } from "@/lib/products";
import { showMutationConfirmation } from "@/lib/mutation-toast";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

const newProduct: CreateProductType = {
    name: "stringadgb",
    description: "stringkrnbgowi",
    computerSpec: {
        processor: "string",
        ram: "string",
        storage: "string",
        gpu: "string",
        os: "string",
        screenSize: "string",
        battery: "string",
    },
    stockQuantity: 0,
    priceIn: 1,
    priceOut: 1,
    discount: 0,
    color: [
        {
            color: "string",
            images: ["string"],
        },
    ],
    thumbnail: "string",
    warranty: "string",
    availability: true,
    images: ["string"],
    categoryUuid: "6abd6b9a-8b9a-4613-bc2d-42686156a313",
    supplierUuid: "7dd85516-733b-4d47-a445-583c225fb833",
    brandUuid: "c273f461-4492-4f00-9d69-8e12d0dd9d8b",
};

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [createProduct, { isLoading: isCreating }] =
        useCreateProductMutation();

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    // Helper to get ALL unique values (not affected by current filters)
    const getFacetedOptions = (columnId: string) => {
        const column = table.getColumn(columnId);
        if (!column) return [];

        // Get all rows from the original data
        const allRows = table.getPreFilteredRowModel().rows;

        const uniqueValues = new Set<string>();

        allRows.forEach((row) => {
            const value = row.getValue(columnId);
            if (value != null) {
                uniqueValues.add(String(value));
            }
        });

        return Array.from(uniqueValues)
            .sort()
            .map((value) => ({
                label: value,
                value: value,
            }));
    };

    const handleCreateProduct = () => {
        showMutationConfirmation({
            title: "Create product?",
            description: "This will add the sample product to the product list.",
            confirmLabel: "Create",
            loading: "Creating product...",
            success: "Product created.",
            error: "Failed to create product.",
            onConfirm: () => createProduct(newProduct).unwrap(),
        });
    };

    return (
        <>
            <div>
                <div className="flex items-center py-4">
                    <div className="flex gap-4">
                        <Input
                            placeholder="Filter name..."
                            value={
                                (table
                                    .getColumn("name")
                                    ?.getFilterValue() as string) ?? ""
                            }
                            onChange={(event) =>
                                table
                                    .getColumn("name")
                                    ?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                        {/* command filter */}

                        <DataTableFacetedFilter
                            column={table.getColumn("name")}
                            title="Name"
                            options={getFacetedOptions("name")}
                        />
                        {/* price */}
                        <DataTableFacetedFilter
                            column={table.getColumn("priceOut")}
                            title="Price"
                            options={getFacetedOptions("priceOut")}
                        />
                    </div>

                    <DropdownMenu>
                        <Button
                            variant="outline"
                            className="ml-auto"
                            disabled={isCreating}
                            onClick={handleCreateProduct}
                        >
                            {isCreating ? "Creating..." : "Create Product"}
                        </Button>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {/* data table pagination */}
                <div className="mt-5">
                    <DataTablePagination table={table} />
                </div>
            </div>
        </>
    );
}
