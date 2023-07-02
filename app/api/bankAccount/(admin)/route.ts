import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/app/db/connection";
import { BankAccount } from "@/app/models/BankAccount";
import User from "@/app/models/User";
import AccountType from "@/app/models/AccountType";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Buy from "@/app/models/Buy";
import Deposit from "@/app/models/Deposit";
import Transfer from "@/app/models/Transfer";

dbConnect();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const users = await User.find();
    const accountTypes = await AccountType.find();
    const buys = await Buy.find();
    const deposits = await Deposit.find();
    const transfer = await Transfer.find();

    // Retrieve all bank accounts
    const bankAccounts = await BankAccount.find()
      .populate("client", "name username email dpi address phone work")
      .populate("accountType", "name description")
      .populate("buys", "amount recipient description")
      .populate("deposits", "amount")
      .populate("transfers", "amount senderAccount receiverAccount");

    const data = bankAccounts;
    if (bankAccounts.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "No bank accounts registered" }),
        { status: 200 }
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

    if (json.client._id == "" || json.accountType._id == "") {
      return new NextResponse(
        JSON.stringify({ message: "Account Type and Client are required" }),
        { status: 400 }
      );
    }

    // Create a new bank account object with the parsed data
    const bankAccount = new BankAccount(json);
    console.log({ BankAccountCreated: bankAccount });

    // Save the bank account object to the database
    const savedBankAccount = await bankAccount.save();

    // Return a NextResponse object with the saved bank account data and a status code of 200
    return new NextResponse(JSON.stringify(savedBankAccount), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.log({ err });

    // If there is any other error, return a NextResponse object with an error message and a status code of 500
    const error = {
      message: "Error saving the bank account.",
      error: err,
    };
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
}
