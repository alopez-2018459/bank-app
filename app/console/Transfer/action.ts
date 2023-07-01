"use server"
import { ITransfer } from "@/app/models/Transfer";
import { revalidatePath } from "next/cache";

export async function deleteTransfer(_id: any) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/transfer/${_id}`, {
      method: 'DELETE',
      next: { revalidate: 100 },
    });

    if (!res.ok) {
      throw new Error('Something went wrong');
    }

    revalidatePath("/console/Transfer");
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function getTransfers() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/transfer`, {
    method: "GET",
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(res.statusText);

  const transfers: ITransfer[] = await res.json();

  console.log(transfers)

  return transfers;
}

export async function getTransferById(_id: any) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/transfer/${_id}`, {
      method: 'GET',
      next: { revalidate: 100 },
    });

    if (!res.ok) {
      throw new Error('Something went wrong');
    }

    const transfer = await res.json();

    return transfer
  } catch (err) {
    console.log(err);
    return err;
  }
}
