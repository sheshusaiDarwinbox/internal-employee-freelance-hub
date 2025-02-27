import { useState } from "react";
import { Card, Button } from "flowbite-react";
import { Edit, CheckCircle } from "lucide-react";

const MyAccount = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const [accountDetails, setAccountDetails] = useState({
    name: "John Doe",
    bank: "SBI",
    accountNo: "+1234567890",
  });

  const paymentHistory = [
    { task: "Build a Portfolio", amount: "₹200", date: "2024-02-15" },
    { task: "Fix UI Bugs", amount: "₹150", date: "2024-02-18" },
    { task: "Create Dashboard", amount: "₹300", date: "2024-02-20" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountDetails({ ...accountDetails, [name]: value });
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    if (!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      alert("Please enter a valid amount!");
      return;
    }
    alert(`Withdrawal request of ₹${withdrawAmount} submitted!`);
    setWithdrawAmount("");
    setShowWithdrawForm(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Balance & Account Details Container */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Balance Display */}
        <Card className="p-6 text-center bg-gradient-to-r from-blue-100 to-blue-200 shadow-lg flex-1">
          <h3 className="text-2xl font-bold text-gray-800">Total Account Balance</h3>
          <p className="text-3xl font-semibold text-red-800">₹850</p>
          <Button
            className="mt-4 w-1/2 mx-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full"
            onClick={() => setShowWithdrawForm(true)}
          >
            Withdraw
          </Button>
        </Card>

        {/* Account Details */}
        <div className="bg-white p-6 rounded-xl shadow-md flex-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Account Details</h3>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="w-5 h-5 inline-block mr-2" />
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
          <div className="text-gray-700 space-y-2">
            <p><strong>Name:</strong> {accountDetails.name}</p>
            <p><strong>Bank Name:</strong> {accountDetails.bank}</p>
            <p><strong>Account No:</strong> {accountDetails.accountNo}</p>
          </div>
        </div>
      </div>

      {/* Withdrawal Form */}
      {showWithdrawForm && (
        <div className="w-1/2 mx-auto bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Withdraw Amount</h3>
          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            <input
              type="number"
              name="amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter Amount"
              className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-4">
              <Button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full"
                onClick={() => setShowWithdrawForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-full">
                Submit
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Editable Form (Appears When Editing) */}
      {isEditing && (
        <div className="w-1/2 mx-auto bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Account Details</h3>
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={accountDetails.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="bank"
              value={accountDetails.bank}
              onChange={handleInputChange}
              placeholder="Bank Name"
              className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="accountNo"
              value={accountDetails.accountNo}
              onChange={handleInputChange}
              placeholder="Account Number"
              className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-4">
              <Button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-600 text-white px-4 py-2 rounded-full"
                onClick={() => setIsEditing(false)}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Payment History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border border-gray-200 px-4 py-2 text-center">Date</th>
                <th className="border border-gray-200 px-4 py-2 text-center">Task</th>
                <th className="border border-gray-200 px-4 py-2 text-center">Amount 💵</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="border-r border-gray-200 px-4 py-2 text-gray-600 text-center">{payment.date}</td>
                  <td className="border-r border-gray-200 px-4 py-2 text-gray-800 font-medium text-center">{payment.task}</td>
                  <td className="flex gap-2 justify-center border-gray-200 px-4 py-2 text-green-600 font-semibold">
                    {payment.amount}
                    <span><CheckCircle className="w-6 h-6 text-green-500" /></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
