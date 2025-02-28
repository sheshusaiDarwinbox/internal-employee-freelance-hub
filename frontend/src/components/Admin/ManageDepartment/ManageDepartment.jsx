import { useState, useEffect, useCallback } from "react";
import ListView from "./ListView";
import FormView from "./FormView";
import { HiViewList } from "react-icons/hi";
import Loading from "../../../components/Loading";

import { HiPlus } from "react-icons/hi";

import { Button } from "flowbite-react";
import api from "../../../utils/api";

const DepartmentManagement = () => {
  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState([]);
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
          `api/departments?search=${searchQuery}`,
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
  }, [searchQuery]);

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
        <Button.Group>
          <Button
            color={view === "list" ? "blue" : "gray"}
            onClick={() => handleViewChange("list")}
          >
            <HiViewList className="mr-2 h-5 w-5" />
            View Departments
          </Button>
          <Button
            color={view === "form" ? "blue" : "gray"}
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
          <ListView
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            departments={departments}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
          />
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
