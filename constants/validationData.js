import * as z from "zod"


export const userValidation = z.object({
    name:z.string(),
    back:z.any(),
    next:z.any(),
    sort:z.string(),
    student:z.string(),
  
})

export const quizValidation = z.object({
    title:z.string(),
    back:z.any(),
    next:z.any(),
    sort:z.string(),
  
})

export const taskValidation = z.object({
    back:z.any(),
    next:z.any(),
    sort:z.string(),
    task_id:z.any(),
  
})



