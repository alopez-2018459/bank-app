"use server";
import dbConnect from "@/app/db/connection";
import User, { IUser } from "@/app/models/User";
import { revalidatePath } from "next/cache";

export async function deleteUser(_id: any) {
  console.log({ serverID: _id });
  try {
    dbConnect();
    const users = await User.findById(_id);

    if (!users) {
      return new Error("No user found");
    }

    const deletedUser = await User.findByIdAndDelete(_id);

    console.log({ USER_DELETED: deletedUser });

    revalidatePath("/console/Users");
  } catch (err) {
    console.log(err);
  }
}

export async function getUsers() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
    method: "GET",
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(res.statusText);

  const users: IUser[] = await res.json();

  console.log(users)

  return users;
}

export async function getUserById(_id: any) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/${_id}`, {
      method: 'GET',
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error('Something went wrong');
    }

    const users = await res.json();

    return users
  } catch (err) {
    console.log(err);
    return err;
  }
}
