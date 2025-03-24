import { useState, useEffect, useCallback, useRef } from "react";
import { Button, TextInput, Select, Modal, Label, Table, Checkbox } from "flowbite-react";
import { Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import {
  HiX,
  HiSearch,
  HiPlus,
  HiUpload,
  HiPencil,
  HiTrash,
} from "react-icons/hi";
import * as XLSX from "xlsx";
import api from "../utils/api";
import useDebounce from "../components/ManageDepartment/Debounce";
import z from "zod";
import SearchableSelect from "../components/SearchableSelect";
import Loading from "../components/Loading";
import PaginationControls from "../components/PaginationControl";
import { Toast } from "flowbite-react";

const UserRole = {
  Employee: "Employee",
  Other: "Other",
  Admin: "Admin",
  Manager: "Manager",
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const fileInputRef = useRef(null);
  const debouncedSearchQuery = useDebounce(searchQuery);
  const [pageSize] = useState(10);
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [departmentNames, setDepartmentNames] = useState({});
  const [positionNames, setPositionNames] = useState({});

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("error"); // "error" or "success"
  const [toastProgress, setToastProgress] = useState(100);


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
      setToastMessage("Failed to delete user.");
      setToastType("error");
      setShowToast(true);
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
        limit: pageSize,
      });

      const response = await api.get(`api/users?${params}`, {
        withCredentials: true,
      });
      setUsers(response.data.docs);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching users:", err);
      setToastMessage("Failed to fetch users.");
      setToastType("error");
      setShowToast(true);
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

  const getDepartmentName = async (DID) => {
    if (!DID) return "";
    if (departmentNames[DID]) return departmentNames[DID];

    try {
      const response = await api.get(`api/departments/${DID}`, {
        withCredentials: true,
      });
      setDepartmentNames((prev) => ({ ...prev, [DID]: response.data.name }));
      return response.data.name;
    } catch (error) {
      console.error("Error fetching department name:", error);
      return DID;
    }
  };

  const getPositionName = async (PID) => {
    if (!PID) return "";
    if (positionNames[PID]) return positionNames[PID];

    try {
      const response = await api.get(`api/positions/${PID}`, {
        withCredentials: true,
      });
      setPositionNames((prev) => ({ ...prev, [PID]: response.data.title }));
      return response.data.title;
    } catch (error) {
      console.error("Error fetching position name:", error);
      return PID;
    }
  };

  useEffect(() => {
    fetchUsers();
    return () => {
      setUsers([]);
    };
  }, [fetchUsers, currentPage]);

  useEffect(() => {
    if (showToast) {
      const timer = setInterval(() => {
        setToastProgress((prev) => prev - 1);
      }, 30); // Adjust speed as needed

      setTimeout(() => {
        setShowToast(false);
      }, 3000);

      return () => clearInterval(timer);
    }
    setToastProgress(100);
  }, [showToast]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("handleSubmit called");
    try {
      const validatedData = userSchema.parse(formData);
      
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
      setToastMessage("User created successfully");
      setToastType("success");
      setShowToast(true);
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
        setToastMessage(errorMessages.join(", ") || "Failed to save user");
        setToastType("error");
      } else if (error.response && error.response.status === 500) {
        setToastMessage("Internal server error. Please try again.");
        setToastType("error");
      } else {
        setToastMessage(error.message || "Failed to save user");
        setToastType("error");
      }
    } finally {
      setShowToast(true);
      console.log("Loading set to false");
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
          setPreviewData(data.map(user => ({ ...user, selected: false, isEditing: false })));
          setIsPreviewMode(true);
        } else {
          setToastMessage("Invalid data format in Excel/CSV file.");
          setToastType("error");
          setShowToast(true);
        }
      } catch (error) {
        console.error(error);
        setToastMessage("Failed to process file.");
        setToastType("error");
        setShowToast(true);
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
      const selectedUsers = previewData.filter((user) => user.selected);
      const response = await api.post("/api/users/create", selectedUsers,{
        withCredentials:true
      }); //send array instead of object.
      if (response.status === 201) {
        fetchUsers();
        setIsPreviewMode(false);
        setPreviewData(null);
        setToastMessage("Users created successfully");
        setToastType("success");
        setShowToast(true);
      } else if (response.response && response.response.status === 500) {
        setToastMessage("Internal server error. Please try again.");
        setToastType("error");
        setShowToast(true);
      } else {
        setToastMessage("Failed to create users.");
        setToastType("error");
        setShowToast(true);
      }
    } catch (error) {
      console.error(error);
      setToastMessage("Failed to create users" );
      setToastType("error");
      setShowToast(true);
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

  const validateUserData = (data) => {
    if (!Array.isArray(data)) return false;
    
    for (const item of data) {
      if (
        !item.email ||
        !item.role ||
        !item.DID ||
        !item.PID ||
        !item.ManagerID
      ) {
        return false;
      }
    }
    return true;
  }
  
  const handleCheckboxChange = (index) => {
    setPreviewData(prev => prev.map((item, idx) => {
      if (idx === index) {
        return {...item, selected: !item.selected};
      }
      return item;
    }));
  };

  const handleEdit = (index) => {
    setPreviewData(prev => prev.map((item, idx) => {
      if (idx === index) {
        return {...item, isEditing: true};
      }
      return item;
    }));
  };

  const handleSave = (index, updatedUser) => {
    setPreviewData(prev => prev.map((item, idx) => {
      if (idx === index) {
        return {...updatedUser, isEditing: false};
      }
      return item;
    }));
  };

  const handleDeletePreview = (index) => {
    setPreviewData(prev => prev.filter((_, idx) => idx !== index));
  };
  

  return (
    <>
      {showToast && (
      <Toast>
        <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toastType === "success" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"}`}>
          {toastType === "success" ? <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> : <HiX className="h-5 w-5" />}
        </div>
        <div className="ml-3 text-sm font-normal">
          {toastMessage}
        </div>
        {/* Add a relative wrapper for the timer bar */}
        <div className="ml-auto flex-shrink-0 relative">
          <div className="absolute right-0 bottom-0 h-1 w-full bg-gray-200">
            <div className={`h-1 bg-${toastType === "success" ? "green" : "red"}-500`} style={{ width: `${toastProgress}%` }}></div>
          </div>
        </div>
      </Toast>
    )}
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>

        <div className="flex items-center gap-4">
        {isPreviewMode && (
          <div>
            <h2 className="text-lg font-bold">Preview Users</h2>
            <Table>
              <Table.Head>
                <Table.HeadCell>Select</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Role</Table.HeadCell>
                <Table.HeadCell>Department</Table.HeadCell>
                <Table.HeadCell>Position</Table.HeadCell>
                <Table.HeadCell>Manager ID</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {previewData.map((user, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Checkbox checked={user.selected} onChange={() => handleCheckboxChange(index)} />
                    </Table.Cell>
                    {user.isEditing ? (
                      <>
                        <Table.Cell><TextInput value={user.email} onChange={(e) => handleSave(index, {...user, email: e.target.value})} /></Table.Cell>
                        <Table.Cell><TextInput value={user.role} onChange={(e) => handleSave(index, {...user, role: e.target.value})} /></Table.Cell>
                        <Table.Cell><TextInput value={user.DID} onChange={(e) => handleSave(index, {...user, DID: e.target.value})} /></Table.Cell>
                        <Table.Cell><TextInput value={user.PID} onChange={(e) => handleSave(index, {...user, PID: e.target.value})} /></Table.Cell>
                        <Table.Cell><TextInput value={user.ManagerID} onChange={(e) => handleSave(index, {...user, ManagerID: e.target.value})} /></Table.Cell>
                        <Table.Cell>
                          <Button size="sm" onClick={() => handleSave(index, user)}>Save</Button>
                        </Table.Cell>
                      </>
                    ) : (
                      <>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>{user.role}</Table.Cell>
                        <Table.Cell>{user.DID}</Table.Cell>
                        <Table.Cell>{user.PID}</Table.Cell>
                        <Table.Cell>{user.ManagerID}</Table.Cell>
                        <Table.Cell className="flex gap-3">
                          <Button size="sm" onClick={() => handleEdit(index)}>Edit</Button>
                          <Button size="sm" color="red" onClick={() => handleDeletePreview(index)}>Delete</Button>
                        </Table.Cell>
                      </>
                    )}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <Button onClick={handleBulkCreate} className="mt-4">Add Selected Users</Button>
            <Button onClick={() => setIsPreviewMode(false)} className="mt-4 ml-2">Cancel</Button>
          </div>
        )}
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
          <label
            htmlFor="fileUpload"
            className="cursor-pointer flex items-center gap-2 bg-blue-50 text-slate-600 px-4 py-2 rounded-lg hover:bg-blue-100"
          >
            <HiUpload className="w-5 h-5" />
            Upload Excel/CSV
          </label>
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
                        <span className="ml-2 text-gray-900">
                          {loading ? (
                            <Spinner size="sm" />
                          ) : (
                            getDepartmentName(user.DID)
                          )}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="ml-2 text-gray-900">
                          {loading ? (
                            <Spinner size="sm" />
                          ) : (
                            getPositionName(user.PID)
                          )}
                        </span>
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
                    onChange={(e) =>{
                      console.log("Email onChange called");
                      setFormData({ ...formData, email: e.target.value });
                    }
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
      </>
    );
  };
  
  export default ManageUsers;
