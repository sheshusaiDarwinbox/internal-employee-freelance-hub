import React, { useState } from "react";
import { Card, Button, Modal, TextInput, Dropdown } from "flowbite-react";
import { HiSearch, HiX } from "react-icons/hi";
import task1 from "../assets/Tasks/task1.jpg";
import task2 from "../assets/Tasks/task2.jpg";

const AllTasks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
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
        "This project involves creating a comprehensive task management system...",
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
        "This project focuses on enhancing the overall user experience...",
      tags: ["Figma", "UI/UX", "Prototyping"],
      status: "Available",
      points: 250,
      deadline: "April 10, 2025",
      amount: "$500",
    },
  ];

  const departments = [...new Set(tasks.map((task) => task.department))];
  const allSkills = [...new Set(tasks.flatMap((task) => task.tags))];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      !selectedDepartment || task.department === selectedDepartment;
    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.some((skill) => task.tags.includes(skill));

    return matchesSearch && matchesDepartment && matchesSkills;
  });

  return (
    <div className="p-6 bg-gray-50">
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <TextInput
            icon={HiSearch}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full"
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          <Dropdown label={selectedDepartment || "Select Department"}>
            <Dropdown.Item onClick={() => setSelectedDepartment("")}>
              All Departments
            </Dropdown.Item>
            {departments.map((dept) => (
              <Dropdown.Item
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
              >
                {dept}
              </Dropdown.Item>
            ))}
          </Dropdown>

          <Dropdown label="Select Skills">
            {allSkills.map((skill) => (
              <Dropdown.Item
                key={skill}
                onClick={() => {
                  setSelectedSkills((prev) =>
                    prev.includes(skill)
                      ? prev.filter((s) => s !== skill)
                      : [...prev, skill]
                  );
                }}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill)}
                    readOnly
                  />
                  {skill}
                </div>
              </Dropdown.Item>
            ))}
          </Dropdown>

          {(selectedDepartment || selectedSkills.length > 0) && (
            <Button
              color="gray"
              onClick={() => {
                setSelectedDepartment("");
                setSelectedSkills([]);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {selectedSkills.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {selectedSkills.map((skill) => (
              <span
                key={skill}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {skill}
                <HiX
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedSkills((prev) => prev.filter((s) => s !== skill))
                  }
                />
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredTasks.map((task, index) => (
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
                    <span>Amount: {task.amount}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Deadline: {task.deadline}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Task Detail Modal */}
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
                className="w-1/3 rounded-lg shadow-md object-cover"
              />
              <div className="w-2/3 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Description</h4>
                  <p className="text-gray-700 mt-1">
                    {selectedTask?.longDescription}
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
                    <p className="text-gray-700 mt-1">{selectedTask?.amount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllTasks;
