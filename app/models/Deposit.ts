import { Document, Schema, model, models } from "mongoose";
import { IUser } from "./User";
import { BankAccount, IBankAccount } from "./BankAccount";

export interface IDeposit extends Document {
  amount: number;
  account: string;
  status: Boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DepositSchema = new Schema<IDeposit>(
  {
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: function (value: number) {
          return value <= 10000;
        },
        message: "El monto máximo permitido es de 10000.",
      },
    },
    account: {
      type: String,
      required: [true, "Cuenta es requerida."],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

DepositSchema.pre<IDeposit>("save", async function (next: Function) {
  try {
    const accountNumber = this.account;
    const amount = this.amount;

    // Fetch the account
    const account = await BankAccount.findOne({ accNumber: accountNumber });

    // Add the deposit amount to the account balance
    if (account) {
      account.balance += amount;
      account.deposits.push(this._id); // Add the deposit to the deposits array
      await account.save();
    } else {
      throw new Error("Account not found");
    }

    return next();
  } catch (error: any) {
    return next(error);
  }
});

DepositSchema.post("findOneAndDelete", async function (doc: IDeposit) {
  try {
    const accountNumber = doc.account;
    const amount = doc.amount;

    // Fetch the account
    const account = await BankAccount.findOne({ accNumber: accountNumber });

    // Revert the deposit amount from the account balance
    if (account) {
      account.balance -= amount;
      await account.save();
    } else {
      throw new Error("Account not found");
    }
  } catch (error: any) {
    console.log(error);
  }
});

const Deposit = models.Deposit || model<IDeposit>("Deposit", DepositSchema);

export default Deposit;
