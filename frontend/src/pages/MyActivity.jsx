import { useState, useEffect, useRef } from "react";
import {
  Trophy,
  CheckCircle,
  Search,
  Upload,
  Star,
  Clock,
  ArrowUpRight,
  X,
  Loader2,
} from "lucide-react";
import { useSelector } from "react-redux";
import api from "../utils/api";
import { formatDate } from "../utils/dateUtils";

const ProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-100 rounded-full h-2">
    <div
      className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-8 flex flex-col items-center">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
      <p className="text-gray-700 font-medium">Uploading files...</p>
    </div>
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
  const [searchTerm, setSearchTerm] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const user = useSelector((state) => state.auth.user);
  const EID = user?.EID;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.post(
          "api/gigs/my-gigs",
          {},
          {
            withCredentials: true,
          }
        );
        setTasks(response.data.docs);
        console.log(user);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchRewards = async () => {
      if (EID) {
        try {
          setRewards(user.freelanceRewardPoints || 0);
        } catch (error) {
          console.error("Error fetching rewards:", error);
        }
      }
    };

    fetchTasks();
    fetchRewards();
  }, [EID]);

  useEffect(() => {
    const filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(filtered);
  }, [tasks, searchTerm]);

  const handleFilterChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleProgressChange = (taskId, progress) => {
    const numProgress = parseInt(progress, 10);
    if (!isNaN(numProgress)) {
      setTaskProgress((prev) => ({
        ...prev,
        [taskId]: Math.min(Math.max(numProgress, 0), 100),
      }));
    }
  };

  const handleFileChange = (taskId, files) => {
    const fileArray = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFileUploads((prev) => ({
      ...prev,
      [taskId]: [...(prev[taskId] || []), ...fileArray],
    }));
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e, taskId) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(taskId, files);
    }
  };

  const removeFile = (taskId, fileIndex) => {
    setFileUploads((prev) => {
      const updatedFiles = [...prev[taskId]];
      URL.revokeObjectURL(updatedFiles[fileIndex].preview);
      updatedFiles.splice(fileIndex, 1);
      return {
        ...prev,
        [taskId]: updatedFiles,
      };
    });
  };

  const handleSubmitTask = async (taskId) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("work_percentage", taskProgress[taskId]);
      formData.append("description", description);
      formData.append("subject", subject);

      // Append all files from the fileUploads array for this task
      if (fileUploads[taskId] && fileUploads[taskId].length > 0) {
        fileUploads[taskId].forEach((fileObj) => {
          formData.append(`files`, fileObj.file);
        });
      }

      await api.post(`api/gigs/${taskId}/update-progress`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      // Clean up file previews
      if (fileUploads[taskId]) {
        fileUploads[taskId].forEach((fileObj) => {
          URL.revokeObjectURL(fileObj.preview);
        });
      }

      // Reset the form
      setModalOpen(false);
      setSelectedTask(null);
      setFileUploads((prev) => ({
        ...prev,
        [taskId]: [],
      }));
      setDescription("");
      setSubject("");

      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openTaskModal = (task) => {
    setSelectedTask(task);
    setTaskProgress((prev) => ({
      ...prev,
      [task._id]: task.progressTracking.work_percentage || 0,
    }));
    setFileUploads((prev) => ({
      ...prev,
      [task._id]: prev[task._id] || [],
    }));
    setDescription("");
    setSubject("");
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isSubmitting && <LoadingOverlay />}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Overall Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user.freelanceRating || 0}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {user.gigsCompleted || 0}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {
                    tasks.filter(
                      (t) =>
                        t.progressTracking.work_percentage > 0 &&
                        t.progressTracking.work_percentage < 100
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

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
                    value={searchTerm}
                    onChange={handleFilterChange}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-medium text-gray-900">
                          {task.title}
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
                            progress={
                              task.progressTracking[
                                task.progressTracking.length - 1
                              ]?.work_percentage || 0
                            }
                          />
                        </div>
                        <span className="text-sm text-gray-500">
                          {task.progressTracking[
                            task.progressTracking.length - 1
                          ]?.work_percentage || 0}
                          %
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Due: {formatDate(task.deadline)}
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
                  value={taskProgress[selectedTask._id] || 0}
                  onChange={(e) =>
                    handleProgressChange(selectedTask._id, e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  placeholder="Enter subject..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any additional notes..."
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attachments
                </label>
                <div
                  className={`border-2 cursor-pointer border-dashed rounded-lg p-4 transition-colors ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, selectedTask._id)}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    onChange={(e) =>
                      handleFileChange(selectedTask._id, e.target.files)
                    }
                    className="hidden"
                  />
                  <div className="text-center">
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Drop files here or click to upload
                    </p>
                  </div>
                </div>
                {fileUploads[selectedTask._id]?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {fileUploads[selectedTask._id].map((fileObj, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <span className="text-sm text-gray-600 truncate">
                          {fileObj.file.name}
                        </span>
                        <button
                          onClick={() => removeFile(selectedTask._id, index)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setSelectedTask(null);
                  setDescription("");
                  setSubject("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitTask(selectedTask._id)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyActivity;
