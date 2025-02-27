import { useState, useEffect } from "react";
import { Button, Label } from "flowbite-react";

const CreateEmployee = () => {
  const [employee, setEmployee] = useState({
    EID: "",
    Name:"",
    password: "",
    role: "",
    email: "",
    JID: "",
    DID: "",
    ManagerID: "",
    gender: "",
    dob: "",
    doj: "",
    nationality: "",
    maritalStatus: "",
    bloodGroup: "",
    phone: "",
    workmode: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    emergencyContactNumber: "",
    freelanceRewardPoints: "",
    freelanceRating: "",
    skills: "",
    accountBalance: "",
    img: "",
  });

  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    // Fetch departments and managers from API or define them here
    setDepartments(["HR", "Engineering", "Sales"]); // Example departments
    setManagers(["Manager 1", "Manager 2", "Manager 3"]); // Example managers
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployee({ ...employee, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Employee Data:", employee);
    alert("Employee added successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Add Employee</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="EID">Employee ID</Label>
            <input name="EID" type="text" required onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>
          <div>
            <Label htmlFor="name">Employee Name</Label>
            <input name="name" type="text" required onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <input name="password" type="password" required onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <input name="role" type="text" required onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <input name="email" type="email" required onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <input name="phone" type="text" onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <Label htmlFor="JID">Job ID</Label>
            <input name="JID" type="text" onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <Label htmlFor="DID">Department</Label>
            <select name="DID" onChange={handleChange} className="w-full h-13 py-4 px-5 text-md border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200">
              <option value="">Select Department</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="ManagerID">Manager</Label>
            <select name="ManagerID" onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200">
              <option value="">Select Manager</option>
              {managers.map((manager, index) => (
                <option key={index} value={manager}>{manager}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <input name="address" type="text" onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <input name="city" type="text" onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <input name="state" type="text" onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <input name="country" type="text" onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <Label htmlFor="pincode">Pincode</Label>
            <input name="pincode" type="text" onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <input name="dob" type="date" onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <Label htmlFor="doj">Date of Joining</Label>
            <input name="doj" type="date" onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <Label htmlFor="nationality">Nationality</Label>
            <input name="nationality" type="text" onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <Label htmlFor="bloodGroup">Blood Group</Label>
            <input name="bloodGroup" type="text" onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <Label htmlFor="workmode">Work Mode</Label>
            <select name="workmode" onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200">
              <option value="">Select Work Mode</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <Label htmlFor="emergencyContactNumber">Emergency Contact</Label>
            <input name="emergencyContactNumber" type="text" onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <Label htmlFor="freelanceRewardPoints">Freelance Reward Points</Label>
            <input name="freelanceRewardPoints" type="number" onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <Label htmlFor="freelanceRating">Freelance Rating</Label>
            <input name="freelanceRating" type="number" step="0.1" onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <input name="skills" type="text" onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <Label htmlFor="accountBalance">Account Balance</Label>
            <input name="accountBalance" type="number" onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <Label htmlFor="img">Profile Image URL</Label>
            <input name="img" type="text" onChange={handleChange} className="w-full h-13 py-4 px-5 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>

        </div>

        <div className="text-center">
          <Button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Add Employee
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEmployee;
