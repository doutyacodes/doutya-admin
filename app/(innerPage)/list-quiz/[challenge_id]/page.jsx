"use client";
import { baseURL, capitalizeFirstLetter } from "@/lib/features/baseData";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import LoadingSkeleton from "../../(components)/LoadingScreen";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
import { taskValidation, userValidation } from "@/constants/validationData";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const ChallengeOne = () => {
  const [challengeData, setChallengeData] = useState([]);
  const [taskId, setTaskId] = useState(null);
  const params = useParams();
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [zero, setZero] = useState(0);
  const [next, setNext] = useState(25);
  const [sortBy, setSortBy] = useState("marks DESC");
  const [userName, setUserName] = useState("");

  const form = useForm({
    resolver: zodResolver(taskValidation),
    defaultValues: {
      back: zero,
      next: next,
      sort: sortBy,
      task_id: "",
    },
  });

  const fetchData = async (searchParams = {}) => {
    if (taskId) {
      setIsLoading(true);
      const { zero, next, sort, task_id } = searchParams;

      try {
        const response = await axios.get(`${baseURL}/get-task-list.php`, {
          params: { zero, next, sort, task_id },
        });
        // console.log(response.data);
        setUserData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData({ zero, next, sort: sortBy, task_id: taskId });
  }, [zero, next, sortBy, taskId]);

  const handleNext = () => {
    setZero((prevZero) => +prevZero + +next);
  };

  const handlePrevious = () => {
    setZero((prevZero) => (+prevZero - +next >= 0 ? +prevZero - +next : 0));
  };

  const onSubmit = (values) => {
    console.log(values);
    setZero(values.back);
    setNext(values.next);
    setSortBy(values.sort);
    fetchData(values);
  };

  const onCancel = async () => {
    form.reset();
    setShowSearch(false);
  };
  const fetchChallenge = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/get-challenge-one.php?challenge_id=${params.challenge_id}`
      );
      //   console.log(response.data);
      setChallengeData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchChallenge();
  }, []);

  // console.log(params)
  return (
    <div className="w-full bg-white rounded-md border p-3">
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <Card className="w-full flex overflow-x-scroll items-center p-2 gap-2">
            <div className="font-bold text-xl whitespace-nowrap">
              {challengeData?.title}
            </div>

            {challengeData?.tasks_list?.length > 0 &&
              challengeData?.tasks_list?.map((item, index) => {
                return (
                  <div
                    className={cn(
                      "rounded-3xl p-3 min-h-40 min-w-64 text-center space-y-3",
                      taskId == item.task_id ? "bg-green-500" : "bg-gray-600"
                    )}
                    onClick={() => setTaskId(item.task_id)}
                    key={item.task_id}
                  >
                    <p className="font-extrabold text-lg">Round {index + 1}</p>
                    <p className="font-semibold text-sm">{item.task_name}</p>
                    <p className="font-semibold text-sm">{item.total_user}</p>
                  </div>
                );
              })}
          </Card>
        </>
      )}
      {
        userData?.data?.length > 0 && (
            <>
            <Card className="p-3 mt-2">
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
                      <SelectItem value="marks DESC">
                        Percentage Descending
                      </SelectItem>
                      <SelectItem value="marks ASC">
                        Percentage Ascending
                      </SelectItem>
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
                  <TableHead>Marks</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userData?.data?.length > 0 &&
                  userData?.data?.map((item) => (
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
                        {item.marks}
                      </TableCell>
                      <TableCell>
                        {item.total_user_percent.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">{`${
              +zero + 1
            } - ${+zero + (userData?.data?.length || 0)} of ${
              userData?.count ? userData?.count : 0
            }`}</div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={zero == 0}
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
            </>
        )
      }
    </div>
  );
};

export default ChallengeOne;
