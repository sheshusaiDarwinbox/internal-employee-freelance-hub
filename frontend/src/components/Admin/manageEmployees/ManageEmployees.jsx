import { useNavigate } from "react-router-dom";

const ManageEmployees = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-lg mx-auto text-center">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Manage Employees</h1>
      <p className="text-gray-600 mb-6">Add new employees or view and manage existing employees.</p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          className="px-6 py-3 w-full sm:w-auto bg-blue-400 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105"
          onClick={() => navigate('/admin/manageEmployees/createEmployee')}
        >
          ➕ Add Employee
        </button>
        <button
          className="px-6 py-3 w-full sm:w-auto bg-green-400 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-transform transform hover:scale-105"
          onClick={() => navigate('/admin/manageEmployees/viewEmployees')}
        >
          👥 View All Employees
        </button>
      </div>
    </div>
  );
};

export default ManageEmployees;
