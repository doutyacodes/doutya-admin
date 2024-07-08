"use client";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/extension/multi-select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { challengeValidation } from "@/constants/validationData";
import { baseImgURL, baseURL } from "@/lib/features/baseData";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddChallenge = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [pages, setPages] = useState([]);
  const [location, setLocation] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [date, setDate] = useState();
  const [selectedFile1, setSelectedFile1] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);

  const handleFileChange1 = (event) => {
    setSelectedFile1(event.target.files[0]);
    // console.log(event.target.files[0]);
  };
  const handleFileChange2 = (event) => {
    setSelectedFile2(event.target.files[0]);
    // console.log(event.target.files[0]);
  };
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(challengeValidation),
    defaultValues: {
      title: "",
      page_id: "",
      description: "",
      start_date: new Date(),
      end_date: new Date(),
      district_id: "",
      page_type: "",
      image1: "",
      image2: "",
      rules: "",
      salary: "",
      salary_description: "",
    },
  });

  const onSubmit = async (values) => {
    
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("page_id", values.page_id);
        formData.append("description", values.description);
        formData.append("start_date", values.start_date);
        formData.append("end_date", values.end_date);
        formData.append("district_id", values.district_id);
        formData.append("page_type", values.page_type);
        formData.append("salary", values.salary);
        formData.append("salary_description", values.salary_description);
        formData.append("task_domains", values.task_domains);
        formData.append("rules", values.rules);
        formData.append("image1", selectedFile1);
        formData.append("image2", selectedFile2);
        // console.log(selectedFile1);
        // console.log(selectedFile2);
        // console.log(formData);
        const response = await axios.post(
          `${baseURL}/create-challenges.php`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Form Submitted", response.data);
        if (response.data.success) {
          toast.success("Challenge added successfully.");
        }
  
      } catch (error) {
        console.error("Error submitting form", error);
        toast.error("Error submitting form. Please try again.");
      } finally {
        setIsLoading(false);
      }
    
  };

  const onCancel = () => {
    form.reset();
  };

  const fetchPage = async () => {
    try {
      const response = await axios.get(`${baseURL}/get-all-pages.php`);
      setPages(response.data?.pages);
      setLocation(response.data?.locations);
      setKeywords(response.data?.keywords);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, []);

  return (
    <div className="p-3">
      <Card className="p-3">
        <div className="w-full text-xl font-bold">
          <h1 className="text-xl font-bold">Create Test</h1>
          <hr className="w-full my-4" />
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("grid grid-cols-12 w-full gap-3")}
            encType="multipart/form-data"
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
              name="page_id"
              render={({ field }) => (
                <FormItem className="md:col-span-6 col-span-12 py-2">
                  <FormLabel>Page</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Page" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pages?.length > 0 &&
                        pages.map((item) => (
                          <SelectItem value={item.id} key={item.id}>
                            <div className="flex gap-2 items-center">
                              <Image
                                width={20}
                                height={20}
                                alt={item.title}
                                src={baseImgURL + item.icon}
                              />{" "}
                              <p> {item.title}</p>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="district_id"
              render={({ field }) => (
                <FormItem className="md:col-span-6 col-span-12 py-2">
                  <FormLabel>Location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {location?.length > 0 &&
                        location.map((item) => (
                          <SelectItem
                            value={item.district_id}
                            key={item.district_id}
                          >
                            <div className="flex gap-2">
                              <p> {item.title}</p>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="page_type"
              render={({ field }) => (
                <FormItem className="md:col-span-6 col-span-12 py-2">
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={"internship"}>Internship</SelectItem>
                      <SelectItem value={"job"}>Job</SelectItem>
                      <SelectItem value={"tests"}>Quiz</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="salary"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-6 py-2">
                  <FormLabel>Salary</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Salary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="task_domains"
              render={({ field }) => (
                <FormItem className=" col-span-12 ">
                  <div>

                  <FormLabel>Domains</FormLabel>
                  <FormMessage />
                  </div>
                  
                  <MultiSelector
                    values={field.value}
                    onValuesChange={(values) => field.onChange(values)}
                    loop={false}
                  >
                    <MultiSelectorTrigger>
                      <MultiSelectorInput placeholder="Select your domains" />
                    </MultiSelectorTrigger>
                    <MultiSelectorContent>
                      <MultiSelectorList>
                        {keywords?.length > 0 &&
                          keywords.map((item) => (
                            <MultiSelectorItem key={item.id} value={item.keyword}>
                              <div className="flex gap-2">
                                <Image
                                  width={20}
                                  height={20}
                                  alt={item.keyword}
                                  src={baseImgURL + item.image}
                                />
                                <p>{item.keyword}</p>
                              </div>
                            </MultiSelectorItem>
                          ))}
                      </MultiSelectorList>
                    </MultiSelectorContent>
                  </MultiSelector>
                 
                </FormItem>
              )}
            />

            <FormField
              name="start_date"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-6 py-2">
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          initialFocus
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="end_date"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-6 py-2">
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          initialFocus
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-12 py-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <ReactQuill
                      onChange={(html) => field.onChange(html)}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="salary_description"
              render={({ field }) => (
                <FormItem className="col-span-12 py-2">
                  <FormLabel>Salary Description</FormLabel>
                  <FormControl>
                    <ReactQuill
                      onChange={(html) => field.onChange(html)}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="rules"
              render={({ field }) => (
                <FormItem className="col-span-12 py-2">
                  <FormLabel>Rules</FormLabel>
                  <FormControl>
                    <ReactQuill
                      onChange={(html) => field.onChange(html)}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="image1"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-6 py-2">
                  <FormLabel>Image (788 x 136)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      placeholder="Image"
                      onChange={handleFileChange1}
                    />
                  </FormControl>
                  <FormMessage />
                  {selectedFile1 && (
                    <div className="col-span-12 grid grid-cols-12 h-[100px] w-[100px] relative">
                      <Image
                        src={URL.createObjectURL(selectedFile1)}
                        fill
                        alt={"image1"}
                        className="w-100 h-100 object-contain bg-no-repeat"
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />

            <FormField
              name="image2"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-6 py-2">
                  <FormLabel>Image (744 x 222)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      placeholder="Image"
                      onChange={handleFileChange2}
                    />
                  </FormControl>
                  <FormMessage />
                  {selectedFile2 && (
                    <div className="col-span-12 grid grid-cols-12 h-[100px] w-[100px] relative">
                      <Image
                        src={URL.createObjectURL(selectedFile2)}
                        fill
                        alt={"image1"}
                        className="w-100 h-100 object-contain bg-no-repeat"
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />

            <div className="col-span-12 grid-cols-12 grid gap-3">
              <Button
                type="submit"
                className="md:col-span-2 col-span-5 w-full"
                disabled={isLoading}
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AddChallenge;
