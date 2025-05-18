import { useState, useEffect, useCallback, useRef } from "react";
import { Button, TextInput, Select, Modal, Label, Table } from "flowbite-react";
import { Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import {
  HiSearch,
  HiPlus,
  HiUpload,
  HiX,
  HiCheck,
  HiPencil,
  HiTrash,
} from "react-icons/hi";
import { Toast } from "flowbite-react";
import * as XLSX from "xlsx";
import api from "../utils/api";
import useDebounce from "../components/ManageDepartment/Debounce";
import z from "zod";
import SearchableSelect from "../components/SearchableSelect";
import Loading from "../components/Loading";
import PaginationControls from "../components/PaginationControl";

const UserRole = {
  Employee: "Employee",
  Other: "Other",
  Admin: "Admin",
  Manager: "Manager",
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [excelData, setExcelData] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  const debouncedSearchQuery = useDebounce(searchQuery);
  const [pageSize] = useState(10);
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/api/users/${selectedUser.EID}`, {
        withCredentials: true,
      });
      setUsers(users.filter((user) => user.EID !== selectedUser.EID));
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    email: "",
    role: "Employee",
    PID: "",
    DID: "",
    ManagerID: "",
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        search: debouncedSearchQuery,
        role: selectedRole,
        limit: 10,
      });

      const response = await api.get(`api/users?${params}`, {
        withCredentials: true,
      });
      setUsers(response.data.docs);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchQuery, selectedRole, pageSize]);

  const fetchDepartments = async (search) => {
    const response = await api.get(`api/departments/?search=${search}`, {
      withCredentials: true,
    });
    return response.data.docs;
  };

  const fetchPositions = async (search) => {
    const response = await api.get(`api/positions/?search=${search}`, {
      withCredentials: true,
    });
    return response.data.docs;
  };

  const fetchManagers = async (search) => {
    const response = await api.get(
      `api/users/?types=Manager,Admin&search=${search}`,
      {
        withCredentials: true,
      }
    );
    return response.data.docs;
  };

  useEffect(() => {
    fetchUsers();
    return () => {
      setUsers([]);
      setError(null);
    };
  }, [fetchUsers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validatedData = userSchema.parse(formData);

      setLoading(true);

      await api.post(`api/users/create`, [validatedData], {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setUsers(
        users.map((user) =>
          user.EID === formData.EID ? { ...user, ...validatedData } : user
        )
      );
      <Toast>
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
          <HiCheck className="h-5 w-5" />
        </div>
        <div className="ml-3 text-sm font-normal">
          User created successfully
        </div>
      </Toast>;

      setFormData({
        email: "",
        role: "Employee",
        DID: "",
        PID: "",
        ManagerID: "",
      });
      setShowForm(false);

      fetchUsers();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message);
        <Toast>
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">
            <HiX className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">
            {errorMessages || "Failed to save user"}
          </div>
        </Toast>;
      } else {
        <Toast>
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">
            <HiX className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">
            {error.message || "Failed to save user"}
          </div>
        </Toast>;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const buffer = event.target.result;
        const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet);

        if (validateUserData(data)) {
          setExcelData(data);
          setPreviewData(data);
          setIsPreviewMode(true);
          setUploadError(null);
        } else {
          setUploadError("Invalid format. Required fields missing");
        }
      } catch (error) {
        console.error(error);
        setUploadError("Error processing file");
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleBulkCreate = async () => {
    if (!previewData?.length) return;

    try {
      setLoading(true);
      await api.post("/api/users/bulk", { users: previewData });
      fetchUsers();
    } catch (error) {
      console.error(error);
      setError("Failed to create users");
    } finally {
      setLoading(false);
    }
  };

  const userSchema = z.object({
    email: z.string().email({ message: "Invalid email" }),
    role: z.enum(["Admin", "Employee", "Manager", "Other"]),
    DID: z.string().regex(/^[a-zA-Z0-9]+$/, {
      message: "Department ID must be alphanumeric",
    }),
    PID: z
      .string()
      .regex(/^[a-zA-Z0-9]+$/, { message: "Position ID must be alphanumeric" }),
    ManagerID: z
      .string()
      .regex(/^[a-zA-Z0-9]+$/, { message: "Manager ID must be alphanumeric" }),
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>

        <div className="flex items-center gap-4">
          {!isPreviewMode && (
            <Button onClick={() => setShowForm(true)}>
              <HiPlus className="mr-2" /> Create User
            </Button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="hidden"
            id="fileUpload"
          />
          {/* <label
            htmlFor="fileUpload"
            className="cursor-pointer flex items-center gap-2 bg-blue-50 text-slate-600 px-4 py-2 rounded-lg hover:bg-blue-100"
          >
            <HiUpload className="w-5 h-5" />
            Upload Excel/CSV
          </label> */}
        </div>
      </div>

      {!isPreviewMode && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <TextInput
            icon={HiSearch}
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">All Roles</option>
            {Object.entries(UserRole).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </Select>
        </div>
      )}

      {!isPreviewMode && (
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Role</Table.HeadCell>
              <Table.HeadCell>Department</Table.HeadCell>
              <Table.HeadCell>Position</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {users.map((user, index) => (
                <Table.Row
                  key={user.EID}
                  className={`
          border-b border-gray-200 transition-colors duration-150 hover:bg-gray-50
          ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
        `}
                >
                  <Table.Cell className="px-6 py-4">
                    <div className="flex flex-col">
                      <span //className="font-medium text-gray-900"
                        className="hover:underline hover:cursor-pointer font-extrabold text-base text-slate-500"
                        onClick={() => {
                          navigate(`/admin/users/${user.EID}`);
                        }}
                      >
                        {user.fullName}
                      </span>
                      <span className="text-sm text-gray-500">
                        ID: {user.EID}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="px-6 py-4">
                    <span className="text-gray-600">{user.email}</span>
                  </Table.Cell>
                  <Table.Cell className="px-6 py-4">
                    <span
                      className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${user.role === "Admin" ? "bg-purple-100 text-purple-800" : ""}
            ${user.role === "Manager" ? "bg-blue-100 text-blue-800" : ""}
            ${user.role === "Employee" ? "bg-green-100 text-green-800" : ""}
            ${user.role === "Other" ? "bg-gray-100 text-gray-800" : ""}
          `}
                    >
                      {user.role}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="ml-2 text-gray-900">{user.DID}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="ml-2 text-gray-900">{user.PID}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="px-6 py-4">
                    <span
                      className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${
              user.verified
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }
          `}
                    >
                      {user?.verified ? "verified" : "unverified"}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-amber-50 hover:bg-amber-100 text-amber-600 border-0"
                        onClick={() => {
                          setFormData(user);
                          setShowForm(true);
                        }}
                      >
                        <HiPencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-50 hover:bg-red-100 text-red-600 border-0"
                        onClick={() => {
                          setSelectedUser(user);
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
      )}

      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Body>
          <div className="p-6">
            <p className="text-gray-700">
              Are you sure you want to delete user{" "}
              <span className="font-semibold">{selectedUser?.fullName}</span>?
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <Button
              color="gray"
              onClick={() => setShowDeleteModal(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button color="failure" onClick={handleDelete} disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal show={showForm} onClose={() => setShowForm(false)} size="xl">
        <Modal.Header>
          {formData.EID ? "Edit User" : "Create User"}
        </Modal.Header>

        {loading ? (
          <Loading />
        ) : (
          <Modal.Body>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <TextInput
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label>Role</Label>
                <Select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                  <option value="Other">Other</option>
                </Select>
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
              <div>
                <Label>Position</Label>
                <SearchableSelect
                  onChange={(e) =>
                    setFormData({ ...formData, PID: e.target.value })
                  }
                  required
                  fetchOptions={fetchPositions}
                  labelKey="title"
                  valueKey="PID"
                  placeholder="Search Positions..."
                />
              </div>
              <div>
                <Label>Manager</Label>

                <SearchableSelect
                  onChange={(e) =>
                    setFormData({ ...formData, ManagerID: e.target.value })
                  }
                  required
                  fetchOptions={fetchManagers}
                  labelKey="fullName"
                  valueKey="EID"
                  placeholder="Search Managers..."
                />
              </div>
              <div className="col-span-2 flex justify-end gap-2">
                <Button color="gray" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" color="blue">
                  {formData.EID ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Modal.Body>
        )}
      </Modal>
    </div>
  );
};

export default ManageUsers;
