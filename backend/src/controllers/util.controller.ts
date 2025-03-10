import { Request, Response, Router } from "express";
import { sessionHandler } from "../utils/session.util";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { extendedTechSkills } from "../utils/insertSkills.util";
import { checkAuth } from "../middleware/checkAuth.middleware";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidV4 } from "uuid";
import path from "path";
import mime from "mime-types";
export const utilControlRouter = Router();

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const getSkillsList = sessionHandler(
  async (req: Request, res: Response) => {
    return {
      status: HttpStatusCodes.OK,
      data: extendedTechSkills,
    };
  }
);

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.S3_REGION,
});

export const generatePresignedUrl = sessionHandler(async (req, res) => {
  const { fileName } = req.body;
  console.log(req.body);

  const extension = path.extname(fileName);
  const contentType = mime.lookup(fileName) || "application/octet-stream";
  if (
    !allowedMimeTypes.includes(contentType as (typeof allowedMimeTypes)[number])
  )
    return {
      status: HttpStatusCodes.BAD_REQUEST,
      data: {
        msg: "Invalid file type",
      },
    };
  const key = `uploads/${uuidV4()}-${path.basename(
    fileName,
    extension
  )}${extension}`;
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  if (url)
    return {
      status: HttpStatusCodes.OK,
      data: {
        key: `https://talent-hive-s3.s3.ap-south-1.amazonaws.com/${key}`,
        url: url,
        contentType: contentType,
      },
    };
  else
    return {
      status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      data: {
        msg: "Error generating presigned URL",
      },
    };
});

utilControlRouter.get("/get-skills", checkAuth([]), getSkillsList);
utilControlRouter.post(
  "/generate-presigned-url",
  checkAuth([]),
  generatePresignedUrl
);
