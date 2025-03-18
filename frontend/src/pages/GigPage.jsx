// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../utils/api";
// import { Pagination } from "flowbite-react";
// import { Button } from "flowbite-react";
// import { useSelector } from "react-redux";
// import { io } from "socket.io-client";
// import Loading from "../components/Loading";

// const GigPage = () => {
//   const { id } = useParams();
//   const [gigDetails, setGigDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [bids, setBids] = useState([]);
//   const [totalBids, setTotalBids] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize] = useState(6);
//   const navigate = useNavigate();
//   const { socket } = useSelector((state) => state.websocket);

//   useEffect(() => {
//     const fetchGigDetails = async () => {
//       try {
//         const response = await api.get(`/api/gigs/${id}`, {
//           withCredentials: true,
//         });
//         setGigDetails(response.data);
//         console.log(response.data);
//       } catch (error) {
//         console.error("Error fetching gig details:", error);
//       }
//     };

//     const fetchBids = async (page = 1) => {
//       try {
//         const sckt = io("http://localhost:3000");
//         setLoading(true);
//         const query = {
//           GigID: id,
//           page: page,
//         };

//         sckt.emit("user_input", query);
//         sckt.on("result", (result) => {
//           setBids(result.data);
//           setTotalBids(result.total);
//         });
//       } catch (error) {
//         console.error("Error fetching bids:", error);
//       }
//       setLoading(false);
//     };

//     fetchGigDetails();
//     fetchBids(currentPage);
//   }, [id, currentPage]);

//   return (
//     <div className="container mx-auto p-6">
//       {gigDetails && (
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <h2 className="text-3xl font-semibold text-gray-800">
//             {gigDetails.title}
//           </h2>
//           <p className="text-gray-600 mt-4">{gigDetails.description}</p>

//           <div className="mt-8">
//             <h3 className="text-2xl font-semibold text-gray-800">Bids</h3>
//             <div className="mt-4 space-y-6">
//               {loading && <Loading />}
//               {!loading &&
//                 bids.map((bid) => (
//                   <div
//                     key={bid._id}
//                     className="p-5 bg-gray-100 rounded-lg shadow-sm flex justify-between items-center"
//                   >
//                     <div>
//                       <h4
//                         className="text-xl font-semibold text-gray-600 hover:underline cursor-pointer"
//                         onClick={() => {
//                           navigate(`/manager/users/${bid.userauth[0].EID}`);
//                         }}
//                       >
//                         {bid.userauth[0].fullName}
//                       </h4>
//                       <p className="text-gray-700">Score: {bid.score}</p>
//                       <p className="text-gray-500">{bid.BidID}</p>
//                       <p className="mt-2 text-gray-600">{bid.description}</p>
//                     </div>
//                     <Button
//                       className="h-10 px-6 rounded-lg bg-slate-600  text-white font-medium shadow-md hover:from-slate-600 hover:to-slate-500 transition duration-300 ease-in-out transform hover:scale-105 focus:ring-4 focus:ring-blue-300"
//                       size="sm"
//                     >
//                       Assign
//                     </Button>
//                   </div>
//                 ))}
//             </div>

//             <div className="flex justify-center mt-8">
//               <Pagination
//                 currentPage={currentPage}
//                 totalPages={Math.ceil(totalBids / pageSize)}
//                 onPageChange={(page) => setCurrentPage(page)}
//                 className="w-full max-w-md"
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GigPage;

// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../utils/api";
// import { Pagination } from "flowbite-react";
// import { Button, Modal } from "flowbite-react";
// import { useSelector } from "react-redux";
// import { io } from "socket.io-client";
// import Loading from "../components/Loading";

// const GigPage = () => {
//   const { id } = useParams();
//   const [gigDetails, setGigDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [bids, setBids] = useState([]);
//   const [totalBids, setTotalBids] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize] = useState(6);
//   const [showModal, setShowModal] = useState(false); // state to control modal visibility
//   const [selectedBid, setSelectedBid] = useState(null); // state to store the selected bid
//   const navigate = useNavigate();
//   const { socket } = useSelector((state) => state.websocket);

//   useEffect(() => {
//     const fetchGigDetails = async () => {
//       try {
//         const response = await api.get(`/api/gigs/${id}`, {
//           withCredentials: true,
//         });
//         setGigDetails(response.data);
//         console.log(response.data);
//       } catch (error) {
//         console.error("Error fetching gig details:", error);
//       }
//     };

