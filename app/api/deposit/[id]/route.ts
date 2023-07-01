import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/app/db/connection";
import Deposit from "@/app/models/Deposit";

dbConnect();

interface Params extends Request {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, params: Params) {
  const id = params.params.id;

  try {
    const deposit = await Deposit.findById(id);

    // Validate if the transfer was not found
    if (!deposit) {
      return new NextResponse("Deposit not found", {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(deposit), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new NextResponse(JSON.stringify(err), {
      status: 500,
    });
  }
}

export async function DELETE(request: Request, params: Params) {
  const id = params.params.id;

  try {
    const deposit = await Deposit.findById(id);

    // Validate if the transfer was not found
    if (!deposit) {
      return new NextResponse("Deposit not found", {
        status: 404,
      });
    }

    // Calculate the time difference in milliseconds
    const currentTime = new Date();
    const createdAt = deposit.createdAt;
    const timeDifference = currentTime.getTime() - createdAt.getTime();

    console.log({TIME_DIF: timeDifference})

    // Check if the time difference is greater than 1 minute (60000 milliseconds)
    if (timeDifference > 60000) {
      return new NextResponse(JSON.stringify({message: "Cannot delete deposit after 1 minute"}), {
        status: 400,
      });
    }

    console.log({ERROR_NO_DEJA_PASAR: "LAKSJDASKD"})

    // Delete the transfer
    const deletedDeposit = await Deposit.findByIdAndDelete(id);

    return new NextResponse(JSON.stringify(deletedDeposit), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new NextResponse(JSON.stringify(err), {
      status: 500,
    });
  }
}
