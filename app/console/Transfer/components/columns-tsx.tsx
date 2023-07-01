"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BsTrash2, BsClipboardPlus } from "react-icons/bs";
import { HiOutlinePencil } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ITransfer } from "@/app/models/Transfer";

export const columns: ColumnDef<ITransfer>[] = [
  {
    accessorKey: "_id",
    header: "ID",
  },
  {
    accessorKey: "senderAccount",
    header: "Sender Account",
  },
  {
    accessorKey: "receiverAccount",
    header: "Reciever Account",
  },
  {
    accessorKey: "amount",
    header: "Transfer Amount",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell: { row } }) => {
      const transfer = row.original;

      const date = new Date(transfer.createdAt);

      const hour = date.getHours();
      const minu = date.getMinutes();
      const ampm = hour >= 12 ? "pm" : "am";

      const formatedTime = `${hour % 12 || 12}:${minu
        .toString()
        .padStart(2, "0")} ${ampm}`;

      const formatedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);

      const newDate = `${formatedDate} ${formatedTime}`;

      return <div className="font-medium text-center">{newDate}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Updated at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell: { row } }) => {
      const date = new Date(row.original.updatedAt);

      const hour = date.getHours();
      const minu = date.getMinutes();
      const ampm = hour >= 12 ? "pm" : "am";

      const formatedTime = `${hour % 12 || 12}:${minu
        .toString()
        .padStart(2, "0")} ${ampm}`;

      const formatedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);

      const newDate = `${formatedDate} ${formatedTime}`;

      return <div className="font-medium text-center">{newDate}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transfer = row.original;
      const router = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuSeparator />
            <DropdownMenuLabel className=" font-bold">
              ACTIONS
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(transfer._id)}
            >
              <BsClipboardPlus className="mr-2" /> Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(transfer.senderAccount)}
            >
              <BsClipboardPlus className="mr-2" /> Copy Sender Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(transfer.receiverAccount)}
            >
              <BsClipboardPlus className="mr-2" /> Copy Receiver Account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
