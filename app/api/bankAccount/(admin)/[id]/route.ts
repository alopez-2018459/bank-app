import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/app/db/connection";
import { BankAccount } from "@/app/models/BankAccount";
import User from "@/app/models/User";
import AccountType from "@/app/models/AccountType";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

dbConnect();

interface params extends Request {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, params: params) {
  const id = params.params.id;

  try {

    const users = await User.find();
    const accountType = await AccountType.find();

    const bankAccount = await BankAccount.findById(id)
      .populate("client", "name username email dpi address phone work")
      .populate("accountType", "name description");

    // Validate if the bank account was not found
    if (!bankAccount) {
      return new NextResponse(JSON.stringify({ message: "Account not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(bankAccount), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new NextResponse(JSON.stringify(err), {
      status: 500,
    });
  }
}

export async function PUT(request: Request, params: params) {
  const id = params.params.id;
  const data = await request.json();

  try {
    const session = await getServerSession(authOptions);
    // Verify if the user is authenticated and is an admin
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const bankAccount = await BankAccount.findByIdAndUpdate(id, data, {
      new: true,
    });

    // Validate if the bank account was not found
    if (!bankAccount) {
      return new NextResponse(JSON.stringify({ message: "Account not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(bankAccount), {
      status: 200,
    });
  } catch (err) {
    console.log(err);

    return new NextResponse(JSON.stringify(err), {
      status: 500,
    });
  }
}

export async function DELETE(request: Request, params: params) {
  const id = params.params.id;

  try {
    const session = await getServerSession(authOptions);
    // Verify if the user is authenticated and is an admin
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const bankAccount = await BankAccount.findByIdAndDelete(id);

    // Validate if the bank account was not found
    if (!bankAccount) {
      return new NextResponse(JSON.stringify({ message: "Account not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(bankAccount), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new NextResponse(JSON.stringify(err), {
      status: 500,
    });
  }
}
