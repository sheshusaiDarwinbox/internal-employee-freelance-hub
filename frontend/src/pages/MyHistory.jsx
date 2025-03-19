import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Star,
  Calendar,
  DollarSign,
  Award,
  FileX,
  X,
  Clock,
  CheckCircle,
} from "lucide-react";
import api from "../utils/api";

const GigDetailsModal = ({ gig, onClose }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{gig.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Status and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center text-gray-700">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              <span>Status: {gig.ongoingStatus}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock className="h-5 w-5 mr-2 text-blue-500" />
              <span>Deadline: {formatDate(gig.deadline)}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap">
              {gig.description}
            </p>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Skills Required</h3>
            <div className="flex flex-wrap gap-2">
              {gig.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {skill.skill}
                  {skill.weight && ` (${(skill.weight * 100).toFixed(0)}%)`}
                </span>
              ))}
            </div>
          </div>

          {/* Progress Tracking */}
          {gig.progressTracking && gig.progressTracking.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Progress History</h3>
              <div className="space-y-4">
                {gig.progressTracking.map((progress, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {progress.subject}
                    </h4>
                    <p className="text-gray-600 mb-2">{progress.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${progress.work_percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {progress.work_percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rewards and Rating */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-gray-700">
              <DollarSign className="h-5 w-5 mr-2 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-semibold">${gig.amount}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <Award className="h-5 w-5 mr-2 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Reward Points</p>
                <p className="font-semibold">{gig.rewardPoints}</p>
              </div>
            </div>
            {gig.rating && (
              <div className="flex items-center text-gray-700">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="font-semibold">{gig.rating} / 5</p>
                </div>
              </div>
            )}
          </div>

          {/* Feedback */}
          {gig.feedback && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Feedback</h3>
              <p className="text-gray-600 italic">"{gig.feedback}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function WorkHistory() {
  const [gigs, setGigs] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Completed");
  const [loading, setLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedGig, setSelectedGig] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
    fetchGigs();
  }, [debouncedSearch, filter]);

  useEffect(() => {
    fetchGigs();
  }, [page]);

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/gigs/my-gigs?page=${page}&type=${filter}`,
        {},
        {
          withCredentials: true,
        }
      );

      setGigs(response.data);
    } catch (error) {
      console.error("Error fetching gigs:", error);
      setGigs(null);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGigs();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const NoGigsFound = () => (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
      <FileX className="w-16 h-16 mb-4" />
      <h3 className="text-xl font-semibold mb-2">No Gigs Found</h3>
      <p className="text-center text-gray-400">
        {search
          ? "No gigs match your search criteria"
          : `You don't have any ${filter.toLowerCase()} gigs yet`}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            Work History
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <form onSubmit={handleSearch} className="flex-1 sm:flex-initial">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search gigs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>

            <div className="flex gap-2">
              <button
                onClick={() => setFilter("Completed")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  filter === "Completed"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 border border-gray-300"
                }`}
              >
                <Filter className="h-4 w-4" />
                Completed
              </button>
              <button
                onClick={() => setFilter("Reviewed")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  filter === "Reviewed"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 border border-gray-300"
                }`}
              >
                <Star className="h-4 w-4" />
                Reviewed
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : !gigs || gigs.docs.length === 0 ? (
          <NoGigsFound />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gigs.docs.map((gig) => (
                <div
                  key={gig.GigID}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02]"
                  onClick={() => setSelectedGig(gig)}
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {gig.title}
                    </h3>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(gig.completedAt)}</span>
                      </div>
                      {gig.rating && (
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 mr-1" />
                          <span>{gig.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {gig.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {skill.skill}
                        </span>
                      ))}
                      {gig.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          +{gig.skills.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>${gig.amount}</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        <span>{gig.rewardPoints} pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {gigs.totalPages >= 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={!gigs.hasPrevPage}
                    className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-700">
                    Page {gigs.page} of {gigs.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={!gigs.hasNextPage}
                    className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {selectedGig && (
        <GigDetailsModal
          gig={selectedGig}
          onClose={() => setSelectedGig(null)}
        />
      )}
    </div>
  );
}

export default WorkHistory;
