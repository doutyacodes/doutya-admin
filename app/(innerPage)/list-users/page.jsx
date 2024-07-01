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
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { userValidation } from "@/constants/validationData";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ListUser() {
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  const [zero, setZero] = useState(0);
  const [next, setNext] = useState(25);
  const [sortBy, setSortBy] = useState("id DESC");
  const [userName, setUserName] = useState("");
  const form = useForm({
    resolver: zodResolver(userValidation),
    defaultValues: {
      name: userName,
      back: zero,
      next: next,
      sort: sortBy,
    },
  });
  const fetchData = async (searchParams = {}) => {
    setIsLoading(true);
    const { name, zero, next, sort } = searchParams;

    try {
      
      const response = await axios.get(
        `${baseURL}/get-all-users.php`, {
          params: { name, zero, next, sort }
        }
      );
      // console.log(searchParams)
      // console.log(response.data)
      setUserData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData({ name: userName, zero, next, sort: sortBy });
  }, [zero, userName, next, sortBy]);
  

  const handleNext = () => {
    setZero((prevZero) => prevZero + next);
  };

  const handlePrevious = () => {
    setZero((prevZero) => (prevZero - next >= 0 ? prevZero - next : 0));
  };
  const onSubmit = (values) => {
    fetchData(values);
    // console.log(values);
  };
  
  const onCancel = async () => {
    form.reset();
     setShowSearch(false);
  };
  return (
    <div className="w-full bg-white rounded-md border p-3">
      <Card className="p-3">
        <div className="w-full flex justify-end items-end">
          <Button
            onClick={() => setShowSearch(true)}
            className="bg-blue-500 hover:bg-blue-600 flex gap-1 items-center"
          >
            <Search size={17} />
            <p>Search</p>
          </Button>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn(
              "grid grid-cols-12 w-full gap-3",
              !showSearch && "hidden"
            )}
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-6 py-2">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="back"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-6 py-2">
                  <FormLabel>Limit From</FormLabel>
                  <FormControl>
                    <Input min={0} type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="next"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-6 py-2">
                  <FormLabel>Limit To</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="25" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                name="sort"
                render={({ field }) => (
                  <FormItem className="md:col-span-6 col-span-12 py-2">
                    <FormLabel>Sort By</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="id DESC">ID Descending</SelectItem>
                        <SelectItem value="id ASC">ID Ascending</SelectItem>
                        <SelectItem value="name DESC">Name Descending</SelectItem>
                        <SelectItem value="name ASC">Name Ascending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <div className="col-span-12 grid-cols-12 grid gap-3">
              <Button
                className="md:col-span-2 col-span-5 w-full"
                variant="destructive"
                type="button"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                className="md:col-span-2 col-span-5 w-full"
                disabled={isLoading}
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </Card>
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="rounded-md border mt-2">
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
                {userData?.data?.length > 0 &&
                  userData?.data?.map((item) => {
                    return (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {item.name}
                        </TableCell>
                        <TableCell>{item.username}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {item.mobile}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {item.dob}
                        </TableCell>
                        <TableCell>{item.gender}</TableCell>
                        <TableCell>{item.education}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">{`${
              zero + 1
            } - ${zero + userData?.data?.length} of ${
              userData?.count ? userData?.count : 0
            }`}</div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={zero === 0}
              >
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={handleNext}>
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
