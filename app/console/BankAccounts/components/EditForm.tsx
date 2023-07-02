"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { bankAccFResolver, bankAccFType } from "./bankAccountFSchema";
import { getAccountById } from "../../AccountType/action";
import { AiOutlineSearch } from "react-icons/ai";

type Props = {
  defaultValues: { [key: string]: string | undefined };
};

export default function BankAccountEdit(defaultValues: Props) {
  const params = useSearchParams();

  const router = useRouter();

  const { toast } = useToast();

  const bankAccount = defaultValues;

  const [error, setError] = useState<boolean>(false);
  const [accountType, setAccountType] = useState("");

  const id = params.get("edit");

  if (!id) return null;

  const form = useForm<bankAccFType>({
    resolver: bankAccFResolver,
    defaultValues: {
      //@ts-expect-error
      client: {_id: bankAccount.defaultValues.client?._id},
      currency: bankAccount.defaultValues.currency,
      balance: bankAccount.defaultValues.balance?.toString(),
      //@ts-expect-error
      accountType: {_id: bankAccount.defaultValues.accountType?._id},
    },
  });

  const searchAccountType = async(id: string) =>{
    console.log({ID: id })
    const account = await getAccountById(id)
    console.log({ACCOUNT: account} )
  }

  const onSubmit = async (values: bankAccFType) => {
    console.log(values);
    const res = await fetch(`/api/bankAccount/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
      cache: "no-store",
    });

    const obj = await res.json();

    console.log(res);

    if (!res.ok) {
      toast({
        title: "Uh oh! Something went wrong",
        description: obj.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Bank Account update",
      description: "Your Bank Account has been updated.",
    });

    router.replace("/console/BankAccounts");
    router.refresh();
  };

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="w-full flex items-center gap-4">
        <FormField
            control={form.control}
            name="accountType._id"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-violet-800 font-semibold">
                  Account Type
                </FormLabel>
                <FormControl>
                  <Input placeholder="Account Type" {...field} />
                </FormControl>
                <FormDescription>This is the Account Type.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="client._id"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-violet-800 font-semibold">
                  Client
                </FormLabel>
                <FormControl>
                  <Input placeholder="Client" {...field}/>
                </FormControl>
                <FormDescription>
                  This is the owner user.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full flex items-center gap-4">
          <div className="flex w-full">
            <Input
              onChange={(e)=>setAccountType(e.target.value)}
              placeholder="Search AccountType..."
              className=" bg-violet-100 text-violet-700 transition-all rounded-r-none focus-visible:ring-violet-700 focus-visible:ring-offset-0 "
            />
            <button onClick={(e)=>searchAccountType(accountType)} className="bg-violet-700 text-white flex items-center rounded-r-lg px-2">
              <AiOutlineSearch className="w-4 h-4"/>
            </button>
          </div>
          <div className="flex w-full">
            <Input
              placeholder="Search Client..."
              className=" bg-violet-100 text-violet-700 transition-all rounded-r-none focus-visible:ring-violet-700 focus-visible:ring-offset-0 "
            />
            <button className="bg-violet-700 text-white flex items-center rounded-r-lg px-2">
              <AiOutlineSearch className="w-4 h-4"/>
            </button>
          </div>
        </div>

        <div className="w-full flex items-center gap-4">
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-violet-800 font-semibold">
                  Currency
                </FormLabel>
                <FormControl>
                  <Input placeholder="Currency" {...field} />
                </FormControl>
                <FormDescription>This is the currency.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="balance"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-violet-800 font-semibold">
                  Balance
                </FormLabel>
                <FormControl>
                  <Input placeholder="Balance" {...field} />
                </FormControl>
                <FormDescription>This is the account balance.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
          <Button
            type="submit"
            className="bg-violet-200 text-violet-700 hover:bg-violet-700 hover:text-white max-w-lg w-full"
          >
            Submit
          </Button>
      </form>
    </Form>
  );
}
