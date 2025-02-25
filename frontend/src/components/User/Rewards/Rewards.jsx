// import React from 'react';
import { Card } from 'flowbite-react';

const Rewards = () => {
  const payments = [
    {
      amount: 200,
      description: 'Payment for Project Task Management System'
    },
    {
      amount: 150,
      description: 'Payment for Task 2'
    },
    {
      amount: 300,
      description: 'Payment for Task 3'
    }
  ];
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Rewards</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {rewards.map((reward, index) => (
          <Card key={index} className="h-full">
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
      <h2 className="text-xl font-bold my-4">Your Payments</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {payments.map((payment, index) => (
          <Card key={index} className="h-full">
            <div className="flex items-center">
              <div className="w-1/3 text-center">
                <div className='text-2xl'>💵</div>
                <p className="text-lg font-semibold mt-2">₹{payment.amount}</p>
              </div>
              <div className="w-2/3 pl-4">
                <p className="text-gray-600">{payment.description}</p>
              </div>
            </div>
          </Card>
        ))}
        
      </div>
    </div>
  );
};

export default Rewards;
