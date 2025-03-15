import React, { useState, useEffect } from "react";
import { Trophy, Coins, Gift, Star, Award, TrendingUp } from "lucide-react";

const user = {
  freelanceRewardPoints: 1250,
  freelanceRating: 4.8,
};

const mockGigs = [
  {
    title: "Website Redesign Project",
    rewardPoints: 150,
    status: "Completed",
    date: "2024-03-15",
  },
  {
    title: "E-commerce Development",
    rewardPoints: 300,
    status: "Completed",
    date: "2024-03-10",
  },
  {
    title: "Mobile App UI Design",
    rewardPoints: 200,
    status: "Completed",
    date: "2024-03-05",
  },
  {
    title: "API Integration",
    rewardPoints: 175,
    status: "Completed",
    date: "2024-03-01",
  },
];

function App() {
  const [gigs, setGigs] = useState(mockGigs);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = (status) => {
    return status === "Completed"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Your Rewards Dashboard
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track your achievements and earn rewards for your outstanding work
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <span className="text-sm font-medium text-gray-500">
                Total Rewards
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {user.freelanceRewardPoints}
            </div>
            <div className="mt-2 text-sm text-gray-600">Points earned</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <Star className="h-8 w-8 text-blue-500" />
              <span className="text-sm font-medium text-gray-500">Rating</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {user.freelanceRating}
            </div>
            <div className="mt-2 text-sm text-gray-600">Average rating</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Rewards</h2>
            <TrendingUp className="h-6 w-6 text-gray-400" />
          </div>

          <div className="grid gap-6">
            {gigs.map((gig, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-white p-3 rounded-lg shadow">
                    <Gift className="h-6 w-6 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{gig.title}</h3>
                    <p className="text-sm text-gray-500">{gig.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      gig.status
                    )}`}
                  >
                    {gig.status}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Coins className="h-5 w-5 text-yellow-500" />
                    <span className="font-semibold text-gray-900">
                      +{gig.rewardPoints}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Next Milestone
          </h2>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                  Progress
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-indigo-600">
                  75%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
              <div
                style={{ width: "75%" }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              225 more points until you reach Expert level
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
