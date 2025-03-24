import { Request } from "express";
import {
  getSkillsList,
  generatePresignedUrl,
} from "../../controllers/util.controller";
import { extendedTechSkills } from "../../utils/insertSkills.util";
import { HttpStatusCodes } from "../../utils/httpsStatusCodes.util";
import { S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "../mocks/mockDependencies";

jest.mock("@aws-sdk/client-s3");
jest.mock("@aws-sdk/s3-request-presigner");

describe("Util Controller", () => {
  let mockRequest: Partial<Request>;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    jest.clearAllMocks();
  });

  describe("getSkillsList", () => {
    it("should return the list of skills", async () => {
      const result = await getSkillsList();

      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: extendedTechSkills,
      });
    });
  });

  describe("generatePresignedUrl", () => {
    it("should generate presigned URL successfully", async () => {
      mockRequest.body = {
        fileName: "test.pdf",
      };

      (getSignedUrl as jest.Mock).mockResolvedValue(
        "https://presigned-url.com"
      );

      const result = await generatePresignedUrl(mockRequest as Request);

      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: {
          key: expect.stringContaining("test.pdf"),
          url: "https://presigned-url.com",
          contentType: "application/pdf",
        },
      });
    });

    it("should handle invalid file type", async () => {
      mockRequest.body = {
        fileName: "test.exe",
      };

      const result = await generatePresignedUrl(mockRequest as Request);

      expect(result).toEqual({
        status: HttpStatusCodes.BAD_REQUEST,
        data: {
          msg: "Invalid file type",
        },
      });
    });

    it("should handle presigned URL generation failure", async () => {
      mockRequest.body = {
        fileName: "test.pdf",
      };

      (getSignedUrl as jest.Mock).mockResolvedValue(null);

      const result = await generatePresignedUrl(mockRequest as Request);

      expect(result).toEqual({
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        data: {
          msg: "Error generating presigned URL",
        },
      });
    });
  });
});
