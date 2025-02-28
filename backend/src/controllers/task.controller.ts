import { type Request, type Response, Router } from "express";
import { CreateTaskZodSchema, GetIDSchema } from "../utils/zod.util";
import { User, UserRole } from "../models/userAuth.model";
import { ApprovalStatus, OngoingStatus, Task } from "../models/task.model";
import { RequestModel, RequestTypeEnum } from "../models/request.model";
import { generateId } from "../utils/counterManager.util";
import { IDs } from "../models/idCounter.model";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { checkAuth } from "../middleware/checkAuth.middleware";
import { UserAuth } from "../types/userAuth.types";
import { sessionHandler } from "../utils/session.util";
import { z } from "zod";

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

    const taskdata = {
      ...data,
      DID: manager.DID,
      TaskID: TaskID,
      createdAt: Date.now(),
      ongoingStatus: OngoingStatus.UnAssigned,
      approvalStatus:
        data.amount > 0 ? ApprovalStatus.PENDING : ApprovalStatus.APPROVED,
    };

    const task = await Task.create(taskdata);

    if (!task) throw new Error("failed to create task");

    if (data.amount > 0) {
      const request = await RequestModel.create({
        ReqID: await generateId(IDs.ReqID),
        From: data.ManagerID,
        To: "EMP000000",
        reqType: RequestTypeEnum.ApproveTask,
        description: `Request to approve task from ${data.ManagerID}`,
      });
      if (!request) throw new Error("failed to create request");
    }
    res.status(HttpStatusCodes.CREATED).send(data);
  }
);

export const getAllTasks = sessionHandler(
  async (req: Request, res: Response) => {
    const { DIDs, ManagerIDs, search, page = 0 } = req.query;
    let filter: any = {};
    if (DIDs) {
      z.array(
        z
          .string()
          .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" })
      ).parse(DIDs);
      filter.DID = { $in: DIDs };
    }
    if (ManagerIDs) {
      z.array(
        z
          .string()
          .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" })
      ).parse(DIDs);
      filter.ManagerID = { $in: ManagerIDs };
    }
    if (search) {
      z.string().regex(
        /^[a-zA-Z0-9\s.,!?()&]+$/,
        "search must be alphanumeric with grammar notations (e.g., spaces, punctuation)."
      );
      filter = {
        ...filter,
        $text: { $search: search },
      };
    }

    const tasks = await Task.paginate(filter, {
      offset: Number(page) * 10,
      limit: 10,
    });
    res.status(HttpStatusCodes.OK).send(tasks);
  }
);

export const getTaskById = sessionHandler(
  async (req: Request, res: Response) => {
    const { TaskID } = req.params;
    GetIDSchema.parse({ ID: TaskID });
    const task = await Task.findOne({ JID: TaskID });
    res.status(HttpStatusCodes.OK).send(task);
  }
);

taskControlRouter.post("/post", checkAuth([UserRole.Manager]), createTask);
taskControlRouter.get("", checkAuth([]), getAllTasks);
taskControlRouter.get("/:TaskID", checkAuth([]), getTaskById);
