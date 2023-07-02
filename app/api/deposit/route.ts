import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/app/db/connection";
import Deposit from "@/app/models/Deposit";
import { BankAccount } from "@/app/models/BankAccount";

dbConnect();

export async function POST(request: NextRequest) {
  try {
    // Parsear el cuerpo de la solicitud como JSON
    const json = await request.json();
    console.log({ DataRequest: json });

    const accountExist = await BankAccount.findOne({ accNumber: json.account });
    console.log({ACCOUNT_EXIST: accountExist})

    if (!accountExist) {
      return new NextResponse(JSON.stringify({ message: "El número de cuenta no existe" }), {
        status: 404,
      });
    }

    if(json.amount > 10000){
      return new NextResponse(JSON.stringify({ message: "El monto máximo es de 10000" }), {
        status: 404,
      });
    }

    if(json.amount <= 0){
      return new NextResponse(JSON.stringify({ message: "El monto debe ser mayor a 0" }), {
        status: 404,
      });
    }

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
