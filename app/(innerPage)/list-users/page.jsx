"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { baseURL } from "@/lib/features/baseData";
import axios from "axios";
import { useEffect, useState } from "react";
import LoadingSkeleton from "../(components)/LoadingScreen";

export default function ListUser() {
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [zero, setZero] = useState(0);
  const [next, setNext] = useState(25);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseURL}/get-all-users.php?zero=${zero}&next=${next}`);
      setUserData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [zero]);

  const handleNext = () => {
    setZero((prevZero) => prevZero + next);
  };

  const handlePrevious = () => {
    setZero((prevZero) => (prevZero - next >= 0 ? prevZero - next : 0));
  };

  return (
    <div className="w-full bg-white rounded-md border p-3">
      {
        isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>DOB</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Education</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    userData?.data.length > 0 && userData?.data.map((item) => {
                      return (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell  className="whitespace-nowrap">{item.name}</TableCell>
                          <TableCell>{item.username}</TableCell>
                          <TableCell  className="whitespace-nowrap">{item.mobile}</TableCell>
                          <TableCell className="whitespace-nowrap">{item.dob}</TableCell>
                          <TableCell>{item.gender}</TableCell>
                          <TableCell>{item.education}</TableCell>
                        </TableRow>
                      );
                    })
                  }
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">{`${zero + 1} - ${zero + userData.data.length} of ${userData?.count? userData?.count : 0}`}</div>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={handlePrevious} disabled={zero === 0}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={handleNext}>
                  Next
                </Button>
              </div>
            </div>
          </>
        )
      }
    </div>
  );
}
