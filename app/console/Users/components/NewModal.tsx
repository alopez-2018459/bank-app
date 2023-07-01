"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import UserForm from "./UserForm";
import { useRouter } from "next/navigation";

const NewModal = () => {
  const router = useRouter();

  return (
    <Sheet
      defaultOpen={true}
      onOpenChange={() => router.push("/console/Users")}
    >
      <SheetContent side={'bottom'} className="overflow-y-auto h-full">
        <SheetHeader>
          <SheetTitle className="text-violet-700">Add new user</SheetTitle>
          <SheetDescription>
            This action will add a user to the system.
          </SheetDescription>
        </SheetHeader>
        <UserForm />
      </SheetContent>
    </Sheet>
  );
};

export default NewModal;
