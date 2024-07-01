import * as z from "zod"


export const userValidation = z.object({
    name:z.string(),
    back:z.any(),
    next:z.any(),
    sort:z.string(),
  
})



