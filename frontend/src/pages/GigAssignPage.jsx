import React, { useState } from "react";
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
} from "lucide-react";

// Mock data to demonstrate the UI
const gig = {
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
      work_percentage: 25,
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

function FilePreviewModal({ file, onClose }) {
  const isPDF = file.name.endsWith(".pdf");
  const isMarkdown = file.name.endsWith(".md");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {file.name}
          </h3>
          <div className="flex items-center gap-3">
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <ExternalLink className="w-4 h-4" />
              Open
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
          {isPDF && file.preview && (
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={file.preview}
                alt={`Preview of ${file.name}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {isMarkdown && file.content && (
            <div className="prose max-w-none">
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <code>{file.content}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
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

function GigAssignPage({ GigID }) {
  const [selectedFile, setSelectedFile] = useState(
    gig.progressTracking[0]["files"][0]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Image */}
          <div className="h-48 w-full relative">
            <img
              src={gig.img}
              alt="Project cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            {/* Title and Status */}
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold text-gray-900">{gig.title}</h1>
              <div className="flex gap-2">
                <StatusBadge status={gig.approvalStatus} type="approval" />
                <StatusBadge status={gig.ongoingStatus} type="ongoing" />
              </div>
            </div>

            {/* Key Information */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-semibold">${gig.amount}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Reward Points</p>
                  <p className="font-semibold">{gig.rewardPoints} points</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Deadline</p>
                  <p className="font-semibold">
                    {gig.deadline.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Assigned Date</p>
                  <p className="font-semibold">
                    {gig.assignedAt.toLocaleDateString()}
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
                {gig.description}
              </p>
            </div>

            {/* Assigned Employee */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Assigned Employee
              </h2>
              <EmployeeCard employee={gig.employee} />
            </div>

            {/* Skills */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {gig.skills.map((skill, index) => (
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Progress
              </h2>
              {gig.progressTracking.map((progress, index) => (
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
                  <p className="font-medium">{gig.DID}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Manager ID</p>
                  <p className="font-medium">{gig.ManagerID}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Employee ID</p>
                  <p className="font-medium">{gig.EID}</p>
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
    </div>
  );
}

export default GigAssignPage;
