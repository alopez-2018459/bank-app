import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/app/db/connection";
import User, { IUser } from "@/app/models/User";
import { getServerSession } from "next-auth";
import AccountType from "@/app/models/AccountType";
import { revalidateTag } from "next/cache";
import { authOptions } from "../../auth/[...nextauth]/route";

dbConnect();

interface Params extends Request {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, params: Params) {
  const id = params.params.id;

  try {
    const user = await User.findById(id);

    // Validate if the transfer was not found
    if (!user) {
      return new NextResponse("User not found", {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(user), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
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

    // Validate if the request body is empty
    if (Object.keys(data).length === 0) {
      return new NextResponse("Empty request body", {
        status: 400,
      });
    }

    // Verificar si el nombre de usuario, el DPI o el email ya existen en otro usuario
    const existingUser = await User.findOne({
      $or: [
        { username: data.username },
        { dpi: data.dpi },
        { email: data.email },
      ],
    });

    // Obtener el usuario actual
    const user = await User.findById(id);

    // Verificar si el nombre de usuario ya existe
    if (existingUser && existingUser.username !== user.username) {
      return new NextResponse("Username already exists", {
        status: 400,
      });
    }

    // Verificar si el DPI ya existe
    if (existingUser && existingUser.dpi !== user.dpi) {
      return new NextResponse("DPI already exists", {
        status: 400,
      });
    }

    // Verificar si el email ya existe
    if (existingUser && existingUser.email !== user.email) {
      return new NextResponse("Email already exists", {
        status: 400,
      });
    }

    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
    });

    // Validate if the user is not found
    if (!updatedUser) {
      return new NextResponse("User not found", {
        status: 404,
      });
    }

    const tag = request.nextUrl.searchParams.get("User");
    revalidateTag(tag as string);

    return new NextResponse(JSON.stringify(updatedUser), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new NextResponse(JSON.stringify(err), {
      status: 500,
    });
  }
}
