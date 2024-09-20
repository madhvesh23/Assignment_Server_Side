import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").max(255, "Title too long"),
  author: z
    .string()
    .min(1, "Author cannot be empty")
    .max(255, "Author too long"),
  genre: z.string().min(1, "Genre cannot be empty").max(100, "Genre too long"),
  publication_date: z.string(),
  isbn: z.string().length(13, "ISBN length should be 13 digits"),
});

export async function validateBook(
  book: any
): Promise<{ success: boolean; message?: string }> {
  const validation = bookSchema.safeParse(book);
  if (validation.success) {
    return { success: true };
  } else {
    const errors = validation.error.errors.map((err) => err.message).join(", ");
    return { success: false, message: `Validation Error: ${errors}` };
  }
}
