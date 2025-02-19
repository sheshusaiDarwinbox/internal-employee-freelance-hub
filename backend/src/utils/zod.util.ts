import { z } from "zod";
import { DepartmentEnum } from "../types/department.types";
import { JobTypeEnum } from "../types/job.types";

const EIDScheme = z.union([
  z.string().regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
  z.string().email({ message: "Invalid email" }),
]);

const PasswordScheme = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/, {
    message: "Password must contain at least one special character",
  })
  .max(255);

export const UserSchema = z.object({
  EID: EIDScheme,
  password: PasswordScheme,
});

export const DepartmentSchema = z.object({
  DID: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
  name: z.string().regex(/^[a-zA-Z0-9 ]+$/, {
    message: "Name must be alphanumeric with spaces",
  }),
  Description: z
    .string()
    .regex(
      /^[a-zA-Z0-9\s.,!?()&]+$/,
      "Description must be alphanumeric with grammar notations (e.g., spaces, punctuation)."
    ),
  type: z.nativeEnum(DepartmentEnum),
  TeamSize: z.number().int(),
});

export const jobSchema = z.object({
  JID: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
  title: z.string().regex(/^[a-zA-Z0-9 ]+$/, {
    message: "Title must be alphanumeric with spaces",
  }),
  description: z
    .string()
    .regex(
      /^[a-zA-Z0-9\s.,!?()&]+$/,
      "Description must be alphanumeric with grammar notations (e.g., spaces, punctuation)."
    ),
  type: z.nativeEnum(JobTypeEnum),
  salary: z.number().int(),
  DID: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
});
