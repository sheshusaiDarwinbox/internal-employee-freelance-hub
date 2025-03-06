import { useState, useEffect, useCallback } from "react";
import { Button, TextInput, Select, Modal, Table } from "flowbite-react";
import { HiSearch, HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import api from "../utils/api";
import { Label } from "flowbite-react";
import SearchableSelect from "../components/SearchableSelect";
import PaginationControls from "../components/PaginationControl";

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

  const fetchDepartments = async (search) => {
    const response = await api.get(`api/departments/?search=${search}`, {
      withCredentials: true,
    });
    return response.data.docs;
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
        <Table>
          <Table.Head>
            <Table.HeadCell>Title</Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell>Salary</Table.HeadCell>
            <Table.HeadCell>Department</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {positions.map((position, index) => (
              <Table.Row
                key={position.PID}
                className={`
      border-b border-gray-200 transition-colors duration-150 hover:bg-gray-50
      ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
    `}
              >
                <Table.Cell className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {position.title}
                    </span>
                    <span className="text-sm text-gray-500">
                      ID: {position.PID}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell className="px-6 py-4">
                  <span
                    className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${position.type === "FullTime" ? "bg-green-100 text-green-800" : ""}
        ${position.type === "PartTime" ? "bg-blue-100 text-blue-800" : ""}
        ${position.type === "Contract" ? "bg-yellow-100 text-yellow-800" : ""}
        ${position.type === "Temporary" ? "bg-orange-100 text-orange-800" : ""}
        ${position.type === "Internship" ? "bg-purple-100 text-purple-800" : ""}
      `}
                  >
                    {PositionTypeEnum[position.type]}
                  </span>
                </Table.Cell>
                <Table.Cell className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-medium">
                      ₹
                    </div>
                    <span className="ml-2 text-gray-900 font-medium">
                      {position.salary?.toLocaleString() || "N/A"}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium">
                      {position.department?.name?.charAt(0)}
                    </div>
                    <span className="ml-2 text-gray-900">
                      {position.department?.name}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell className="px-6 py-4">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-amber-50 hover:bg-amber-100 text-amber-600 border-0"
                      onClick={() => {
                        setSelectedPosition(position);
                        setFormData(position);
                        setShowForm(true);
                      }}
                    >
                      <HiPencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-50 hover:bg-red-100 text-red-600 border-0"
                      onClick={() => {
                        setSelectedPosition(position);
                        setShowDeleteModal(true);
                      }}
                    >
                      <HiTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <PaginationControls
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          currentPage={currentPage}
          loading={loading}
        />
      </div>

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
              <SearchableSelect
                onChange={(e) =>
                  setFormData({ ...formData, DID: e.target.value })
                }
                required
                fetchOptions={fetchDepartments}
                labelKey="name"
                valueKey="DID"
                placeholder="Search departments..."
              />
            </div>
            <Button type="submit">Save Position</Button>
          </form>
        </Modal.Body>
      </Modal>

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