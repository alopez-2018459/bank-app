"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { depositFResolver, depositFType } from "./depositFSchema";

export default function DepositForm() {
  const router = useRouter();

  const { toast } = useToast();

  const [error, setError] = useState<boolean>(false);

  const form = useForm<depositFType>({
    resolver: depositFResolver,
    defaultValues: {
      amount: "0",
      account: ""
    },
  });

 async function onSubmit(values: depositFType) {
    console.log(values);

     const res = await fetch("/api/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.status === 404) {
      setError(true);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        variant: "destructive",
      });
      return;
    }

    const obj = await res.json();

    if (!res.ok) {
      setError(true);
      toast({
        title: "Uh oh! Something went wrong",
        description: obj.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Deposit saved",
      description: "Your deposit has been saved.",
    });

    router.replace("/console/Deposit");
    router.refresh(); 
    return
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-violet-800 font-semibold">
                Amount
              </FormLabel>
              <FormControl>
                <Input placeholder="Amount" {...field} />
              </FormControl>
              <FormDescription>
                This is the deposit amount.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="account"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-violet-800 font-semibold">
                Receiver Account
              </FormLabel>
              <FormControl>
                <Input placeholder="Receiver Account" {...field} />
              </FormControl>
              <FormDescription>This is the receiver Account.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-violet-200 text-violet-700 hover:bg-violet-700 hover:text-white"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
