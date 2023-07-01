"use server";
import dbConnect from "@/app/db/connection";
import AccountType, { IAccountType } from "@/app/models/AccountType";
import { revalidatePath } from "next/cache";

export async function deleteAccountType(_id: any) {
  console.log({ serverID: _id });
  try {
    dbConnect();
    const account = await AccountType.findById(_id);

    if (!account) {
      return new Error("No user found");
    }

    const deletedUser = await AccountType.findByIdAndDelete(_id);

    console.log({ ACCOUNT_TYPE_DELETED: deletedUser });

    revalidatePath("/console/AccountType");
  } catch (err) {
    console.log(err);
  }
}

export async function getAccountTypes() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/accountType`, {
    method: "GET",
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(res.statusText);

  const accounts: IAccountType[] = await res.json();


  return accounts;
}

export async function getAccountById(_id: any) {
  try {
    // Change to enviroment url for production
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/accountType/${_id}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      return null
    }

    const account = await res.json();
    console.log({ACCOUNT: account})
    return account._id

  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function getBankAccountById(_id: any) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/accountType/${_id}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      return null
    }

    const account = await res.json();
    
    return account

  } catch (err) {
    console.log(err);
    return err;
  }
}