//     const fetchBids = async (page = 1) => {
//       try {
//         const sckt = io("http://localhost:3000");
//         setLoading(true);
//         const query = {
//           GigID: id,
//           page: page,
//         };

//         sckt.emit("user_input", query);
//         sckt.on("result", (result) => {
//           setBids(result.data);
//           setTotalBids(result.total);
//         });
//       } catch (error) {
//         console.error("Error fetching bids:", error);
//       }
//       setLoading(false);
//     };

//     fetchGigDetails();
//     fetchBids(currentPage);
//   }, [id, currentPage]);

//   const handleAssignClick = (bid) => {
//     setSelectedBid(bid);
//     setShowModal(true); // Show the modal when the Assign button is clicked
//   };

//   const handleAssignGig = async () => {
//     try {
//       // Make API call or emit socket event to assign the gig to the selected bid
//       await api.post(
//         `/api/gigs/assign`,
//         {
//           GigID: id,
//           BidID: selectedBid.BidID,
//           EID: selectedBid.userauth[0].EID,
//         },
//         {
//           withCredentials: true,
//         }
//       );
//       setShowModal(false); // Close the modal
//       alert("Gig assigned successfully");
//     } catch (error) {
//       console.error("Error assigning gig:", error);
//       alert("Failed to assign gig.");
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       {gigDetails && (
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <h2 className="text-3xl font-semibold text-gray-800">
//             {gigDetails.title}
//           </h2>
//           <p className="text-gray-600 mt-4">{gigDetails.description}</p>

//           <div className="mt-8">
//             <h3 className="text-2xl font-semibold text-gray-800">Bids</h3>
//             <div className="mt-4 space-y-6">
//               {loading && <Loading />}
//               {!loading &&
//                 bids.map((bid) => (
//                   <div
//                     key={bid._id}
//                     className="p-5 bg-gray-100 rounded-lg shadow-sm flex justify-between items-center"
//                   >
//                     <div>
//                       <h4
//                         className="text-xl font-semibold text-gray-600 hover:underline cursor-pointer"
//                         onClick={() => {
//                           navigate(`/manager/users/${bid.userauth[0].EID}`);
//                         }}
//                       >
//                         {bid.userauth[0].fullName}
//                       </h4>
//                       <p className="text-gray-700">Score: {bid.score}</p>
//                       <p className="text-gray-500">{bid.BidID}</p>
//                       <p className="mt-2 text-gray-600">{bid.description}</p>
//                     </div>
//                     {(gigDetails.EID === "" ||
//                       gigDetails.EID === undefined) && (
//                       <Button
//                         className="h-10 px-6 rounded-lg bg-slate-600  text-white font-medium shadow-md hover:from-slate-600 hover:to-slate-500 transition duration-300 ease-in-out transform hover:scale-105 focus:ring-4 focus:ring-blue-300"
//                         size="sm"
//                         onClick={() => handleAssignClick(bid)} // Show modal on click
//                       >
//                         Assign
//                       </Button>
//                     )}
//                   </div>
//                 ))}
//             </div>

//             <div className="flex justify-center mt-8">
//               <Pagination
//                 currentPage={currentPage}
//                 totalPages={Math.ceil(totalBids / pageSize)}
//                 onPageChange={(page) => setCurrentPage(page)}
//                 className="w-full max-w-md"
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal for confirmation */}
//       <Modal show={showModal} onClose={() => setShowModal(false)}>
//         <Modal.Header>Confirm Gig Assignment</Modal.Header>
//         <Modal.Body>
//           <div className="p-6">
//             <p className="text-gray-700">
//               Are you sure you want to assign this gig to{" "}
//               <span className="font-semibold">
//                 {selectedBid?.userauth[0].fullName}
//               </span>
//               ?
//             </p>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <div className="flex justify-end gap-2">
//             <Button
//               color="gray"
//               onClick={() => setShowModal(false)}
//               disabled={loading}
//             >
//               Cancel
//             </Button>
//             <Button
//               color="success"
//               onClick={handleAssignGig}
//               disabled={loading}
//             >
//               {loading ? "Assigning..." : "Assign"}
//             </Button>
//           </div>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default GigPage;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import { Pagination } from "flowbite-react";
import { Button, Modal } from "flowbite-react";
import { useSelector } from "react-redux";
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
  const { socket } = useSelector((state) => state.websocket);

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
