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
  image1: z.any(),
  quiz_type: z.any(),
  task_percent: z.number().min(35).max(99),
  task_variety: z.any(),
  task_keywords: z.any(),
  stars: z.number(),
  textData: z.string(),
});
