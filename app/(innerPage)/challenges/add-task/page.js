"use client";
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

const AddTask = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [challenges, setChallenges] = useState([]);
  const [location, setLocation] = useState([]);
  const [date, setDate] = useState();
  const [selectedFile1, setSelectedFile1] = useState(null);

  const handleFileChange1 = (event) => {
    setSelectedFile1(event.target.files[0]);
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
      formData.append("rules", values.rules);
      formData.append("image1", selectedFile1);
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
      if (response.data.success) {
        toast.success("Challenge added successfully.");
      }

      // console.log("Form Submitted", response.data);
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

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${baseURL}/get-all-inactive-challenges.php`
      );
      setChallenges(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-3">
      <Card className="p-3">
        <div className="w-full text-xl font-bold">
          <h1 className="text-xl font-bold">Create Round</h1>
          <hr className="w-full my-4" />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("grid grid-cols-12 w-full gap-3")}
            encType="multipart/form-data"
          >
            <FormField
              name="task_name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-6 py-2">
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Task Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="challenge_id"
              render={({ field }) => (
                <FormItem className="md:col-span-6 col-span-12 py-2">
                  <FormLabel>Test</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Test" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {challenges?.length > 0 &&
                        challenges.map((item) => (
                          <SelectItem
                            value={item.challenge_id}
                            key={item.challenge_id}
                          >
                            <div className="flex gap-2">
                              <Image
                                width={40}
                                height={20}
                                alt={item.title}
                                src={baseImgURL + item.image}
                                className="object-contain"
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
              name="quiz_type"
              render={({ field }) => (
                <FormItem className="md:col-span-6 col-span-12 py-2">
                  <FormLabel>Task Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Task Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={"normal"}>Normal</SelectItem>
                      <SelectItem value={"psychological"}>
                        Psychological
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="task_variety"
              render={({ field }) => (
                <FormItem className="md:col-span-6 col-span-12 py-2">
                  <FormLabel>Task Variety</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Task Variety" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={"technical"}>Technical</SelectItem>
                      <SelectItem value={"aptitude"}>Aptitude</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
<FormField
              name="stars"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-6 py-2">
                  <FormLabel>Stars</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={1} placeholder="Stars" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
<FormField
              name="task_percent"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-6 py-2">
                  <FormLabel>Winning Percent</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={1} placeholder="Winning Percent" {...field} />
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

export default AddTask;
