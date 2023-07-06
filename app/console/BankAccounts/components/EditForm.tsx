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
  const [client, setClient] = useState("");

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

  async function searchAccountType(accountType: string){
    const res = await fetch(`/api/accountTypeName/${accountType}`, {
      method: "GET",
      cache: 'no-store',
    });

    if (res.status === 404) {
      setError(true);
      toast({
        title: "Account Type",
        description: "El tipo de cuenta ingresado no existe",
        variant: "destructive",
      });
      return "Account Type not found";
    }
  
    const acc = await res.json();

    return acc
  }

  async function searchClient(client: string){
    const res = await fetch(`/api/username/${client}`, {
      method: "GET",
      cache: 'no-store',
    });
  
    if (res.status === 404) {
      setError(true);
      toast({
        title: "Client",
        description: "El cliente ingresado no existe",
        variant: "destructive",
      });
      return "User not found";
    }
  
    const user = await res.json();

    return user
  }

  const onSubmit = async (values: bankAccFType) => {
    
    const client = await searchClient(values.client._id)
    const accountType= await  searchAccountType(values.accountType._id)

    if(client == "User not found" || accountType == "Account Type not found"){
      return;
    }

    values.client._id = client._id
    values.accountType._id = accountType._id

    const res = await fetch(`/api/bankAccount/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
      cache: "no-store",
    });

    const obj = await res.json();

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
                    <div className="flex w-full">
                      <Input
                        placeholder="Account Type" {...field}
                      />
                    </div>
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
                    <div className="flex w-full">
                      <Input
                        placeholder="Client" {...field}
                      />
                    </div>
                    </FormControl>
                    <FormDescription>
                      This is the owner user.
                    </FormDescription>
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
