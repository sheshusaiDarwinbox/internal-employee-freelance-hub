import { Card } from 'flowbite-react';
import task1 from '../../../assets/Tasks/task1.jpg';
import task2 from '../../../assets/Tasks/task2.jpg';

const MyTasks = () => {
  const tasks = [
    {
      image: task1,
      postedBy: 'John Doe',
      department: 'Engineering',
      projectTitle: 'Task Management System',
      description: 'Develop a task management system using React and Node.js',
      longDescription: 'This project involves creating a comprehensive task management system that allows users to create, edit, and delete tasks.',
      tags: ['React', 'Node.js', 'MongoDB'],
      status: 'Completed',
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
      longDescription: 'This project focuses on improving the user experience by redesigning the UI of an existing application.',
      tags: ['Figma', 'UI/UX', 'Prototyping'],
      status: 'Pending',
      points: 250,
      deadline: 'April 10, 2025',
      amount: '$500',
    }
  ];


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
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
                </div>
                <p className="text-gray-600 mb-4">{task.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {task.tags.map((tag, i) => (
                    <span key={i} className="bg-gray-200 px-2 py-1 rounded text-sm">{tag}</span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {task.status}
                  </span>
                  <span className="text-lg font-semibold">{task.points} Points</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>



    </div>
  );
};

export default MyTasks;
