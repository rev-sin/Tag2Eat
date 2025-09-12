/** biome-ignore-all lint/a11y/useButtonType: ignore this */
/** biome-ignore-all lint/style/noNonNullAssertion: ignore this */
/** biome-ignore-all lint/suspicious/noExplicitAny: ignore this */

"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { useCartStore } from "@/lib/useCartStore";
import type { MenuItem } from "@/types/menu";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const columnHelper = createColumnHelper<MenuItem>();

export default function MenuTable() {
  const [data, setData] = React.useState<MenuItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  const { isSignedIn } = useUser();
  const { addItem } = useCartStore();

  React.useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase.from("menu").select("*");
      if (error) {
        console.error("Error fetching menu:", error.message);
      } else if (data) {
        setData(data);
      }
      setLoading(false);
    };

    fetchMenu();
  }, []);

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: "Item",
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: (info) => info.getValue() ?? "-",
    }),
    columnHelper.accessor("price", {
      header: "Price (₹)",
      cell: (info) => `₹${info.getValue().toFixed(2)}`,
    }),
    columnHelper.accessor("available", {
      header: "Available",
      cell: (info) =>
        info.getValue() ? (
          <span className="text-green-600 font-semibold">Yes</span>
        ) : (
          <span className="text-red-600 font-semibold">No</span>
        ),
    }),
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) =>
        isSignedIn ? (
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            onClick={() =>
              addItem({
                id: row.original.id,
                name: row.original.name,
                price: row.original.price,
              })
            }
          >
            Add to Cart
          </button>
        ) : (
          <SignInButton mode="modal">
            <button className="bg-gray-400 text-white px-3 py-1 rounded cursor-pointer">
              Login to Add
            </button>
          </SignInButton>
        ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return <p className="p-4 text-gray-600">Loading menu...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Canteen Menu</h2>
      <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border-b border-gray-300 px-4 py-2 text-left text-sm font-semibold"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border-b border-gray-200 px-4 py-2 text-sm"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <p className="mt-4 text-gray-500">No menu items available.</p>
      )}
    </div>
  );
}
