import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Award,
  DollarSign,
  Star,
  User,
  Briefcase,
  CheckCircle2,
  FileText,
  Code,
  X,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
} from "lucide-react";
import api from "../utils/api";
import Loading from "../components/Loading";
import { useParams } from "react-router-dom";
import { formatDate } from "../utils/dateUtils";
import gigImg from "../assets/gig.jpeg";

// Mock data structure for TypeScript types

// Mock data for development
const mockGig = {
  title: "Full Stack Development Project",
  description:
    "Looking for an experienced developer to build a modern web application with React and Node.js",
  DID: "D123456",
  ManagerID: "M789012",
  EID: "E789012",
  deadline: new Date("2024-04-30"),
  approvalStatus: "APPROVED",
  ongoingStatus: "Ongoing",
  rewardPoints: 500,
  amount: 2500,
  rating: 4.5,
  assignedAt: new Date("2024-03-15"),
  employee: {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    department: "Engineering",
    location: "San Francisco, CA",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    completedGigs: 15,
    averageRating: 4.8,
    skills: ["React", "Node.js", "TypeScript", "Python", "AWS"],
  },
  skills: [
    { skill: "React", weight: 0.8 },
    { skill: "Node.js", weight: 0.7 },
    { skill: "TypeScript", weight: 0.6 },
  ],
  progressTracking: [
    {
      subject: "Initial Setup",
      description: "Project environment and basic structure setup completed",
      work_percentage: 10,
      files: [
        {
          name: "setup.md",
          url: "https://gist.githubusercontent.com/example/setup.md",
          content:
            "# Project Setup\n\n## Environment Configuration\n1. Install dependencies\n2. Configure environment variables\n3. Setup database\n\n## Getting Started\nFollow these steps to get the project running locally...",
        },
        {
          name: "architecture.pdf",
          url: "https://example.com/docs/architecture.pdf",
          preview:
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
        },
      ],
    },
  ],
  img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
};

function ReviewModal({ onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, review });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Submit Review</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="review"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Review Comments
            </label>
            <textarea
              id="review"
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Write your review here..."
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { FileIcon, Image as ImageIcon } from "lucide-react";

function FilePreviewModal({ file, onClose }) {
  const fileType = getFileType(file);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {getFileIcon(fileType)}
            {file.name}
          </h3>
          <div className="flex items-center gap-3">
            <a
              href={file}
              download={file.name}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <ExternalLink className="w-4 h-4" />
              Download
            </a>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
          <FilePreview file={file} fileType={fileType} />
        </div>
      </div>
    </div>
  );
}

function FilePreview({ file, fileType }) {
  const [pdfError, setPdfError] = React.useState(false);

  switch (fileType) {
    case "image":
      return (
        <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={file}
            alt={`Preview of ${file.name}`}
            className="max-w-full max-h-[70vh] object-contain"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/400x300?text=Image+Preview+Failed";
            }}
          />
        </div>
      );

    case "pdf":
      if (pdfError) {
        return (
          <div className="text-center py-10">
            <p className="text-gray-500">PDF preview is not available.</p>
            <a
              href={file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
            >
              Open PDF in new tab
            </a>
          </div>
        );
      }
      return (
        <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
          <iframe
            src={file}
            title="PDF Preview"
            className="w-full h-full"
            onError={() => setPdfError(true)}
          />
        </div>
      );

    case "markdown":
      return (
        <div className="prose max-w-none">
          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
            <code>{file.content || "Markdown content not available"}</code>
          </pre>
        </div>
      );

    default:
      return (
        <div className="text-center py-10">
          <FileIcon className="w-16 h-16 mx-auto text-gray-400" />
          <p className="mt-4 text-gray-500">
            Preview not available for this file type
          </p>
          <a
            href={file}
            download={file.name}
            className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
          >
            Download file
          </a>
        </div>
      );
  }
}

function getFileType(filename) {
  const extension = filename.toLowerCase().split(".").pop();

  if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
    return "image";
  }
  if (extension === "pdf") {
    return "pdf";
  }
  if (extension === "md") {
    return "markdown";
  }
  return "other";
}

function getFileIcon(fileType) {
  switch (fileType) {
    case "image":
      return <ImageIcon className="w-5 h-5" />;
    case "pdf":
    case "markdown":
      return <FileText className="w-5 h-5" />;
    default:
      return <FileIcon className="w-5 h-5" />;
  }
}

