"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordResetZodSchema = exports.forgotPasswordZodSchema = exports.UsersArraySchema = exports.JobsArraySchema = exports.DepartmentArraySchema = exports.GetJobSchema = exports.CreateJobSchema = exports.CreateDepartmentSchema = exports.GetDepartmentSchema = exports.CreateUserSchema = exports.GetUserSchema = exports.PasswordScheme = void 0;
const zod_1 = require("zod");
const job_model_1 = require("../models/job.model");
const EIDScheme = zod_1.z.union([
    zod_1.z.string().regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
    zod_1.z.string().email({ message: "Invalid email" }),
]);
exports.PasswordScheme = zod_1.z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
})
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/, {
    message: "Password must contain at least one special character",
})
    .max(255);
exports.GetUserSchema = zod_1.z.object({
    EID: zod_1.z
        .string()
        .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
});
exports.CreateUserSchema = zod_1.z.object({
    DID: zod_1.z
        .string()
        .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
    JID: zod_1.z
        .string()
        .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
    role: zod_1.z.enum(["Admin", "Employee", "ProjectManager", "Other"]),
    ManagerID: zod_1.z
        .string()
        .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
    email: zod_1.z.string().email({ message: "Invalid email" }),
});
exports.GetDepartmentSchema = zod_1.z.object({
    DID: zod_1.z
        .string()
        .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
});
exports.CreateDepartmentSchema = zod_1.z.object({
    name: zod_1.z.string().regex(/^[a-zA-Z0-9 ]+$/, {
        message: "Name must be alphanumeric with spaces",
    }),
    description: zod_1.z
        .string()
        .regex(/^[a-zA-Z0-9\s.,!?()&]+$/, "Description must be alphanumeric with grammar notations (e.g., spaces, punctuation)."),
    type: zod_1.z.enum([
        "Engineering",
        "Product",
        "Finance",
        "Marketing",
        "Sales",
        "CustomerSupport",
        "Other",
    ]),
    teamSize: zod_1.z.number().int(),
});
exports.CreateJobSchema = zod_1.z.object({
    title: zod_1.z.string().regex(/^[a-zA-Z0-9 ]+$/, {
        message: "Title must be alphanumeric with spaces",
    }),
    description: zod_1.z
        .string()
        .regex(/^[a-zA-Z0-9\s.,!?()&]+$/, "Description must be alphanumeric with grammar notations (e.g., spaces, punctuation)."),
    type: zod_1.z.nativeEnum(job_model_1.JobTypeEnum),
    salary: zod_1.z.number().int(),
    DID: zod_1.z
        .string()
        .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
});
exports.GetJobSchema = zod_1.z.object({
    JID: zod_1.z
        .string()
        .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
});
exports.DepartmentArraySchema = zod_1.z.array(zod_1.z.enum([
    "Engineering",
    "Product",
    "Finance",
    "Marketing",
    "Sales",
    "CustomerSupport",
    "Other",
]));
exports.JobsArraySchema = zod_1.z.array(zod_1.z.enum([
    "FullTime",
    "PartTime",
    "Internship",
    "Temporary",
    "Freelance",
    "Contract",
    "Other",
]));
exports.UsersArraySchema = zod_1.z.array(zod_1.z.enum(["Employee", "Admin", "ProjectManager", "Other"]));
exports.forgotPasswordZodSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email" }),
    redirectUrl: zod_1.z.string(),
});
exports.forgotPasswordResetZodSchema = zod_1.z.object({
    newPassword: exports.PasswordScheme,
    confirmPassword: exports.PasswordScheme,
});
