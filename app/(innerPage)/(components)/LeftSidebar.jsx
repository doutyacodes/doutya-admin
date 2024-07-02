"use client"
import { cn } from "@/lib/utils";
import { LayoutDashboard, Triangle, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const LeftSidebar = () => {
      const pathname = usePathname();

  const routes = [
    {
      id: 1,
      path: "/dashboard",
      icon: <LayoutDashboard />,
      name: "Dashboard",
    },
    {
      id: 2,
      path: "/list-users",
      icon: <User />,
      name: "List Users",
    },
    {
      id: 3,
      path: "/list-quiz",
      icon: <Triangle />,
      name: "List Quiz",
    },
  ];
  return (
    <div className=" h-full min-h-screen flex flex-col items-center  bg-white w-full">
      <div className="w-full  flex justify-center items-center pb-5 border-b">
        <Image
          src={"/assets/images/doutya4.png"}
          alt="Logo"
          width={120}
          height={80}
        />
      </div>
      <div className="w-full h-full space-y-4 p-3">
        {routes.length > 0 &&
          routes.map((route) => (
            <Link href={route.path}
              className={cn("w-full flex gap-3  p-2 items-center",pathname.includes(route.path) ? "bg-[#4880ff] text-white rounded-md" : ""
              )}
              key={route.id}
            >
              <>
                {route.icon}
                <span className="font-semibold text-sm">{route.name}</span>
              </>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default LeftSidebar;
