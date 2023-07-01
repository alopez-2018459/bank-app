"use server"
import { IDeposit } from "@/app/models/Deposit";
import { revalidatePath } from "next/cache";

export async function deleteDeposit(_id: any) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/deposit/${_id}`, {
      method: 'DELETE',
      cache: 'no-store',
    });

    console.log({RES: res})

    if (!res.ok) {
      throw new Error('Something went wrong');
    }

    revalidatePath("/console/Deposit");
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function getDeposits() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/deposit`, {
    method: "GET",
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(res.statusText);

  const deposits: IDeposit[] = await res.json();

  console.log(deposits)

  return deposits;
}

export async function getDepositById(_id: any) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/deposit/${_id}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Something went wrong');
    }

    const deposit = await res.json();

    return deposit.createdAt;
  } catch (err) {
    console.log(err);
    return err;
  }
}