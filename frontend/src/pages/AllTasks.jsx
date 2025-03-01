import { Card, Button, Modal } from "flowbite-react";
import { useState } from "react";
import task1 from "../assets/Tasks/task1.jpg";
import task2 from "../assets/Tasks/task2.jpg";
import { formatDate } from "../utils/dateUtils";

const AllTasks = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setOpenModal(true);
  };
  const tasks = [
    {
      image: task1,
      postedBy: "John Doe",
      department: "Engineering",
      projectTitle: "Task Management System",
      description: "Develop a task management system using React and Node.js",
      longDescription:
        "This project involves creating a comprehensive task management system that allows users to create, edit, and delete tasks efficiently. The system will provide a user-friendly interface where tasks can be categorized, prioritized, and assigned to different users or teams. It will include features such as due date reminders, progress tracking, and collaboration tools to enhance productivity. Additionally, the system will integrate with databases to store task details securely, ensuring seamless data retrieval and management. By implementing modern web technologies, the project aims to deliver a responsive and scalable solution that can be used in various professional and personal settings.",
      tags: ["React", "Node.js", "MongoDB"],
      status: "Available",
      points: 500,
      deadline: "March 30, 2025",
      amount: "$1000",
    },
    {
      image: task2,
      postedBy: "Jane Smith",
      department: "Design",
      projectTitle: "UI/UX Redesign",
      description: "Redesign the user interface for better user experience",
      longDescription:
        "This project focuses on enhancing the overall user experience by redesigning the UI of an existing application. The goal is to create a more intuitive, visually appealing, and user-friendly interface that improves usability and accessibility. By refining navigation, optimizing layouts, and implementing modern design principles, the project aims to make the application more efficient and engaging for users. The redesign will also consider user feedback, ensuring that the new interface aligns with user needs and expectations while maintaining consistency with the brand identity.",
      tags: ["Figma", "UI/UX", "Prototyping"],
      status: "Available",
      points: 250,
      deadline: "April 10, 2025",
      amount: "$500",
    },
  ];

  return (
    <div className="p-6 bg-gray-50">
      <div className="grid grid-cols-1 gap-6">
        {tasks.map((task, index) => (
          <Card
            key={index}
            onClick={() => handleOpenModal(task)}
            className="hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <div className="flex">
              <div className="w-1/3 pr-4">
                <img
                  src={task.image}
                  alt="Task"
                  className="w-full h-48 object-cover rounded-lg shadow-sm"
                />
                <p className="text-sm mt-2 text-center text-gray-700">
                  Posted by: {task.postedBy}
                </p>
                <p className="text-sm text-gray-600 text-center">
                  Dept: {task.department}
                </p>
              </div>
              <div className="w-2/3">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {task.projectTitle}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {task.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {task.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>Points: {task.points}</span>
                    <span>Amount: ${task.amount}</span>
                    <span className="text-sm text-gray-500">
                      Deadline: {formatDate(task.deadline)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)} size="xl">
        <Modal.Header>
          <h3 className="text-xl font-semibold text-gray-900">
            {selectedTask?.projectTitle}
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="flex gap-6">
              <img
                src={selectedTask?.image}
                alt="Task"
                className="w-1/3 rounded-lg shadow-md"
              />
              <div className="w-2/3 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Description</h4>
                  <p className="text-gray-700 mt-1">
                    {selectedTask?.description}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Technologies</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedTask?.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Department</h4>
                    <p className="text-gray-700 mt-1">
                      {selectedTask?.department}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Posted By</h4>
                    <p className="text-gray-700 mt-1">
                      {selectedTask?.postedBy}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Points</h4>
                    <p className="text-gray-700 mt-1">{selectedTask?.points}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Amount</h4>
                    <p className="text-gray-700 mt-1">
                      ${selectedTask?.amount}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Deadline</h4>
                    <p className="text-gray-700 mt-1">
                      {formatDate(selectedTask?.deadline)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllTasks;
