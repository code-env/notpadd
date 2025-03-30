"use client";

import { Space } from "@workspace/db";
import React, { useEffect, useMemo, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { MoreVertical } from "lucide-react";
import Link from "next/link";

const fetchArticles = async (spaceId: string, page: number, limit: number) => {
  const axios = (await import("axios")).default;
  const res = await axios.get(`/api/v1/spaces/${spaceId}/articles`, {
    params: { page, limit },
  });

  if (res.status !== 200) {
    throw new Error("Failed to fetch articles");
  }

  return res.data;
};

const Articles = ({ space }: { space: Space }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "30", 10);

  const [pagination, setPagination] = useState({
    pageIndex: page - 1,
    pageSize: limit,
  });

  const { data, isFetching, isError } = useQuery({
    queryKey: [
      "articles",
      space.id,
      pagination.pageIndex + 1,
      pagination.pageSize,
    ],
    queryFn: () =>
      fetchArticles(space.id, pagination.pageIndex + 1, pagination.pageSize),
  });

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: "previewImage",
        header: "Image",
        cell: ({ row }) => {
          return (
            <div className="w-24 h-16 border rounded-md relative overflow-hidden">
              <Image
                fill
                alt={row.original.slug}
                src={
                  row.original.previewImage
                    ? row.original.previewImage
                    : "/placeholder.svg"
                }
              />
            </div>
          );
        },
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <Link
            href={`${pathname}/${row.original.slug}`}
            className="hover:underline"
          >
            {row.getValue("title") || "Untitled"}
          </Link>
        ),
      },

      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              row.getValue("status") === "Published"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.getValue("status")}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => {
          return (
            <button
              className="text-left"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Date
              <span className="ml-2">
                {column.getIsSorted()
                  ? column.getIsSorted() === "asc"
                    ? "↑"
                    : "↓"
                  : "↕"}
              </span>
            </button>
          );
        },
        cell: ({ row }) => {
          return (
            <span>
              {format(parseISO(row.original.createdAt), "MMM d, yyyy")}
            </span>
          );
        },
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Nothing</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: data?.articles || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil((data?.eventsCount || 0) / pagination.pageSize),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", (pagination.pageIndex + 1).toString());
    searchParams.set("limit", pagination.pageSize.toString());
    router.push(`?${searchParams.toString()}`, { scroll: false });
  }, [pagination, router]);

  return (
    <div>
      <Card className="px-6 py-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isFetching ? (
              [...Array(5)].map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
      </Card>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || isFetching}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || isFetching}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Articles;
