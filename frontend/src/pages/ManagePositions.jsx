import { useState, useEffect, useCallback } from "react";
import { Button, TextInput, Select, Modal } from "flowbite-react";
import { HiSearch, HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import api from "../utils/api";
import { Label } from "flowbite-react";
import SearchableSelect from "../components/SearchableSelect";

const PositionTypeEnum = {
  FullTime: "Full Time",
  PartTime: "Part Time",
  Internship: "Internship",
  Temporary: "Temporary",
  Freelance: "Freelance",
  Contract: "Contract",
  Other: "Other",
};

const ManagePositions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "FullTime",
    salary: 0,
    DID: "",
  });

  const fetchPositions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        search: searchQuery,
        type: selectedType,
      });

      const response = await api.get(`api/positions?${params}`, {
        withCredentials: true,
      });

      setPositions(response.data.docs);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Failed to fetch positions");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedType]);

  const handleSubmit = async (e) => {
    console.log("hello position submit");
    e.preventDefault();
    try {
      await api.post(`api/positions/create`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      fetchPositions();
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError("Failed to save position");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/positions/${selectedPosition.PID}`, {
        withCredentials: true,
      });
      fetchPositions();
      setShowDeleteModal(false);
    } catch (err) {
      setError("Failed to delete position");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "FullTime",
      salary: "",
      DID: "",
    });
    setSelectedPosition(null);
  };

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Positions</h1>
        <Button onClick={() => setShowForm(true)}>
          <HiPlus className="mr-2" /> Create Position
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <TextInput
          icon={HiSearch}
          placeholder="Search positions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">All Types</option>
          {Object.entries(PositionTypeEnum).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Salary</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
              <tr key={position.PID}>
                <td className="px-4 py-2">{position.title}</td>
                <td className="px-4 py-2">{PositionTypeEnum[position.type]}</td>
                <td className="px-4 py-2">{position.salary}</td>
                <td className="px-4 py-2">{position.department.name}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedPosition(position);
                        setFormData(position);
                        setShowForm(true);
                      }}
                    >
                      <HiPencil />
                    </Button>
                    <Button
                      size="sm"
                      color="failure"
                      onClick={() => {
                        setSelectedPosition(position);
                        setShowDeleteModal(true);
                      }}
                    >
                      <HiTrash />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Position Form Modal */}
      <Modal
        show={showForm}
        onClose={() => {
          setShowForm(false);
          resetForm();
        }}
      >
        <Modal.Header>
          {selectedPosition ? "Edit Position" : "Create Position"}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title</Label>
              <TextInput
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Description</Label>
              <TextInput
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                required
              >
                {Object.entries(PositionTypeEnum).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Salary</Label>
              <TextInput
                type="number"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Department</Label>
              {/* <Select
                value={formData.DID}
                onChange={(e) =>
                  setFormData({ ...formData, DID: e.target.value })
                }
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </Select> */}
              <SearchableSelect
                value={formData.DID}
                onChange={(e) =>
                  setFormData({ ...formData, DID: e.target.value })
                }
                required
              />
            </div>
            <Button type="submit">Save Position</Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Modal.Header>Delete Position</Modal.Header>
        <Modal.Body>Are you sure you want to delete this position?</Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={handleDelete}>
            Delete
          </Button>
          <Button color="gray" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManagePositions;