"use client";

import React from "react";
import { AiOutlineUser, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import Link from "next/link";
interface Prop {
  _id: any;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setId: React.Dispatch<React.SetStateAction<string>>;
}

const TableRow: React.FC<Prop> = ({
  _id,
  name,
  description,
  createdAt,
  updatedAt,
  setIsOpen,
  setId,
}) => {
  const handleClick = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setId(_id)
    setIsOpen(true)
  }
  return (
    <>

      <tr className="hover:bg-gray-100">
        <th className="flex gap-3 px-5 py-4 font-normal text-gray-900">
          <AiOutlineUser className="w-8 h-8" />
          <div className="flex items-center font-medium text-md text-gray-700">
            {name}
          </div>
        </th>
        <td className="px-6 py-4">{description}</td>
        <td className="px-6 py-4">{createdAt.toString()}</td>
        <td className="px-6 py-4">{updatedAt.toString()}</td>
        <td className="px-6 py-4 w-10">
          <div className="flex justify-evenly gap-4">
            <Link
              href={`/console/AccountType/Edit/${_id}`}
              className="flex justify-center items-center w-10 h-10 hover:text-blue-500"
            >
              <AiOutlineEdit className="w-6 h-6 transition duration-700 hover:w-7 hover:h-7" />
            </Link>
            <button
              className="flex justify-center items-center w-10 h-10 hover:text-red-500 "
              onClick={(e) => handleClick(e)}
            > 
              <AiOutlineDelete className="w-6 h-6 transition duration-700 hover:w-7 hover:h-7" />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};

export default TableRow;
