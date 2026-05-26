import { z } from 'zod';

const coordSchema = z.string({
  required_error: 'Coordinate is required',
})
  .refine((val) => val.trim() !== '', { message: 'Coordinate cannot be empty' })
  .refine((val) => !isNaN(Number(val)), { message: 'Coordinate must be a valid number' })
  .transform((val) => Number(val))
  .refine((val) => Number.isInteger(val), { message: 'Coordinate must be an integer' })
  .refine((val) => val >= 0, { message: 'Coordinate must be non-negative' });

const puzzleIdSchema = z.string({
  required_error: 'Puzzle ID is required',
})
  .refine((val) => val.trim() !== '', { message: 'Puzzle ID cannot be empty' })
  .refine((val) => !isNaN(Number(val)), { message: 'Puzzle ID must be a valid number' })
  .transform((val) => Number(val))
  .refine((val) => Number.isInteger(val), { message: 'Puzzle ID must be an integer' })
  .refine((val) => val > 0, { message: 'Puzzle ID must be positive' });

const hintParamsSchema = z.object({
  userId: z.string({
    required_error: 'User ID is required',
  }),
  puzzleId: puzzleIdSchema,
  x: coordSchema,
  y: coordSchema,
});

export function validateHintParams(searchParams: URLSearchParams, userId: string | null): {
  isValid: boolean;
  errors: string[];
  data: z.infer<typeof hintParamsSchema> | null;
} {
  const result = hintParamsSchema.safeParse({
    userId: userId ?? undefined, 
    puzzleId: searchParams.get('puzzleId') ?? undefined,
    x: searchParams.get('x') ?? undefined,
    y: searchParams.get('y') ?? undefined,
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