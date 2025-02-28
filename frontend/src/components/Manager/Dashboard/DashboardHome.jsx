import { Alert, Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

const DashboardHome = () => {
  const navigate = useNavigate();

  return (

    <div className="flex flex-col items-center p-8 w-full">
      <Alert color="success" className="mb-6 shadow-sm text-center w-full">
        Welcome, Manager! Oversee users and tasks efficiently.
      </Alert>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Manage Users & Tasks
      </h2>
      <p className="text-gray-600 text-center max-w-lg">
        As a manager, you can assign tasks, monitor progress, and oversee the team’s performance. Keep everything organized and ensure smooth workflow.
      </p>

      <div className="mt-6 flex space-x-4">
        <Button className="w-full px-10 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105 text-2xl" onClick={()=>navigate('/manager/post-task')}>
          Post a Task
        </Button>
      </div>
    </div>
  );
};

export default DashboardHome;
