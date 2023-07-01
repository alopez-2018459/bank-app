"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ProfileForm from "./DepositForm";
import { useRouter } from "next/navigation";

const NewModal = () => {
  const router = useRouter();

  return (
    <Sheet
      defaultOpen={true}
      onOpenChange={() => router.push("/console/Deposit")}
    >
      <SheetContent className="">
        <SheetHeader>
          <SheetTitle className="text-violet-700">Add new deposit</SheetTitle>
          <SheetDescription>
            This action will add a deposit to the system.
          </SheetDescription>
        </SheetHeader>
        <ProfileForm />
      </SheetContent>
    </Sheet>
  );
};

export default NewModal;
