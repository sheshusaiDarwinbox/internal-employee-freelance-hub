import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import formidable from "formidable";
import { Request } from "express";
import { v4 as uuidV4 } from "uuid";
import AWS from "aws-sdk";
import mime from "mime-types";
import path from "path";
import fs from "fs";

interface FileUploadResult {
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

const uploadToS3 = async (
  fileBuffer: Buffer,
  fileName: string
): Promise<string> => {
  const extension = path.extname(fileName);
  const contentType = mime.lookup(fileName) || "application/octet-stream";

  const s3Client = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    region: process.env.S3_REGION,
  });

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.S3_BUCKET!,
      Key: `uploads/${uuidV4()}-${path.basename(
        fileName,
        extension
      )}${extension}`,
      Body: fileBuffer,
      ContentType: contentType,
    },
  });

  const result = await upload.done();
  return result.Location ? result.Location : "unknown";
};

export const parseFile = async (req: Request): Promise<FileUploadResult> => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024,
      allowEmptyFiles: false,
      keepExtensions: true,
      filter: ({ mimetype }) => {
        if (!mimetype) {
          return false;
        }
        return allowedMimeTypes.includes(
          mimetype as (typeof allowedMimeTypes)[number]
        );
      },
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(err);
      }

      const fileKey = Object.keys(files)[0];
      const fileArray = files[fileKey];

      if (!fileArray || !fileArray.length) {
        return reject(new Error("No file uploaded"));
      }

      const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

      try {
        const fileBuffer = fs.readFileSync(file.filepath);

        const fileUrl = await uploadToS3(
          fileBuffer,
          file.originalFilename || file.newFilename || "unnamed"
        );

        fs.unlinkSync(file.filepath);

        resolve({
          fileName: file.originalFilename || file.newFilename || "unnamed",
          fileUrl,
          fileSize: file.size,
        });
      } catch (error) {
        reject(error);
      }
    });
  });
};

export const generatePresignedUrl = async (
  bucketName: string,
  objectKey: string
) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    region: process.env.S3_REGION,
  });

  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Expires: 60 * 60,
  };

  try {
    const signedUrl = s3.getSignedUrl("getObject", params);
    return signedUrl;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error("Error generating presigned URL");
  }
};