function ProgressBar({ percentage }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function StatusBadge({ status, type }) {
  const getStatusColor = () => {
    if (type === "approval") {
      return status === "APPROVED"
        ? "bg-green-100 text-green-800"
        : status === "PENDING"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800";
    } else {
      return status === "Completed"
        ? "bg-green-100 text-green-800"
        : status === "Ongoing"
        ? "bg-blue-100 text-blue-800"
        : status === "Reviewed"
        ? "bg-purple-100 text-purple-800"
        : "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
    >
      {status}
    </span>
  );
}

function SkillBadge({ skill, weight }) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
      <Code className="w-4 h-4" />
      <span className="font-medium">{skill}</span>
      {weight !== undefined && (
        <span className="text-sm text-gray-500">
          {(weight * 100).toFixed(0)}%
        </span>
      )}
    </div>
  );
}

function EmployeeCard({ employee }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start gap-4">
        <img
          src={employee.avatar}
          alt={employee.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">
            {employee.name}
          </h3>
          <p className="text-gray-600">{employee.department}</p>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <a
                href={`mailto:${employee.email}`}
                className="hover:text-blue-600"
              >
                {employee.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{employee.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{employee.location}</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                <span>{employee.completedGigs} gigs completed</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{employee.averageRating} average rating</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill, index) => (
                <SkillBadge key={index} skill={skill} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GigAssignPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [gigData, setGigData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { GigID } = useParams();

  useEffect(() => {
    const fetchGig = async () => {
      try {
        setLoading(true);
        setError(null);

        // For development, use mock data
        // In production, uncomment the API call
        const response = await api.get(`api/gigs/${GigID}`, {
          withCredentials: true,
        });
        setGigData(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching the gig"
        );
      } finally {
        setLoading(false);
      }
    };

    if (GigID) {
      fetchGig();
    }
  }, [GigID]);

  const handleReviewSubmit = async (reviewData) => {
    try {
      // await api.post(`api/gigs/${GigID}/review`, reviewData);

      setGigData((prev) =>
        prev ? { ...prev, ongoingStatus: "Reviewed" } : null
      );
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!gigData) return <div>No gig data found</div>;

  const totalProgress =
    gigData.progressTracking[gigData.progressTracking.length - 1]
      ?.work_percentage || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Image */}
          <div className="h-48 w-full relative">
            <img
              src={gigData.img || gigImg}
              alt="Project cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            {/* Title and Status */}
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold text-gray-900">
                {gigData.title}
              </h1>
              <div className="flex gap-2">
                <StatusBadge status={gigData.approvalStatus} type="approval" />
                <StatusBadge status={gigData.ongoingStatus} type="ongoing" />
              </div>
            </div>

            {/* Key Information */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-semibold">${gigData.amount}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Reward Points</p>
                  <p className="font-semibold">{gigData.rewardPoints} points</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Deadline</p>
                  <p className="font-semibold">
                    {formatDate(gigData.deadline)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Assigned Date</p>
                  <p className="font-semibold">
                    {formatDate(gigData.assignedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900">
                Description
              </h2>
              <p className="mt-2 text-gray-600 leading-relaxed">
                {gigData.description}
              </p>
            </div>

            {/* Assigned Employee */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Assigned Employee
              </h2>
              {/* <EmployeeCard employee={gigData.employee} /> */}
            </div>

            {/* Skills */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {gigData.skills.map((skill, index) => (
                  <SkillBadge
                    key={index}
                    skill={skill.skill}
                    weight={skill.weight}
                  />
                ))}
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Progress
                </h2>
                {totalProgress === 100 &&
                  gigData.ongoingStatus !== "Reviewed" && (
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Submit Review
                    </button>
                  )}
              </div>
              {gigData.progressTracking.map((progress, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900">
                      {progress.subject}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {progress.work_percentage}%
                    </span>
                  </div>
                  <ProgressBar percentage={progress.work_percentage} />
                  <p className="mt-2 text-sm text-gray-600">
                    {progress.description}
                  </p>
                  <div className="mt-2 flex gap-2">
                    {progress.files.map((file, fileIndex) => (
                      <button
                        key={fileIndex}
                        onClick={() => setSelectedFile(file)}
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        {file.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* IDs Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Department ID</p>
                  <p className="font-medium">{gigData.DID}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Manager ID</p>
                  <p className="font-medium">{gigData.ManagerID}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Employee ID</p>
                  <p className="font-medium">{gigData.EID}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      {selectedFile && (
        <FilePreviewModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
}

export default GigAssignPage;
