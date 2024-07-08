import * as z from "zod";

export const userValidation = z.object({
  name: z.string(),
  back: z.any(),
  next: z.any(),
  sort: z.string(),
  student: z.string(),
});

export const quizValidation = z.object({
  title: z.string(),
  back: z.any(),
  next: z.any(),
  sort: z.string(),
});

export const taskValidation = z.object({
  back: z.any(),
  next: z.any(),
  sort: z.string(),
  task_id: z.any(),
});

export const challengeValidation = z.object({
  page_id: z.any(),
  task_domains: z.array(z.any()).min(1),
  title: z.string().min(5),
  description: z.string(),
  start_date: z.date(),
  end_date: z.date(),
  district_id: z.any(),
  page_type: z.string(),
  image1: z.any(),
  image2: z.any(),
  rules: z.string(),
  salary: z.string(),
  salary_description: z.string(),
});

export const roundValidation = z.object({
  challenge_id: z.any(),
  task_name: z.string().min(5),
  description: z.string(),
  image: z.any(),
  quiz_type: z.any(),
  task_percent: z.any(),
  task_variety: z.any(),
  task_keywords: z.any(),
  stars: z.any(),
  textData: z.string(),
});


export const questionValidation = z.object({
  task_id: z.string(),
  questions: z.array(
    z.object({
      type: z.enum(["text", "audio", "video", "image"]),
      question: z.string(),
      timer: z.any(),
      media: z.union([z.string().optional(), z.instanceof(File).optional()]), // to handle file uploads
      answers: z.array(
        z.object({
          answer_text: z.string(),
          is_correct: z.any(),
          marks: z.any()
        })
      ).min(2, { message: "At least two answers are required" })
    })
  ).min(1, { message: "At least one question is required" })
});
