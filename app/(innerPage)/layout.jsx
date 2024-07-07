import React from "react";
import Navbar from "./(components)/Navbar";
import LeftSidebar from "./(components)/LeftSidebar";
import  { Toaster } from 'react-hot-toast';

const layout = ({ children }) => {
  return (
    <div className="min-h-screen w-full h-full bg-[#f5f6fa] ">
      <div className="flex">
        <div className="w-72 max-md:hidden border-t border-r">
            <LeftSidebar />
        </div>
        <div className="flex-grow w-full h-full border-l min-h-screen border-t">
          <Navbar />
          <div className="w-full h-full p-3">{children}</div>
        </div>
      </div>
      <Toaster position="top-right"
  reverseOrder={false} />
    </div>
  );
};

export default layout;
