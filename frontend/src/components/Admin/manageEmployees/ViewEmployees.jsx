import { useState } from "react";
import { Button, Modal } from "flowbite-react";

const ViewEmployees = () => {
  const [employees, setEmployees] = useState([
    {
      EID: "E123",
      name: "John Doe",
      role: "Developer",
      email: "john.doe@example.com",
      phone: "+1234567890",
      address: "123 Main St, NY",
      dob: "1990-01-01",
      department: "IT",
      salary: "$5000",
    },
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setOpenModal(true);
  };

  const handleDelete = (EID) => {
    setEmployees(employees.filter(emp => emp.EID !== EID));
  };

  const handleUpdate = () => {
    setEmployees(employees.map(emp => emp.EID === selectedEmployee.EID ? selectedEmployee : emp));
    setOpenModal(false);
  };

  const handleChange = (e) => {
    setSelectedEmployee({ ...selectedEmployee, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-5xl  p-6  rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">View Employees</h2>
      <table className="w-full border-collapse border border-gray-300 shadow-md">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="border p-3">EID</th>
            <th className="border p-3">Name</th>
            <th className="border p-3">Role</th>
            <th className="border p-3">Email</th>
            <th className="border p-3">JID</th>
            <th className="border p-3">DID</th>
            <th className="border p-3">Manager ID</th>
            <th className="border p-3">Gender</th>
            <th className="border p-3">DOB</th>
            <th className="border p-3">DOJ</th>
            <th className="border p-3">Nationality</th>
            <th className="border p-3">Marital Status</th>
            <th className="border p-3">Blood Group</th>
            <th className="border p-3">Phone</th>
            <th className="border p-3">Work mode</th>
            <th className="border p-3">Address</th>
            <th className="border p-3">City</th>
            <th className="border p-3">State</th>
            <th className="border p-3">Country</th>
            <th className="border p-3">Pincode</th>
            <th className="border p-3">Emergency PH</th>
            <th className="border p-3">FreelanceReward points</th>
            <th className="border p-3">Freelance Rating</th>
            <th className="border p-3">Skills</th>
            <th className="border p-3">Account Balance</th>
            <th className="border p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.EID} className="odd:bg-gray-100 even:bg-white">
              <td className="border p-3">{emp.EID}</td>
              <td className="border p-3">{emp.name}</td>
              <td className="border p-3">{emp.role}</td>
              <td className="border p-3">{emp.JID}</td>
              <td className="border p-3">{emp.DID}</td>
              <td className="border p-3">{emp.ManagerID}</td>
              <td className="border p-3">{emp.gender}</td>
              <td className="border p-3">{emp.dob}</td>
              <td className="border p-3">{emp.doj}</td>
              <td className="border p-3">{emp.nationality}</td>
              <td className="border p-3">{emp.maritalStatus}</td>
              <td className="border p-3">{emp.bloodGroup}</td>
              <td className="border p-3">{emp.phone}</td>
              <td className="border p-3">{emp.workmode}</td>
              <td className="border p-3">{emp.address}</td>
              <td className="border p-3">{emp.city}</td>
              <td className="border p-3">{emp.state}</td>
              <td className="border p-3">{emp.country}</td>
              <td className="border p-3">{emp.pincode}</td>
              <td className="border p-3">{emp.emergencyContactNumber}</td>
              <td className="border p-3">{emp.freelanceRewardPoints}</td>
              <td className="border p-3">{emp.freelanceRating}</td>
              <td className="border p-3">{emp.skills}</td>
              <td className="border p-3">{emp.accountBalance}</td>
              <td className="border p-3 flex space-x-2">
                <Button size="xs" onClick={() => handleEdit(emp)}>Edit</Button>
                <Button color="failure" size="xs" onClick={() => handleDelete(emp.EID)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Employee Modal */}
      {selectedEmployee && (
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Edit Employee</Modal.Header>
          <Modal.Body>
            {Object.keys(selectedEmployee).map((key) => (
              key !== "EID" && (
                <input
                  key={key}
                  name={key}
                  value={selectedEmployee[key]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mb-2"
                  placeholder={key}
                />
              )
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleUpdate}>Update</Button>
            <Button color="gray" onClick={() => setOpenModal(false)}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ViewEmployees;
