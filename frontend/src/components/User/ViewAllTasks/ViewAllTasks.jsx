import { Card, Button, Modal } from 'flowbite-react';
import { useState } from 'react';
import task1 from '../../../assets/Tasks/task1.jpg';
import task2 from '../../../assets/Tasks/task2.jpg';

const ViewAllTasks = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setOpenModal(true);
  };
  const tasks = [
    {
      image: task1,
      postedBy: 'John Doe',
      department: 'Engineering',
      projectTitle: 'Task Management System',
      description: 'Develop a task management system using React and Node.js',
      longDescription: 'This project involves creating a comprehensive task management system that allows users to create, edit, and delete tasks efficiently. The system will provide a user-friendly interface where tasks can be categorized, prioritized, and assigned to different users or teams. It will include features such as due date reminders, progress tracking, and collaboration tools to enhance productivity. Additionally, the system will integrate with databases to store task details securely, ensuring seamless data retrieval and management. By implementing modern web technologies, the project aims to deliver a responsive and scalable solution that can be used in various professional and personal settings.',
      tags: ['React', 'Node.js', 'MongoDB'],
      status: 'Available',
      points: 500,
      deadline: 'March 30, 2025',
      amount: '$1000',
    },
    {
      image: task2,
      postedBy: 'Jane Smith',
      department: 'Design',
      projectTitle: 'UI/UX Redesign',
      description: 'Redesign the user interface for better user experience',
      longDescription: 'This project focuses on enhancing the overall user experience by redesigning the UI of an existing application. The goal is to create a more intuitive, visually appealing, and user-friendly interface that improves usability and accessibility. By refining navigation, optimizing layouts, and implementing modern design principles, the project aims to make the application more efficient and engaging for users. The redesign will also consider user feedback, ensuring that the new interface aligns with user needs and expectations while maintaining consistency with the brand identity.',
      tags: ['Figma', 'UI/UX', 'Prototyping'],
      status: 'Available',
      points: 250,
      deadline: 'April 10, 2025',
      amount: '$500'
    }
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">View All Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task, index) => (
          <Card key={index} className="h-full">
            <div className="flex">
              <div className="w-1/3 pr-4">
                <img src={task.image} alt="Task" className="w-full rounded-lg" />
                <p className="text-sm mt-2 text-center">Posted by: {task.postedBy}</p>
                <p className="text-sm text-gray-600 text-center">Dept: {task.department}</p>
              </div>
              <div className="w-2/3">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold mb-2">{task.projectTitle}</h2>
                  <button onClick={() => handleOpenModal(task)} className="text-blue-500 text-sm">
                    View Details {`>>`}
                  </button>
                </div>
                <p className="text-gray-600 mb-4">{task.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {task.tags.map((tag, i) => (
                    <span key={i} className="bg-gray-300 px-2 py-1 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button className="bg-blue-200 text-green-900 hover:bg-green-300 rounded-full">Add Request</Button>
                  <Button className="bg-green-300 text-green-900 hover:bg-green-400 rounded-full">Refer External</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Flowbite Modal */}
            {/* Flowbite Modal */}
            <Modal 
        show={openModal} 
        onClose={() => setOpenModal(false)}
        size="lg"
        className="fixed inset-0 items-center justify-center w-1/2 p-12 mt-10 mx-auto"
      >
        <div className="bg-gray-100 w-full h-full rounded-lg shadow-lg overflow-hidden text-center">
          <div className='text-center'>
            <Modal.Header className="border-b p-4 text-lg font-semibold text-center">
              {selectedTask?.projectTitle}
            </Modal.Header>
          </div>
          <Modal.Body className="overflow-y-auto p-4">
            <div className="block text-center">
              <img 
                src={selectedTask?.image} 
                alt="Task" 
                className="w-full max-w-md mx-auto h-full object-cover rounded-lg"
              />
              <div className="mt-4 ml-5 flex justify-center items-center">
                <div className='text-left'>
                <p className="text-gray-700 mb-2">{selectedTask?.longDescription}</p>
                <p><strong>Technologies:</strong> {selectedTask?.tags.join(', ')}</p>
                <p><strong>Deadline:</strong> {selectedTask?.deadline}</p>
                <p><strong>Reward Points:</strong> {selectedTask?.points}</p>
                <p><strong>Amount:</strong> {selectedTask?.amount}</p>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-t p-4 flex justify-end">
            <Button color="gray" onClick={() => setOpenModal(false)}>Close</Button>
          </Modal.Footer>
        </div>
      </Modal>

    </div>
  );
};

export default ViewAllTasks;
