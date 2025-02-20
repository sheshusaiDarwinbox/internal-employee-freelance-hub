import { DepartmentModel } from "../models/department.model";
import { JobModel } from "../models/job.model";
import { User } from "../models/userAuth.model";

export const setAdmin = async () => {
  try {
    const findAdmin = await User.find({ EID: "EMP-000000" });
    console.log(findAdmin);
    if (findAdmin.length !== 0) return;
    await User.create({
      DID: "D-000000",
      EID: "EMP-000000",
      JID: "J-000000",
      role: "Admin",
      ManagerID: "EMP-000000",
      doj: new Date(),
      password: "admin",
    }).then(() => {
      console.log("Admin Created");
    });

    const findDepartment = await DepartmentModel.find({ DID: "D-000001" });
    if (findDepartment) return;
    await DepartmentModel.create({
      name: "adminDepartment",
      description: "this is admin department",
      DID: "D-000000",
      type: "Engineering",
      teamSize: 1,
    }).then(() => {
      console.log("Admin Department Created");
    });
    const findJob = await JobModel.find({ JID: "J-000000" });
    if (findJob) return;

    await JobModel.create({
      title: "adminJob",
      description: "this is admin job",
      DID: "D-000000",
      JID: "J-000000",
      salary: 0,
      type: "Full Time",
    }).then(() => {
      console.log("Admin Department Created");
    });
  } catch (err) {
    console.log(err);
  }
};
