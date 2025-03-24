import { useState, useEffect, useCallback, useRef } from "react";
import { Button, TextInput, Select } from "flowbite-react";
import { HiPlus, HiUpload, HiSearch } from "react-icons/hi";
import * as XLSX from "xlsx";
import api from "../utils/api";

const JobTypeEnum = {
  FullTime: "Full Time",
  PartTime: "Part Time",
  Contract: "Contract",
  Freelance: "Freelance",
};

const JobsManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [currentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [setLoading] = useState(false);
  const [setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    department: "",
    minSalary: "",
    maxSalary: "",
  });

  const [setIsEditing] = useState(false);

  const [setExcelData] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        search: searchQuery,
        ...filters,
      });

      const response = await api.get(`/jobs?${params}`);
      setJobs(response.data.jobs);
      setTotalPages(response.data.totalPages);
    } catch {
      setError("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, filters]);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");
      setDepartments(response.data);
    } catch {
      console.error("Failed to fetch departments");
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

        if (validateJobData(data)) {
          setExcelData(data);
          setPreviewData(data);
          setIsPreviewMode(true);
          setUploadError(null);
        } else {
          setUploadError(
            "Invalid format. Required fields: title, description, type, DID"
          );
        }
      } catch {
        setUploadError("Error processing file");
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Validation for job data
  const validateJobData = (data) => {
    return data.every(
      (job) =>
        job.title &&
        job.description &&
        Object.keys(JobTypeEnum).includes(job.type) &&
        job.DID
    );
  };

  // Bulk create handler
  const handleBulkCreate = async () => {
    if (!previewData?.length) return;
    try {
      setLoading(true);
      await api.post("/jobs/bulk", { jobs: previewData });
      fetchJobs();
      cancelPreview();
    } catch {
      setError("Failed to create jobs");
    } finally {
      setLoading(false);
    }
  };

  const cancelPreview = () => {
    setExcelData(null);
    setPreviewData(null);
    setIsPreviewMode(false);
    setUploadError(null);
  };

  // Initialize data
  useEffect(() => {
    fetchJobs();
    fetchDepartments();
  }, [fetchJobs]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Jobs</h1>
        <div className="flex gap-4">
          {!isPreviewMode && (
            <Button onClick={() => setIsEditing(true)}>
              <HiPlus className="mr-2" /> Create Job
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
            className="btn btn-secondary cursor-pointer"
          >
            <HiUpload className="mr-2" /> Upload Excel
          </label>
        </div>
      </div>

      {/* Search and Filters */}
      {!isPreviewMode && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <TextInput
            icon={HiSearch}
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            {Object.entries(JobTypeEnum).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </Select>
          <Select
            value={filters.department}
            onChange={(e) =>
              setFilters({ ...filters, department: e.target.value })
            }
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </Select>
        </div>
      )}

      {/* Excel Preview */}
      {isPreviewMode && previewData && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Preview Jobs</h2>
            <div className="flex gap-2">
              <Button color="success" onClick={handleBulkCreate}>
                Create {previewData.length} Jobs
              </Button>
              <Button color="gray" onClick={cancelPreview}>
                Cancel
              </Button>
            </div>
          </div>
          {/* Excel preview table */}
        </div>
      )}

      {/* Jobs List */}
      {!isPreviewMode && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Department</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.JID}>
                  <td>{job.title}</td>
                  <td>{JobTypeEnum[job.type]}</td>
                  <td>{departments.find((d) => d._id === job.DID)?.name}</td>
                  <td>{job.salary}</td>
                  <td>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleEdit(job)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        color="failure"
                        onClick={() => handleDelete(job.JID)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isPreviewMode && totalPages > 1 && (
        <div className="flex justify-center mt-4"></div>
      )}
    </div>
  );
};

export default JobsManagement;
