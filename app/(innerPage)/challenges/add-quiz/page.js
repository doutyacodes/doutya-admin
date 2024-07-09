"use client";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { questionValidation } from "@/constants/validationData";
import { baseImgURL, baseURL } from "@/lib/features/baseData";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const AddQuestions = () => {
  const [selectedFiles, setSelectedFiles] = useState({});
  const [tasks, setTasks] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(questionValidation),
    defaultValues: {
      task_id: "",
      questions: [
        {
          type: "text",
          question: "",
          timer: 0,
          media: "",
          answers: [
            { answer_text: "", is_correct: false, marks: 0 },
            { answer_text: "", is_correct: false, marks: 0 },
          ],
        },
      ],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    setSelectedFiles((prev) => ({ ...prev, [index]: file }));
    form.setValue(`questions.${index}.media`, file);
  };

  const onSubmit = async (values) => {
    console.log(values);
    try {
        setIsLoading(true)
      const formData = new FormData();
      formData.append("task_id", values.task_id);
      values.questions.forEach((question, index) => {
        formData.append(`questions[${index}].type`, question.type);
        formData.append(`questions[${index}].question`, question.question);
        formData.append(`questions[${index}].timer`, question.timer);
        if (selectedFiles[index]) {
          formData.append(`questions[${index}].media`, selectedFiles[index]);
        }
        question.answers.forEach((answer, i) => {
          formData.append(
            `questions[${index}].answers[${i}].answer_text`,
            answer.answer_text
          );
          formData.append(
            `questions[${index}].answers[${i}].is_correct`,
            answer.is_correct
          );
          formData.append(`questions[${index}].answers[${i}].marks`, answer.marks);
        });
      });

      const response = await axios.post(
        `${baseURL}/create-questions.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Questions added successfully.");
        router.push("/path-to-redirect-after-success");
      } else {
        toast.error("Error adding questions.");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error("Error submitting form. Please try again.");
    }
    finally{
        setIsLoading(false)
    }
  };
  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${baseURL}/get-all-tasks.php`
      );
      console.log(response.data);
      setTasks(response.data.data);
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
          <h1 className="text-xl font-bold">Add Questions</h1>
          <hr className="w-full my-4" />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-12 w-full gap-3"
          >
            <FormField
              name="task_id"
              render={({ field }) => (
                <FormItem className=" col-span-12 py-2">
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
                      {tasks?.length > 0 &&
                        tasks.map((item) => (
                          <SelectItem
                            value={item.task_id}
                            key={item.task_id}
                          >
                            <div className="flex gap-2 items-center">
                              <Image
                                width={40}
                                height={20}
                                alt={item.task_name}
                                src={baseImgURL + item.image}
                                className="object-contain"
                              />{" "}
                              <p> {item.task_name}</p>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {questionFields.map((question, questionIndex) => {
              const {
                fields: answerFields,
                append: appendAnswer,
                remove: removeAnswer,
              } = useFieldArray({
                control: form.control,
                name: `questions.${questionIndex}.answers`,
              });

              return (
                <div key={question.id} className="col-span-12 border p-3 mb-3">
                  <div className="grid grid-cols-12 gap-3">
                    <FormField
                      name={`questions.${questionIndex}.type`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="col-span-12 md:col-span-4 py-2">
                          <FormLabel>Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="audio">Audio</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                              <SelectItem value="image">Image</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name={`questions.${questionIndex}.question`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="col-span-12 md:col-span-4 py-2">
                          <FormLabel>Question</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Question" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name={`questions.${questionIndex}.timer`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="col-span-12 md:col-span-4 py-2">
                          <FormLabel>Timer (in seconds)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Timer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {(form.watch(`questions.${questionIndex}.type`) === "image" ||
                      form.watch(`questions.${questionIndex}.type`) === "audio" ||
                      form.watch(`questions.${questionIndex}.type`) === "video") && (
                      <FormField
                        name={`questions.${questionIndex}.media`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="col-span-12 md:col-span-6 py-2">
                            <FormLabel>
                              Upload {form.watch(`questions.${questionIndex}.type`)}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                onChange={(e) => handleFileChange(questionIndex, e)}
                              />
                            </FormControl>
                            <FormMessage />
                            {selectedFiles[questionIndex] && (
                              <div className="col-span-12 grid grid-cols-12 h-[100px] w-[100px] relative">
                                <Image
                                  src={URL.createObjectURL(selectedFiles[questionIndex])}
                                  fill
                                  alt={"media"}
                                  className="w-100 h-100 object-contain bg-no-repeat"
                                />
                              </div>
                            )}
                          </FormItem>
                        )}
                      />
                    )}

                    <Button
                      type="button"
                      onClick={() => removeQuestion(questionIndex)}
                      className="col-span-12 md:col-span-2 w-full"
                    >
                      Remove Question
                    </Button>

                    <FormLabel className="col-span-12 py-2">Answers</FormLabel>
                    {answerFields.map((answer, answerIndex) => (
                      <div
                        key={answer.id}
                        className="col-span-12 grid grid-cols-12 gap-3 mb-3"
                      >
                        <FormField
                          name={`questions.${questionIndex}.answers.${answerIndex}.answer_text`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="col-span-12 md:col-span-4 py-2">
                              <FormLabel>Answer Text</FormLabel>
                              <FormControl>
                                <Input type="text" placeholder="Answer Text" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          name={`questions.${questionIndex}.answers.${answerIndex}.is_correct`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="col-span-12 md:col-span-4 py-2">
                              <FormLabel>Is Correct?</FormLabel>
                              <FormControl>
                                <Input type="checkbox" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          name={`questions.${questionIndex}.answers.${answerIndex}.marks`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="col-span-12 md:col-span-4 py-2">
                              <FormLabel>Marks</FormLabel>
                              <FormControl>
                                <Input type="number" min={0} placeholder="Marks" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="button"
                          onClick={() => removeAnswer(answerIndex)}
                          className="col-span-12 md:col-span-2 w-full"
                        >
                          Remove Answer
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      onClick={() =>
                        appendAnswer({
                          answer_text: "",
                          is_correct: false,
                          marks: 0,
                        })
                      }
                      className="col-span-12 md:col-span-2 w-full"
                    >
                      Add Answer
                    </Button>
                  </div>
                </div>
              );
            })}

            <Button
              type="button"
              onClick={() =>
                appendQuestion({
                  type: "text",
                  question: "",
                  timer: 0,
                  media: "",
                  answers: [
                    { answer_text: "", is_correct: false, marks: 0 },
                    { answer_text: "", is_correct: false, marks: 0 },
                  ],
                })
              }
              className="col-span-12 md:col-span-2 w-full"
            >
              Add Question
            </Button>

            <div className="col-span-12 grid-cols-12 grid gap-3">
              <Button
                type="submit"
                className="md:col-span-2 col-span-5 w-full"
                disabled={form.formState.isSubmitting || isLoading}
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

export default AddQuestions;