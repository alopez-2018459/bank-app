import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/app/db/connection";
import Deposit from "@/app/models/Deposit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidateTag } from "next/cache";


dbConnect();

interface Params extends Request {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, params: Params) {
  const id = params.params.id;

  try {
    const session = await getServerSession(authOptions);
    // Verify if the user is authenticated and is an admin
    /*if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }*/

    const deposit = await Deposit.findById(id);

    // Validate if the account type is not found
    if (!deposit) {
      return new NextResponse("Deposit not found", {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(deposit), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new NextResponse(JSON.stringify(err), {
      status: 500,
    });
  }
}

export async function PUT(request: NextRequest, params: Params) {
  const id = params.params.id;
  const data = await request.json();

  try {
    const session = await getServerSession(authOptions);
    // Verify if the user is authenticated and is an admin
    /*if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }*/

    // Validate if the request body is empty
    if (Object.keys(data).length === 0) {
      return new NextResponse("Empty request body", {
        status: 400,
      });
    }

    const deposit = await Deposit.findByIdAndUpdate(id, data, {
      new: true,
    });

    // Validate if the account type is not found
    if (!deposit) {
      return new NextResponse("Deposit not found", {
        status: 404,
      });
    }

    const tag = request.nextUrl.searchParams.get('Deposit')
    revalidateTag(tag as string)

    return new NextResponse(JSON.stringify(deposit), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new NextResponse(JSON.stringify(err), {
      status: 500,
    });
  }
}

export async function DELETE(request: Request, params: Params) {
  const id = params.params.id;

  try {
    const session = await getServerSession(authOptions);
    // Verify if the user is authenticated and is an admin
    /*if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }*/

    const deposit = await Deposit.findByIdAndDelete(id);

    // Validate if the account type is not found
    if (!deposit) {
      return new NextResponse("Deposit not found", {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(deposit), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new NextResponse(JSON.stringify(err), {
      status: 500,
    });
  }
}