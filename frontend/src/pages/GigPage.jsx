import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import { Pagination } from "flowbite-react";
import { Button, Modal } from "flowbite-react";
import { io } from "socket.io-client";
import Loading from "../components/Loading";
import { Clock, User, Award, ChevronRight, CheckCircle } from "lucide-react";

const GigPage = () => {
  const { id } = useParams();
  const [gigDetails, setGigDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bids, setBids] = useState([]);
  const [totalBids, setTotalBids] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [showModal, setShowModal] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGigDetails = async () => {
      try {
        const response = await api.get(`/api/gigs/${id}`, {
          withCredentials: true,
        });
        setGigDetails(response.data);
      } catch (error) {
        console.error("Error fetching gig details:", error);
      }
    };

    const fetchBids = async (page = 1) => {
      try {
        const sckt = io("http://localhost:3000", {
          withCredentials: true,
        });
        setLoading(true);
        const query = {
          GigID: id,
          page: page,
        };

        sckt.emit("user_input", query);
        sckt.on("result", (result) => {
          setBids(result.data);
          setTotalBids(result.total);
        });
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
      setLoading(false);
    };

    fetchGigDetails();
    fetchBids(currentPage);
  }, [id, currentPage]);

  const handleAssignClick = (bid) => {
    setSelectedBid(bid);
    setShowModal(true);
  };

  const handleAssignGig = async () => {
    try {
      await api.post(
        `/api/gigs/assign`,
        {
          GigID: id,
          BidID: selectedBid.BidID,
          EID: selectedBid.userauth[0].EID,
        },
        {
          withCredentials: true,
        }
      );
      setShowModal(false);
      alert("Gig assigned successfully");
    } catch (error) {
      console.error("Error assigning gig:", error);
      alert("Failed to assign gig.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {gigDetails && (
          <div className="space-y-8">
            {/* Gig Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center space-x-2 text-gray-500 text-sm mb-4">
                <Clock size={16} />
                <span>
                  Posted {new Date(gigDetails.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-3xl font-semibold text-gray-800 mb-4">
                {gigDetails.title}
              </h1>
              <p className="text-gray-600 leading-relaxed">
                {gigDetails.description}
              </p>
            </div>

            {/* Bids Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Bids ({totalBids})
                </h2>
              </div>

              {loading && (
                <div className="flex justify-center py-12">
                  <Loading />
                </div>
              )}

              <div className="space-y-4">
                {!loading &&
                  bids.map((bid) => (
                    <div
                      key={bid._id}
                      className="group relative bg-gray-50 rounded-lg p-6 transition-all duration-200 hover:shadow-md border border-gray-100"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-3">
                          <div
                            className="flex items-center space-x-3 cursor-pointer"
                            onClick={() =>
                              navigate(`/manager/users/${bid.userauth[0].EID}`)
                            }
                          >
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-gray-500" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                                {bid.userauth[0].fullName}
                              </h3>
                              <p className="text-sm text-gray-500">
                                ID: {bid.BidID}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Award className="w-5 h-5 text-amber-500" />
                              <span className="text-sm font-medium text-gray-700">
                                Score: {bid.score}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed">
                            {bid.description}
                          </p>
                        </div>

                        {(gigDetails.EID === "" ||
                          gigDetails.EID === undefined) && (
                          <Button
                            onClick={() => handleAssignClick(bid)}
                            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                          >
                            <span>Assign</span>
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(totalBids / pageSize)}
                  onPageChange={setCurrentPage}
                  className="inline-flex shadow-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Assignment Confirmation Modal */}
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <Modal.Header className="border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">
              Confirm Assignment
            </h3>
          </Modal.Header>
          <Modal.Body className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-gray-700">
                  Are you sure you want to assign this gig to{" "}
                  <span className="font-semibold">
                    {selectedBid?.userauth[0].fullName}
                  </span>
                  ?
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-t border-gray-100">
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignGig}
                className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                {loading ? "Assigning..." : "Confirm Assignment"}
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default GigPage;
