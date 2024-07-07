import { BadgePlus, FilePlus } from "lucide-react";
import Link from "next/link";
import React from "react";

const Dashboard = () => {
  return (
    <div className="w-full grid grid-cols-12 p-3 gap-3">
      <Link
        href={"/challenges/add-challenge"}
        className="flex justify-between items-center group lg:col-span-3 md:col-span-6 col-span-12 bg-[#845EC2] p-3 rounded-md min-h-40 shadow-custom"
      >
        <p className="text-white font-semibold text-lg">Add Test</p>
        <p className="group-hover:scale-110 duration-700 transition-all ease-in-out ">
          <FilePlus size={80} color={"#624590"} />
        </p>
      </Link>
      <Link
        href={"/challenges/add-task"}
        className="flex justify-between items-center group lg:col-span-3 md:col-span-6 col-span-12 bg-[#ff0000] p-3 rounded-md min-h-40 shadow-custom"
      >
        <p className="text-white font-semibold text-lg">Add Task</p>
        <p className="group-hover:scale-110 duration-700 transition-all ease-in-out ">
          <BadgePlus size={80} color={"#d90000"} />
        </p>
      </Link>
    </div>
  );
};

export default Dashboard;
