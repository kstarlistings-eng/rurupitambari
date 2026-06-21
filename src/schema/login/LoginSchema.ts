import { z } from "zod";

const noEmojiRegex = /^[^\p{Extended_Pictographic}]*$/u;

export const loginPasswordSchema = z
  .string()
  .min(6, { message: "Password must be between 6 and 16 characters long" })
  .max(16, { message: "Password must be between 6 and 16 characters long" })
  //   .regex(/[A-Z]/, {
  //     message: "Password must contain at least one uppercase letter",
  //   })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  //   .regex(/[0-9]/, {
  //     message: "Password must contain at least one digit",
  //   })
  //   .regex(/[!@#$%^&*(),.?":{}|<>]/, {
  //     message: "Password must contain at least one special character",
  //   })
  .regex(noEmojiRegex, {
    message: "Password must not contain emojis",
  });

export const loginSchema = z
  .object({
    email: z
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    rememberMe: z.boolean().optional(),
  })
  .transform((data) => ({
    ...data,
    email: data.email.toLowerCase().trim(),
    password: data.password.trim(),
  }));

export const LoginInputDefaultValues = {
  email: "",
  password: "",
  rememberMe: false,
};

export type LoginInput = z.infer<typeof loginSchema>;
