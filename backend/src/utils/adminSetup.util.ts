import { DepartmentModel } from "../models/department.model";
import { PositionModel } from "../models/position.model";
import { User } from "../models/userAuth.model";
import { hashPassword } from "./password.util";

export const setAdmin = async () => {
  try {
    const findAdmin = await User.find({ EID: "EMP000000" });
    console.log(findAdmin);
    if (findAdmin.length === 0)
      await User.create({
        DID: "D000000",
        EID: "EMP000000",
        PID: "P000000",
        role: "Admin",
        ManagerID: "EMP000000",
        doj: new Date(),
        password: await hashPassword("admin"),
        email: "temp@gmail.com",
        verified: true,
      }).then(() => {
        console.log("Admin Created");
      });

    const findDepartment = await DepartmentModel.find({ DID: "D000000" });
    // console.log(findDepartment)
    if (findDepartment.length === 0)
      await DepartmentModel.create({
        name: "adminDepartment",
        description: "this is admin department",
        DID: "D000000",
        function: "Engineering",
        teamSize: 1,
      }).then(() => {
        console.log("Admin Department Created");
      });
    const findPosition = await PositionModel.find({ PID: "P000000" });
    if (findPosition.length === 0)
      await PositionModel.create({
        title: "adminPosition",
        description: "this is admin Position",
        DID: "D000000",
        PID: "P000000",
        salary: 0,
        type: "FullTime",
      }).then(() => {
        console.log("Admin Position Created");
      });
  } catch (err) {
    console.log(err);
  }
};
