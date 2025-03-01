import { useState, useEffect, useCallback } from "react";
import ListView from "../components/ManageDepartment/ListView";
import FormView from "../components/ManageDepartment/FormView";
import { HiViewList } from "react-icons/hi";
import Loading from "../components/Loading";
import useDebounce from "../components/ManageDepartment/Debounce";
import { HiPlus } from "react-icons/hi";
import SearchInput from "../components/SearchInput";

import { Button } from "flowbite-react";
import api from "../utils/api";

const DepartmentManagement = () => {
  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 1500);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    manager: "",
    budget: "",
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const newDepartment = {
      ...formData,
      id: Date.now(),
    };
    setDepartments([...departments, newDepartment]);
    setFormData({
      name: "",
      description: "",
      location: "",
      manager: "",
      budget: "",
    });
    setView("list");
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `api/departments?search=${debouncedSearchQuery}`,
          { withCredentials: true }
        );
        setDepartments(response.data.docs);
        setError(null);
      } catch (err) {
        setError(err.message);
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [debouncedSearchQuery]);

  const handleViewChange = useCallback((newView) => {
    setView(newView);
  }, []);

  const handleUpdate = (department) => {
    setFormData(department);
    setView("form");
  };

  const handleDelete = (id) => {
    setDepartments(departments.filter((dept) => dept._id !== id));
  };

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      {/* Navigation Buttons */}
      <div className="mb-6 flex space-x-4">
        {/* <Button.Group> */}
        <Button.Group>
          <Button
            className={`${
              view === "list"
                ? "bg-[#678DC6] hover:bg-[#5a7eb4] text-white rounded-l-lg"
                : "bg-gray-200 hover:bg-gray-300 text-black rounded-l-lg"
            } transition-colors duration-200 border-0 focus:ring-0`}
            onClick={() => handleViewChange("list")}
          >
            <HiViewList className="mr-2 h-5 w-5" />
            View Departments
          </Button>
          <Button
            className={`${
              view === "form"
                ? "bg-[#678DC6] hover:bg-[#5a7eb4] text-white rounded-r-lg"
                : "bg-gray-200 hover:bg-gray-300 text-black rounded-r-lg"
            } transition-colors duration-200 border-0 focus:ring-0`}
            onClick={() => handleViewChange("form")}
          >
            <HiPlus className="mr-2 h-5 w-5" />
            Create Department
          </Button>
        </Button.Group>
      </div>

      {/* Content Area */}
      <div className="mt-4">
        {view === "list" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <SearchInput
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search Departments..."
              ></SearchInput>
            </div>
            <ListView
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
              departments={departments}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
            />
          </div>
        )}
        {view === "form" && (
          <FormView
            handleCreate={handleCreate}
            setFormData={setFormData}
            formData={formData}
          />
        )}
      </div>
    </div>
  );
};

export default DepartmentManagement;
