import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import formidable from "formidable";
import { Request } from "express";

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

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.S3_REGION,
});

const uploadToS3 = async (
  fileBuffer: Buffer,
  fileName: string
): Promise<string> => {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.S3_BUCKET!,
      Key: `uploads/${fileName}`,
      Body: fileBuffer,
      ContentType: "application/octet-stream",
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

    let fileBuffer: Buffer[] = [];

    form.parse(req, (err) => {
      if (err) reject(err);
    });

    form.on("file", async (formName, file) => {
      try {
        const stream = Readable.from(file.toJSON().filepath);

        stream.on("data", (chunk) => {
          fileBuffer.push(Buffer.from(chunk));
        });

        stream.on("end", async () => {
          try {
            const finalBuffer = Buffer.concat(fileBuffer);
            const fileUrl = await uploadToS3(
              finalBuffer,
              file.originalFilename || "unnamed"
            );

            resolve({
              fileName: file.originalFilename || "unnamed",
              fileUrl,
              fileSize: file.size,
            });
          } catch (error) {
            reject(error);
          }
        });

        stream.on("error", (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });

    form.on("error", (error) => {
      reject(error);
    });
  });
};
