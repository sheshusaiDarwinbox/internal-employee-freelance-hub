import { type Request, type Response, Router } from "express";
import { CreateTaskZodSchema } from "../utils/zod.util";
import { User, UserRole } from "../models/userAuth.model";
import { ApprovalStatus, OngoingStatus, Task } from "../models/task.model";
import { RequestModel, RequestTypeEnum } from "../models/request.model";
import { generateId } from "../utils/counterManager.util";
import { IDs } from "../models/idCounter.model";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { error } from "../utils/error.util";
import { checkAuth } from "../middleware/checkAuth.middleware";
import { UserAuth } from "../types/userAuth.types";
import { sessionHandler } from "../utils/session.util";

export const taskControlRouter = Router();

export const createTask = sessionHandler(
  async (req: Request, res: Response) => {
    const data = CreateTaskZodSchema.parse(req.body);

    const manager: UserAuth | null = await User.findOne({
      EID: data.ManagerID,
    });
    const TaskID = await generateId(IDs.TaskID);

    if (!manager || !TaskID)
      throw new Error("manager not found or TaskID not created");

    const task = await Task.create({
      ...data,
      DID: manager.DID,
      TaskID: TaskID,
      createdAt: Date.now(),
      ongoingStatus: OngoingStatus.UnAssigned,
      approvalStatus: ApprovalStatus.PENDING,
    });

    if (!task) throw new Error("failed to create task");

    const request = await RequestModel.create({
      ReqID: await generateId(IDs.ReqID),
      From: data.ManagerID,
      To: "EMP000000",
      reqType: RequestTypeEnum.ApproveTask,
      description: `Request to approve task from ${data.ManagerID}`,
    });
    if (!request) throw new Error("failed to create request");
    res.status(HttpStatusCodes.CREATED).send(data);
  }
);

// export const getAllTasks = sessionHandler(
//     async (req: Request, res: Response) => {
//         const tasks = await Task.
//     }
// )

taskControlRouter.post("/post", checkAuth([UserRole.Manager]), createTask);
