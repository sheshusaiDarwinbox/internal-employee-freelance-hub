import { useState } from "react";
import { Table, Button, Modal } from "flowbite-react";

const ReqPage = () => {
  // Sample request data
  const requests = [
    {
      id: 1,
      reqType: "IT Support",
      desc: "Laptop not working",
      from: "John Doe",
      dept: "IT",
      details: "The laptop screen is not turning on. Need urgent support.",
    },
    {
      id: 2,
      reqType: "Maintenance",
      desc: "AC Repair",
      from: "Jane Smith",
      dept: "Facilities",
      details: "The air conditioning in Room 101 is not functioning.",
    },
    {
      id: 3,
      reqType: "HR Request",
      desc: "Leave Approval",
      from: "Mike Johnson",
      dept: "HR",
      details: "Requesting leave approval for 5 days due to personal reasons.",
    },
    {
      id: 4,
      reqType: "Finance",
      desc: "Budget Approval",
      from: "Alice Brown",
      dept: "Finance",
      details: "Requesting budget approval for Q3 operations.",
    },
  ];

  // State to manage modal visibility and selected request
  const [openModal, setOpenModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);

  // Function to open modal with request details
  const handleView = (request) => {
    setSelectedReq(request);
    setOpenModal(true);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">📌 Requests List</h2>

      {/* Request Table */}
      <Table hoverable>
        <Table.Head className="bg-blue-200 text-gray-900">
          <Table.HeadCell>Req Type</Table.HeadCell>
          <Table.HeadCell>Description</Table.HeadCell>
          <Table.HeadCell>From</Table.HeadCell>
          <Table.HeadCell>Dept</Table.HeadCell>
          <Table.HeadCell>Action</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {requests.map((req, index) => (
            <Table.Row
              key={req.id}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
            >
              <Table.Cell className="font-medium">{req.reqType}</Table.Cell>
              <Table.Cell>{req.desc}</Table.Cell>
              <Table.Cell>{req.from}</Table.Cell>
              <Table.Cell>{req.dept}</Table.Cell>
              <Table.Cell>
                <Button size="xs" onClick={() => handleView(req)}>
                  View
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Modal for Request Details */}
      {selectedReq && (
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Request Details</Modal.Header>
          <Modal.Body>
            <div className="p-4">
              <p>
                <strong>Request Type:</strong> {selectedReq.reqType}
              </p>
              <p>
                <strong>Description:</strong> {selectedReq.desc}
              </p>
              <p>
                <strong>From:</strong> {selectedReq.from}
              </p>
              <p>
                <strong>Department:</strong> {selectedReq.dept}
              </p>
              <p>
                <strong>Details:</strong> {selectedReq.details}
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setOpenModal(false)}>Accept</Button>
            <Button className="bg-gray-300 text-black hover:bg-gray-500" onClick={() => setOpenModal(false)}>Reject</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ReqPage;
