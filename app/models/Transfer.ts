import { Document, Schema, model, models } from "mongoose";
import { IUser } from "./User";
import { BankAccount, IBankAccount } from "./BankAccount";

export interface ITransfer extends Document {
  amount: number;
  senderAccount: string;
  receiverAccount: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TransferSchema = new Schema<ITransfer>(
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
    senderAccount: {
      type: String,
      required: [true, "Cuenta de envío es requerida."],
    },
    receiverAccount: {
      type: String,
      required: [true, "Cuenta de destino es requerida."],
    },
    status: {
      type: Boolean,
      default: true,
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

TransferSchema.pre<ITransfer>("save", async function (next: Function) {
  try {
    const senderAccountNumber = this.senderAccount;
    const receiverAccountNumber = this.receiverAccount;
    const amount = this.amount;

    // Fetch the sender account
    const senderAccount = await BankAccount.findOne({
      accNumber: senderAccountNumber,
    });
    const receiverAccount = await BankAccount.findOne({
      accNumber: receiverAccountNumber,
    });

    // Subtract and add the transfer amount from the sender's and receiver's account balance
    if (senderAccount && receiverAccount) {
      senderAccount.balance -= amount;
      receiverAccount.balance += amount;
      senderAccount.transfers.push(this._id);
      receiverAccount.transfers.push(this._id);
      await senderAccount.save();
      await receiverAccount.save();
    } else {
      throw new Error("Sender account not found");
    }

    return next();
  } catch (error: any) {
    return next(error);
  }
});

TransferSchema.post("findOneAndDelete", async function (doc: ITransfer) {
  try {
    const senderAccountNumber = doc.senderAccount;
    const receiverAccountNumber = doc.receiverAccount;
    const amount = doc.amount;

    // Fetch the sender account
    const senderAccount = await BankAccount.findOne({
      accNumber: senderAccountNumber,
    });
    const receiverAccount = await BankAccount.findOne({
      accNumber: receiverAccountNumber,
    });

    // Revert the transfer amount from the sender's and receiver's account balance
    if (senderAccount && receiverAccount) {
      senderAccount.balance += amount;
      receiverAccount.balance -= amount;
      const transferIndex = senderAccount.transfers.indexOf(doc._id);
      if (transferIndex !== -1) {
        senderAccount.transfers.splice(transferIndex, 1);
      }
      const receiverIndex = receiverAccount.transfers.indexOf(doc._id);
      if (receiverIndex !== -1) {
        receiverAccount.transfers.splice(receiverIndex, 1);
      }
      await senderAccount.save();
      await receiverAccount.save();
    } else {
      throw new Error("Sender account not found");
    }
  } catch (error: any) {
    console.log(error);
  }
});

const Transfer =
  models.Transfer || model<ITransfer>("Transfer", TransferSchema);

export default Transfer;
