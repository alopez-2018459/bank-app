"use client";

import React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { revalidatePath } from "next/cache";

type Props = {};

const Delete = (props: Props) => {
  const params = useSearchParams();

  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const id = params.get("delete");

  console.log(params.get("delete"));

  if (!id) return null;

  const deleteDeposit = async (_id: any) =>{
    try {
      const res = await fetch(`/api/deposit/${_id}`, {
        method: 'DELETE',
        cache: 'no-store',
      });
  
      console.log({RES: res})
      return res
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-violet-700 font-bold">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            deposit and remove the data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => router.push("/console/Deposit")}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-violet-200 text-violet-600 hover:bg-red-700 hover:text-white"
            onClick={async() =>{
                const status:any = await deleteDeposit(id)
                if (status.status == 400) {
                  toast({
                    title: "Uh oh! Something went wrong",
                    description: "Cannot delete a Deposit after 1 minute",
                    variant: "destructive"
                  });
                }else{
                  toast({
                    title: "Deleted",
                    description: "Deposit has been succesfully deleted"
                  });
                }

                router.replace("/console/Deposit");
                router.refresh();
            }
            }
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Delete;
