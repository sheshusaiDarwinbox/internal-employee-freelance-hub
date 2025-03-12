import { useState, useEffect } from "react";
import {
  Trophy,
  CheckCircle,
  Search,
  Upload,
  ChevronRight,
  Star,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import api from "../utils/api";

const ProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-100 rounded-full h-2">
    <div
      className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);

const MyActivity = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [rewards, setRewards] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [taskProgress, setTaskProgress] = useState({});
  const [fileUploads, setFileUploads] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const authState = useSelector((state) => state.auth);
  const EID = authState?.user?.EID;

  useEffect(() => {
    const fetchTasks = async () => {
      const mockTasks = [
        {
          id: 1,
          name: "Build A Task Management System",
          progress: 10,
          dueDate: "2024-03-25",
          priority: "High",
        },
        {
          id: 2,
          name: "Design A Landing Page",
          progress: 60,
          dueDate: "2024-03-28",
          priority: "Medium",
        },
        {
          id: 3,
          name: "Develop E-Commerce Website",
          progress: 90,
          dueDate: "2024-03-30",
          priority: "Low",
        },
      ];

      const response = await api.post(
        "api/gigs/my-gigs",
        {},
        {
          withCredentials: true,
        }
      );

      console.log(response.data);
      setTasks([...mockTasks, ...response.data.docs]);
      setFilteredTasks(mockTasks);
    };

    const fetchRewards = async () => {
      if (EID) {
        try {
          setRewards(50);
        } catch (error) {
          console.error("Error fetching rewards:", error);
        }
      }
    };

    fetchTasks();
    fetchRewards();
  }, [EID]);

  const handleFilterChange = (e) => {
    const filter = e.target.value.toLowerCase();
    const filtered = tasks.filter((task) =>
      task.name.toLowerCase().includes(filter)
    );
    setFilteredTasks(filtered);
  };

  const handleProgressChange = (taskId, progress) => {
    setTaskProgress((prev) => ({
      ...prev,
      [taskId]: Math.min(progress, 100),
    }));
  };

  const handleFileChange = (taskId, files) => {
    setFileUploads((prev) => ({
      ...prev,
      [taskId]: files,
    }));
  };

  const handleSubmitTask = (taskId) => {
    alert(`Task ${taskId} submitted successfully`);
    setModalOpen(false);
  };

  const openTaskModal = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              My Activity Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                <Trophy className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-600 font-semibold">
                  {rewards} Points
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Overall Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.5</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Completed Tasks</p>
                <p className="text-2xl font-bold text-gray-900">10</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Current Tasks
                </h2>
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    onChange={handleFilterChange}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-medium text-gray-900">
                          {task.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            task.priority === "High"
                              ? "bg-red-100 text-red-700"
                              : task.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <ProgressBar
                            progress={taskProgress[task.id] || task.progress}
                          />
                        </div>
                        <span className="text-sm text-gray-500">
                          {taskProgress[task.id] || task.progress}%
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Due: {task.dueDate}
                        </span>
                        <button
                          onClick={() => openTaskModal(task)}
                          className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Update Progress
                          <ArrowUpRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Update Task Progress
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Progress
                </label>
                <input
                  type="number"
                  value={taskProgress[selectedTask.id] || selectedTask.progress}
                  onChange={(e) =>
                    handleProgressChange(selectedTask.id, e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Link
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any additional notes..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attachments
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    Drop files here or click to upload
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={(e) =>
                      handleFileChange(selectedTask.id, e.target.files)
                    }
                    className="hidden"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitTask(selectedTask.id)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyActivity;
