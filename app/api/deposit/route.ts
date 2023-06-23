import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/app/db/connection";
import { getServerSession } from "next-auth";
import Deposit from "@/app/models/Deposit";
import User from "@/app/models/User";
import { authOptions } from "../auth/[...nextauth]/route";

dbConnect();

export async function POST(request: NextRequest) {
  try {
    // Parsear el cuerpo de la solicitud como JSON
    const json = await request.json();
    console.log({ DataRequest: json });

    // Crear un nuevo objeto de cuenta bancaria con los datos parseados
    const deposit = new Deposit(json);
    console.log({ DepositCreated: deposit });

    // Guardar el objeto de cuenta bancaria en la base de datos
    const savedDeposit = await deposit.save();

    // Devolver un objeto NextResponse con los datos de la cuenta bancaria guardada y un código de estado 200
    return new NextResponse(JSON.stringify(savedDeposit), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.log({ err });

    // Si hay algún otro error, devolver un objeto NextResponse con un mensaje de error y un código de estado 500
    const error = {
      message: "Error al ejecutar la transferencia.",
      error: err,
    };
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    //const session = await getServerSession(authOptions);
    // Verify if the user is authenticated and is an admin
    /*if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }*/

    // Get all account types with related data
    const deposit = await Deposit.find();
    const data = deposit;

    if (deposit.length === 0) {
      return new NextResponse(JSON.stringify({ message: "No Deposits Yet" }), {
        status: 200,
      });
    }

    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse(JSON.stringify(err), { status: 500 });
  }
}
