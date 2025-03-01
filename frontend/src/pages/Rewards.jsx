import { Card } from 'flowbite-react';

const Rewards = () => {
  const rewards = [
    {
      icon: '🎉',
      points: 500,
      description: 'Earned for completing 10 tasks this month.'
    },
    {
      icon: '🏆',
      points: 1000,
      description: 'Top performer award for Q1 2023.'
    },
    {
      icon: '🌟',
      points: 250,
      description: 'Received for excellent teamwork.'
    }
  ];

  // Calculate total points
  const totalPoints = rewards.reduce((sum, reward) => sum + reward.points, 0);
  const totalRewards = rewards.length;

  return (
    <div className="p-6">
      {/* Total Rewards & Total Points */}
      <div className="w-2/3 mx-auto flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-green-400/80 to-green-600/80 text-white p-6 rounded-lg shadow-lg mb-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <span className="text-3xl">🏆</span> Total Rewards
          </h2>
          <p className="text-4xl font-extrabold">{totalRewards}</p>
        </div>
        <div className="border-l-2 border-white h-12 hidden sm:block"></div>
        <div className="text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <span className="text-3xl">🪙🪙</span> Total Points <span className="text-3xl">🪙</span> 
          </h2>
          <p className="text-4xl font-extrabold">{totalPoints}</p>
        </div>
      </div>




      {/* Rewards Section */}
      <h1 className="text-2xl font-bold mb-4">Your Rewards</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {rewards.map((reward, index) => (
          <Card key={index} className="h-full shadow-md hover:shadow-lg transition">
            <div className="flex items-center">
              <div className="w-1/3 text-center">
                <span className="text-6xl">{reward.icon}</span>
                <p className="text-lg font-semibold mt-2">{reward.points} Points</p>
              </div>
              <div className="w-2/3 pl-4">
                <p className="text-gray-600">{reward.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Rewards;
