import { useState, useEffect, useCallback, useRef } from "react";
import ListView from "../components/ManageDepartment/ListView";
import FormView from "../components/ManageDepartment/FormView";
import { HiViewList } from "react-icons/hi";
import Loading from "../components/Loading";
import useDebounce from "../components/ManageDepartment/Debounce";
import PaginationControls from "../components/PaginationControl";
import { HiPlus, HiUpload, HiX, HiCheck } from "react-icons/hi";
import SearchInput from "../components/SearchInput";
import * as XLSX from "xlsx";

import { Button } from "flowbite-react";
import api from "../utils/api";

const DepartmentFunctions = {
  Engineering: "Engineering",
  Product: "Product",
  Finance: "Finance",
  Marketing: "Marketing",
  Sales: "Sales",
  CustomerSupport: "CustomerSupport",
  Other: "Other",
};

const DepartmentManagement = () => {
  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 1500);
  const fileInputRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(6);
  const [excelData, setExcelData] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    function: "Engineering",
    teamSize: 0,
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const buffer = event.target.result;
        const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        if (validateData(data)) {
          setExcelData(data);
          setPreviewData(data);
          setIsPreviewMode(true);
          setUploadError(null);
        } else {
          setUploadError(
            "Invalid format. Required fields: name, description, function"
          );
        }
      } catch (error) {
        setUploadError("Error processing file. Please check the format.");
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const validateData = (data) => {
    return data.every(
      (row) =>
        row.name &&
        row.description &&
        Object.values(DepartmentFunctions).includes(row.function)
    );
  };

  const handleExcelEdit = (index, field, value) => {
    const updatedData = [...previewData];
    updatedData[index][field] = value;
    setPreviewData(updatedData);
  };

  const handleBulkCreate = async () => {
    if (!previewData?.length) return;

    try {
      setLoading(true);
      await api.post("/departments/bulk", { departments: previewData });
      const response = await api.get("/departments");
      setDepartments(response.data);
      cancelPreview();
    } catch (error) {
      setError("Failed to create departments");
    } finally {
      setLoading(false);
    }
  };

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
      function: "Engineering",
    });
    setView("list");
  };

  const cancelPreview = () => {
    setExcelData(null);
    setPreviewData(null);
    setIsPreviewMode(false);
    setUploadError(null);
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: pageSize.toString(),
          search: searchQuery,
        });

        const response = await api.get(`/api/departments?${params}`, {
          withCredentials: true,
        });
        setDepartments(response.data.docs);
        setTotalPages(Math.ceil(response.data.totalDocs / pageSize));
        setError(null);
      } catch (err) {
        setError("Failed to fetch departments");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [debouncedSearchQuery, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleViewChange = useCallback((newView) => {
    setView(newView);
  }, []);

  const handleUpdate = (department) => {
    setFormData(department);
    setView("form");
  };

  const handleDelete = async (DID) => {
    const response = await api.delete(`api/departments/${DID}`, {
      withCredentials: true,
    });
    setDepartments(departments.filter((dept) => dept.DID !== DID));
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Departments</h1>

        {!isPreviewMode && (
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
        )}
      </div>

      <div className="mb-6">
        {uploadError && (
          <div className="mt-2 text-red-500 text-sm flex items-center gap-1">
            <HiX className="w-4 h-4" />
            {uploadError}
          </div>
        )}

        {previewData && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Preview Departments</h2>
              <div className="flex gap-2">
                <Button
                  color="success"
                  onClick={handleBulkCreate}
                  disabled={loading}
                >
                  <HiCheck className="w-5 h-5 mr-2" />
                  Create {previewData.length} Departments
                </Button>
                <Button color="gray" onClick={cancelPreview}>
                  <HiX className="w-5 h-5 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left border border-gray-200">
                      Name
                    </th>
                    <th className="p-3 text-left border border-gray-200">
                      Description
                    </th>
                    <th className="p-3 text-left border border-gray-200">
                      Function
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3 border border-gray-200">
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) =>
                            handleExcelEdit(index, "name", e.target.value)
                          }
                          className="w-full p-1 border border-gray-200 rounded"
                        />
                      </td>
                      <td className="p-3 border border-gray-200">
                        <input
                          type="text"
                          value={row.description}
                          onChange={(e) =>
                            handleExcelEdit(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full p-1 border border-gray-200 rounded"
                        />
                      </td>
                      <td className="p-3 border border-gray-200">
                        <select
                          value={row.function}
                          onChange={(e) =>
                            handleExcelEdit(index, "function", e.target.value)
                          }
                          className="w-full p-1 border border-gray-200 rounded"
                        >
                          {Object.values(DepartmentFunctions).map((func) => (
                            <option key={func} value={func}>
                              {func}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-4">
          {!isPreviewMode && view === "list" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <SearchInput
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search Departments..."
                />
              </div>
              <ListView
                searchQuery={searchQuery}
                departments={departments}
                handleUpdate={(updatedDept) => {
                  setDepartments(
                    departments.map((dept) =>
                      dept.id === updatedDept.id ? updatedDept : dept
                    )
                  );
                }}
                handleDelete={handleDelete}
              />
              <PaginationControls
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                currentPage={currentPage}
                loading={loading}
              />
            </div>
          )}

          {!isPreviewMode && view === "form" && (
            <div className="gap-4">
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
                className="cursor-pointer w-[200px] flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100"
              >
                <HiUpload className="w-5 h-5" />
                Upload Excel/CSV
              </label>

              <FormView
                formData={formData}
                setFormData={setFormData}
                handleSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const response = await api.post(
                      "api/departments/create",
                      formData,
                      {
                        headers: {
                          "Content-Type": "application/json",
                        },
                        withCredentials: true,
                      }
                    );
                    setDepartments([...departments, response.data]);
                    handleViewChange("list");
                  } catch (error) {
                    setError("Failed to create department");
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { DepartmentFunctions };

export default DepartmentManagement;
