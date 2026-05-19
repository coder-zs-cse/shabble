import { z } from 'zod';

const hintParamsSchema = z.object({
  userId: z.string({
    required_error: 'User ID is required',
  }),
  date: z.string({
    required_error: 'Date is required',
  }),
  boardSize: z.coerce.number({
    required_error: 'Board size is required',
  }),
  x: z.coerce
    .number()
    .min(0, 'X coordinate must be non-negative'),
  y: z.coerce
    .number()
    .min(0, 'Y coordinate must be non-negative')
})

export function validateHintParams(searchParams: URLSearchParams, userId: string | null): {
  isValid: boolean;
  errors: string[];
  data: z.infer<typeof hintParamsSchema> | null;
} {
  const result = hintParamsSchema.safeParse({
    userId,
    date: searchParams.get('date'),
    boardSize: searchParams.get('boardSize'),
    x: searchParams.get('x'),
    y: searchParams.get('y')
  });

  if (!result.success) {
    return {
      isValid: false,
      errors: result.error.errors.map(err => err.message),
      data: null,
    };
  }

  return {
    isValid: true,
    errors: [],
    data: result.data,
  };
}