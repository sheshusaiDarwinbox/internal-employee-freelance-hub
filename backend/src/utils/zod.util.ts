import { z } from "zod";
import { PositionTypeEnum } from "../models/position.model";
import { RequestTypeEnum } from "../models/request.model";

export const EIDScheme = z.union([
  z.string().regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
  z.string().email({ message: "Invalid email" }),
]);

export const PasswordScheme = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/, {
    message: "Password must contain at least one special character",
  })
  .max(255);

export const GetUserSchema = z.object({
  EID: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
});

export const GetIDSchema = z.object({
  ID: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
});

export const CreateUserSchema = z.object({
  DID: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
  PID: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
  role: z.enum(["Admin", "Employee", "Manager", "Other"]),
  ManagerID: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
  email: z.string().email({ message: "Invalid email" }),
});

export const GetDepartmentSchema = z.object({
  DID: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
});

export const CreateDepartmentSchema = z.object({
  name: z.string().regex(/^[a-zA-Z0-9 ]+$/, {
    message: "Name must be alphanumeric with spaces",
  }),
  description: z
    .string()
    .regex(
      /^[a-zA-Z0-9\s.,!?()&]+$/,
      "Description must be alphanumeric with grammar notations (e.g., spaces, punctuation)."
    ),
  type: z.enum([
    "Engineering",
    "Product",
    "Finance",
    "Marketing",
    "Sales",
    "CustomerSupport",
    "Other",
  ]),
  teamSize: z.number().int(),
});

export const CreatePositionSchema = z.object({
  title: z.string().regex(/^[a-zA-Z0-9 ]+$/, {
    message: "Title must be alphanumeric with spaces",
  }),
  description: z
    .string()
    .regex(
      /^[a-zA-Z0-9\s.,!?()&]+$/,
      "Description must be alphanumeric with grammar notations (e.g., spaces, punctuation)."
    ),
  type: z.nativeEnum(PositionTypeEnum),

  salary: z.number().int(),
  DID: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
});

export const GetPositionSchema = z.object({
  PID: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
});

export const DepartmentArraySchema = z.array(
  z.enum([
    "Engineering",
    "Product",
    "Finance",
    "Marketing",
    "Sales",
    "CustomerSupport",
    "Other",
  ] as const)
);

export const PositionsArraySchema = z.array(
  z.enum([
    "FullTime",
    "PartTime",
    "Internship",
    "Temporary",
    "Freelance",
    "Contract",
    "Other",
  ] as const)
);

export const UsersArraySchema = z.array(
  z.enum(["Employee", "Admin", "ProjectManager", "Other"])
);

export const ForgotPasswordZodSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  redirectUrl: z.string(),
});

export const ForgotPasswordResetZodSchema = z.object({
  newPassword: PasswordScheme,
  confirmPassword: PasswordScheme,
});

export const CreateGigZodSchema = z.object({
  ManagerID: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, { message: "ManagerID must be alphanumeric" }),
  title: z
    .string()
    .regex(
      /^[a-zA-Z0-9\s.,!?()&]+$/,
      "title must be alphanumeric with grammar notations (e.g., spaces, punctuation)."
    ),
  skillsRequired: z.array(z.string()),
  amount: z.number().int().gte(0),
  deadline: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)),
  description: z
    .string()
    .regex(
      /^[a-zA-Z0-9\s.,!?()&]+$/,
      "title must be alphanumeric with grammar notations (e.g., spaces, punctuation)."
    ),
});

export const AssignManagerZodSchema = z.object({
  EID: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, { message: "DID must be alphanumeric" }),
  DID: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, { message: "DID must be alphanumeric" }),
});

export const RequestZodSchema = z.object({
  reqType: z.nativeEnum(RequestTypeEnum),
});
