import { Card, Button, Modal } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchTasksAsync } from '../../../redux/slices/tasksSlice';
import task1 from '../../../assets/Tasks/task1.jpg';
import task2 from '../../../assets/Tasks/task2.jpg';

const ViewAllTasks = () => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setOpenModal(true);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await dispatch(fetchTasksAsync());
      const tasksData = await Promise.all(response.payload.docs.map(async (task) => {
        // Fetch manager details using the managerId from the task object
        
        return {
          image: Math.random() < 0.5 ? task1 : task2,
          postedBy: "Manager", // Use the fetched manager's name
          department: task.department, // Assuming department is directly available in the task object
          projectTitle: task.projectTitle,
          description: task.description,
          longDescription: task.longDescription,
          tags: task.skillsRequired,
          status: task.ongoingStatus,
          points: task.points,
          deadline: task.deadline,
          amount: task.amount,
        };
      }));
      setTasks(tasksData);
    };

    fetchTasks();
  }, [dispatch]);

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
                <p className="text-gray-700 mb-2">{selectedTask?.description}</p>
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
      {/* <Modal 
        show={openModal} 
        onClose={() => setOpenModal(false)}
        size="lg"
        className="fixed inset-0 items-center justify-center w-1/2 p-12 mt-10 mx-auto"
      >
        <div className="bg-gray-100 w-full h-full rounded-lg shadow-lg overflow-hidden text-center">
          <div className='text-center'>
            <Modal.Header className="border-b p-4">
              <h3 className="text-xl font-bold">{selectedTask?.projectTitle}</h3>
            </Modal.Header>
            <Modal.Body>
              <p>{selectedTask?.longDescription}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setOpenModal(false)}>Close</Button>
            </Modal.Footer>
          </div>
        </div>
      </Modal> */}
    </div>
  );
};

export default ViewAllTasks;
