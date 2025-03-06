import { Card } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Rewards = () => {
  const [rewardsData, setRewardsData] = useState({
    totalRewards: 0,
    totalPoints: 0,
    gigs: [],
  });
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const EID = authState?.user?.EID;

  const emojis = ['🎉', '🏆', '🌟', '🪙', '✨', '🎁', '🏅'];

  useEffect(() => {
    const fetchRewards = async () => {
      if (EID) {
        try {
          const response = await fetch(`http://localhost:3000/api/users/total-rewards/${EID}`,{
            credentials:"include",
          });
          const data = await response.json();
          setRewardsData({
            totalRewards: data.gigsWithRewardsCount,
            totalPoints: data.totalRewards,
            gigs: data.gigs,
          });
        } catch (error) {
          console.error('Error fetching rewards:', error);
        }
      }
    };

    fetchRewards();
  }, [EID, dispatch]);

  return (
    <div className="p-6">
      {/* Total Rewards & Total Points */}
      <div className="w-2/3 mx-auto flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-green-400/80 to-green-600/80 text-white p-6 rounded-lg shadow-lg mb-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <span className="text-3xl">🏆</span> Total Rewards
          </h2>
          <p className="text-4xl font-extrabold">{rewardsData.totalRewards}</p>
        </div>
        <div className="border-l-2 border-white h-12 hidden sm:block"></div>
        <div className="text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <span className="text-3xl">🪙🪙</span> Total Points <span className="text-3xl">🪙</span>
          </h2>
          <p className="text-4xl font-extrabold">{rewardsData.totalPoints}</p>
        </div>
      </div>

      {/* Rewards Section */}
      <h1 className="text-2xl font-bold mb-4">Your Rewards</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {rewardsData.gigs.map((reward, index) => (
          <Card key={index} className="h-full shadow-md hover:shadow-lg transition">
            <div className="flex items-center">
              <div className="w-1/3 text-center">
                <span className="text-6xl">{emojis[Math.floor(Math.random() * emojis.length)]}</span>
                <p className="text-lg font-semibold mt-2">{reward.rewardPoints} Points</p>
              </div>
              <div className="w-2/3 pl-4">
                <p className="text-gray-600">{reward.title}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Rewards;