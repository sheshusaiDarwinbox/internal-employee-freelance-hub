"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestZodSchema = exports.AssignManagerZodSchema = exports.CreateGigZodSchema = exports.ForgotPasswordResetZodSchema = exports.ForgotPasswordZodSchema = exports.UsersArraySchema = exports.PositionsArraySchema = exports.DepartmentArraySchema = exports.GetPositionSchema = exports.CreatePositionSchema = exports.CreateDepartmentSchema = exports.GetDepartmentSchema = exports.CreateUserSchema = exports.GetIDSchema = exports.GetUserSchema = exports.PasswordScheme = exports.EIDScheme = void 0;
const zod_1 = require("zod");
const position_model_1 = require("../models/position.model");
const request_model_1 = require("../models/request.model");
exports.EIDScheme = zod_1.z.union([
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
exports.GetIDSchema = zod_1.z.object({
    ID: zod_1.z
        .string()
        .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
});
exports.CreateUserSchema = zod_1.z.object({
    DID: zod_1.z
        .string()
        .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
    PID: zod_1.z
        .string()
        .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
    role: zod_1.z.enum(["Admin", "Employee", "Manager", "Other"]),
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
exports.CreatePositionSchema = zod_1.z.object({
    title: zod_1.z.string().regex(/^[a-zA-Z0-9 ]+$/, {
        message: "Title must be alphanumeric with spaces",
    }),
    description: zod_1.z
        .string()
        .regex(/^[a-zA-Z0-9\s.,!?()&]+$/, "Description must be alphanumeric with grammar notations (e.g., spaces, punctuation)."),
    type: zod_1.z.nativeEnum(position_model_1.PositionTypeEnum),
    salary: zod_1.z.number().int(),
    DID: zod_1.z
        .string()
        .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" }),
});
exports.GetPositionSchema = zod_1.z.object({
    PID: zod_1.z
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
exports.PositionsArraySchema = zod_1.z.array(zod_1.z.enum([
    "FullTime",
    "PartTime",
    "Internship",
    "Temporary",
    "Freelance",
    "Contract",
    "Other",
]));
exports.UsersArraySchema = zod_1.z.array(zod_1.z.enum(["Employee", "Admin", "ProjectManager", "Other"]));
exports.ForgotPasswordZodSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email" }),
    redirectUrl: zod_1.z.string(),
});
exports.ForgotPasswordResetZodSchema = zod_1.z.object({
    newPassword: exports.PasswordScheme,
    confirmPassword: exports.PasswordScheme,
});
exports.CreateGigZodSchema = zod_1.z.object({
    ManagerID: zod_1.z
        .string()
        .regex(/^[a-zA-Z0-9]+$/, { message: "ManagerID must be alphanumeric" }),
    title: zod_1.z
        .string()
        .regex(/^[a-zA-Z0-9\s.,!?()&]+$/, "title must be alphanumeric with grammar notations (e.g., spaces, punctuation)."),
    skillsRequired: zod_1.z.array(zod_1.z.string()),
    amount: zod_1.z.number().int().gte(0),
    deadline: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    })
        .transform((val) => new Date(val)),
    description: zod_1.z
        .string()
        .regex(/^[a-zA-Z0-9\s.,!?()&]+$/, "title must be alphanumeric with grammar notations (e.g., spaces, punctuation)."),
});
exports.AssignManagerZodSchema = zod_1.z.object({
    EID: zod_1.z
        .string()
        .regex(/^[a-zA-Z0-9]+$/, { message: "DID must be alphanumeric" }),
    DID: zod_1.z
        .string()
        .regex(/^[a-zA-Z0-9]+$/, { message: "DID must be alphanumeric" }),
});
exports.RequestZodSchema = zod_1.z.object({
    reqType: zod_1.z.nativeEnum(request_model_1.RequestTypeEnum),
});
