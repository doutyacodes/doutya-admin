import { LogOut, Tally3 } from "lucide-react";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import LeftSidebar from "./LeftSidebar";

const Navbar = () => {
  return (
    <div className="w-full  shadow-md p-3 bg-white flex justify-between">
      <div className="">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger>
              <Tally3 className="rotate-90" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SheetHeader>
                <LeftSidebar />
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="">
        <LogOut />
      </div>
    </div>
  );
};

export default Navbar;
