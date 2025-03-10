import { Card } from "flowbite-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../utils/api";

const Rewards = () => {
  const [gigs, setGigs] = useState([]);
  const { user } = useSelector((state) => state.auth);

  const emojis = ["🎉", "🏆", "🌟", "🪙", "✨", "🎁", "🏅"];

  useEffect(() => {
    const fetchGigs = async () => {
      if (user) {
        try {
          const response = await api.get(`api/users/my-gigs`, {
            withCredentials: true,
          });
          console.log(response.data);
          setGigs(response.data.docs);
        } catch (error) {
          console.error("Error fetching rewards:", error);
        }
      }
    };

    fetchGigs();
  }, [user]);

  return (
    <div className="p-6">
      {/* Total Rewards & Total Points */}
      <div className="w-2/3 mx-auto flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-green-400/80 to-green-600/80 text-white p-6 rounded-lg shadow-lg mb-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <span className="text-3xl">🏆</span> Total Rewards
          </h2>
          <p className="text-4xl font-extrabold">
            {user.freelanceRewardPoints || 0}
          </p>
        </div>
        <div className="border-l-2 border-white h-12 hidden sm:block"></div>
        <div className="text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <span className="text-3xl">🪙🪙</span> Total Points{" "}
          </h2>
          <p className="text-4xl font-extrabold">{user.freelanceRating || 0}</p>
        </div>
      </div>

      {/* Rewards Section */}
      <h1 className="text-2xl font-bold mb-4">Your Rewards</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {gigs.map((gig, index) => (
          <Card
            key={index}
            className="h-full shadow-md hover:shadow-lg transition"
          >
            <div className="flex items-center">
              <div className="w-1/3 text-center">
                <span className="text-6xl">
                  {emojis[Math.floor(Math.random() * emojis.length)]}
                </span>
                <p className="text-lg font-semibold mt-2">
                  {gig.rewardPoints} Points
                </p>
              </div>
              <div className="w-2/3 pl-4">
                <p className="text-gray-600">{gig.title}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Rewards;
