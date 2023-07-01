import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/app/db/connection";
import AccountType, { IAccountType } from "@/app/models/AccountType";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

dbConnect();

export async function GET(request: NextRequest) {
  try {
    // Get all account types with related data
    const accountTypes = await AccountType.find();
    const data = accountTypes;

    if (accountTypes.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "No Account Types Yet" }),
        {
          status: 200,
        }
      );
    }

    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse(JSON.stringify(err), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body as JSON
    const json = await request.json();
    console.log({ DataRequest: json });

    // Validate the request body
    const { name, description } = json;

    if (!name || !description) {
      return new NextResponse(
        JSON.stringify({ message: "Name and description are required" }),
        {
          status: 400,
        }
      );
    }

    const accountTypeExists = await AccountType.findOne({ name });

    if(accountTypeExists) {
      return new NextResponse(
        JSON.stringify({ message: "Account Type already exists" }),
        {
          status: 400,
        }
      );
    }

    // Create a new account type object with the parsed data
    const newAccountType: IAccountType = new AccountType({
      name,
      description,
    });
    console.log({ AccountTypeCreated: newAccountType });

    // Save the account type object to the database
    const savedAccountType = await newAccountType.save();

    revalidatePath('/console/AccountType')
    // Return a NextResponse object with the saved account type data and a 200 status code
    return new NextResponse(JSON.stringify(savedAccountType), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.log({ err });

    // If there is any other error, return a NextResponse object with an error message and a 500 status code
    const error = {
      message: "Error saving account type.",
      error: err,
    };
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
}
