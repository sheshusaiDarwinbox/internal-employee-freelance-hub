import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import { Pagination } from "flowbite-react";
import { Button } from "flowbite-react";
import { Toast } from "flowbite-react";

const GigPage = () => {
  const { id } = useParams();
  const [gigDetails, setGigDetails] = useState(null);
  const [bids, setBids] = useState([]);
  const [totalBids, setTotalBids] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const handleAssignBid = async (bidId) => {
    try {
      await api.post(
        `http://localhost:3000/api/bids/assign/${bidId}`,
        {
          withCredentials: true,
        }
      );
      setShowToast(true);
    navigate('/manager/my-gigs'); // Navigate to MyGigs page
      // Optionally, refetch gigs or update state here
    } catch (error) {
      console.error("Error assigning bid:", error);
    }
  };

  useEffect(() => {
    const fetchGigDetails = async () => {
      try {
        const response = await api.get(`/api/gigs/${id}`, {
          withCredentials: true,
        });
        setGigDetails(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching gig details:", error);
      }
    };

    const fetchBids = async (page = 1) => {
      try {
        const response = await api.get(`/api/bids/${id}`, {
          params: { page, limit: pageSize },
          withCredentials: true,
        });
        console.log(response);
        setBids(response.data.docs);
        setTotalBids(response.data.totalDocs);
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    };

    fetchGigDetails();
    fetchBids(currentPage);
  }, [id, currentPage]);

  return (
    <div className="p-6">
      {showToast && (
        <Toast>
          <Toast.Body>Gig assigned successfully!</Toast.Body>
        </Toast>
      )}
      {gigDetails && (
        <div>
          <h2 className="text-3xl font-semibold">{gigDetails.title}</h2>
          <p className="text-gray-700 mt-4">{gigDetails.description}</p>
          <div className="mt-6">
            <h3 className="text-2xl font-semibold">Bids</h3>
            <div>
              <div>
                <div className="mt-6">
                  {bids.length === 0 ? (
                    <p>No bids for this Gig</p>
                  ) : (
                    <div>
                      <div className="mt-4">
                        {bids.map((bid) => (
                          <div
                            key={bid._id}
                            className="p-4 flex cursor-pointer justify-between border-b"
                          >
                            <div>
                              <h4
                                className="text-lg font-medium hover:underline"
                                onClick={() => {
                                  navigate(
                                    `/manager/users/${bid.userauth[0].EID}`
                                  );
                                }}
                              >
                                {bid.userauth[0].fullName}
                              </h4>
                              <p className="text-gray-600">{bid.BidID}</p>
                              <p>{bid.description}</p>
                            </div>

                            <Button
                              className="h-9 px-4  rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-500 focus:ring-4 focus:ring-blue-300 transition duration-300"
                              color="blue"
                              size="sm"
                              onClick={() => handleAssignBid(bid.BidID)}
                            >
                              Assign
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-center mt-6">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={Math.ceil(totalBids / pageSize)}
                          onPageChange={(page) => setCurrentPage(page)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GigPage;
