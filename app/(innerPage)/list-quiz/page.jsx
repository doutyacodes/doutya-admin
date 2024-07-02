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
import { baseImgURL, baseURL, capitalizeFirstLetter } from "@/lib/features/baseData";
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
import { quizValidation } from "@/constants/validationData";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ListQuiz() {
  const [challengeData, setChallengeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [zero, setZero] = useState(0);
  const [next, setNext] = useState(25);
  const [sortBy, setSortBy] = useState("challenge_id DESC");
  const [title, setTitle] = useState("");
const router = useRouter()
  const form = useForm({
    resolver: zodResolver(quizValidation),
    defaultValues: {
      title: title,
      back: zero,
      next: next,
      sort: sortBy,
    },
  });

  const fetchData = async (searchParams = {}) => {
    setIsLoading(true);
    const { title, zero, next, sort } = searchParams;

    try {
      const response = await axios.get(`${baseURL}/get-all-challenges.php`, {
        params: { title, zero, next, sort },
      });
    //   console.log(response.data)
      setChallengeData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData({ title: title, zero, next, sort: sortBy});
  }, [zero, next, sortBy]);

  const handleNext = () => {
    setZero((prevZero) => +prevZero + +next);
  };

  const handlePrevious = () => {
    setZero((prevZero) => (+prevZero - +next >= 0 ? +prevZero - +next : 0));
  };

  const onSubmit = (values) => {
    console.log(values);
    setTitle(values.title);
    setZero(values.back);
    setNext(values.next);
    setSortBy(values.sort);
    fetchData(values);
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
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-6 py-2">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Title" {...field} />
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
                      <SelectItem value="challenge_id DESC">ID Descending</SelectItem>
                      <SelectItem value="challenge_id ASC">ID Ascending</SelectItem>
                      <SelectItem value="title DESC">Title Descending</SelectItem>
                      <SelectItem value="title ASC">Title Ascending</SelectItem>
                      
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
                  <TableHead>Title</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Image</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {challengeData?.data?.length > 0 &&
                  challengeData?.data?.map((item) => (
                    <TableRow key={item.challenge_id} className="cursor-pointer" onClick={()=>router.push(`list-quiz/${item.challenge_id}`)}>
                      <TableCell>{item.challenge_id}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {item.title}
                      </TableCell>
                      
                      <TableCell className="whitespace-nowrap">
                        {item.end_date} 
                      </TableCell>
                      <TableCell className="">
                        <div>
                            <Image src={baseImgURL+"a"+item.image} width={120} height={30} alt={item.title} />
                        </div>
                      </TableCell>
                      
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">{`${
              +zero + 1
            } - ${+zero + (challengeData?.data?.length || 0)} of ${
              challengeData?.count ? challengeData?.count : 0
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
    </div>
  );
}
