import { useState } from "react";
import {
  Wallet,
  Edit2,
  CheckCircle2,
  Building2,
  CreditCard,
  User2,
} from "lucide-react";

function MyAccount() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [accountDetails, setAccountDetails] = useState({
    name: "John Doe",
    bank: "HDFC Bank",
    accountNo: "XXXX-XXXX-1234",
    ifsc: "HDFC12345",
  });

  const paymentHistory = [
    {
      task: "Build a Portfolio",
      amount: "₹200",
      date: "2024-02-15",
      status: "Completed",
    },
    {
      task: "Fix UI Bugs",
      amount: "₹150",
      date: "2024-02-18",
      status: "Completed",
    },
    {
      task: "Create Dashboard",
      amount: "₹300",
      date: "2024-02-20",
      status: "Completed",
    },
  ];

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    setShowWithdrawModal(false);
    setWithdrawAmount("");
  };

  const handleUpdateAccount = (e) => {
    e.preventDefault();
    setShowEditModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-stone-800">My Account</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-stone-500">
              Welcome back, {accountDetails.name}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Balance Card */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="bg-stone-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-stone-100">
                  Total Balance
                </h2>
                <Wallet className="w-8 h-8 text-stone-300" />
              </div>
              <div className="text-stone-100">
                <p className="text-4xl font-bold">₹850</p>
                <p className="text-sm text-stone-300 mt-1">
                  Available for withdrawal
                </p>
              </div>
            </div>
            <div className="p-6">
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="w-full bg-stone-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-stone-700 transition duration-200"
              >
                Withdraw Funds
              </button>
            </div>
          </div>

          {/* Account Details Card */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-stone-800">
                Account Details
              </h2>
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center space-x-2 text-stone-600 hover:text-stone-800 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-stone-100 rounded-lg">
                <User2 className="w-5 h-5 text-stone-500" />
                <div>
                  <p className="text-sm text-stone-500">Account Holder</p>
                  <p className="font-medium text-stone-800">
                    {accountDetails.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-stone-100 rounded-lg">
                <Building2 className="w-5 h-5 text-stone-500" />
                <div>
                  <p className="text-sm text-stone-500">Bank Name</p>
                  <p className="font-medium text-stone-800">
                    {accountDetails.bank}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-stone-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-stone-500" />
                <div>
                  <p className="text-sm text-stone-500">Account Number</p>
                  <p className="font-medium text-stone-800">
                    {accountDetails.accountNo}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-stone-800 mb-6">
            Payment History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-stone-200">
                  <th className="pb-3 font-medium text-stone-600">Date</th>
                  <th className="pb-3 font-medium text-stone-600">Task</th>
                  <th className="pb-3 font-medium text-stone-600">Amount</th>
                  <th className="pb-3 font-medium text-stone-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paymentHistory.map((payment, index) => (
                  <tr key={index} className="text-stone-800">
                    <td className="py-4">{payment.date}</td>
                    <td className="py-4 font-medium">{payment.task}</td>
                    <td className="py-4 text-stone-800 font-semibold">
                      {payment.amount}
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center space-x-1 text-stone-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{payment.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-semibold text-stone-800 mb-4">
                Withdraw Amount
              </h3>
              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Amount to Withdraw
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    className="px-4 py-2 text-stone-700 hover:text-stone-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700"
                  >
                    Confirm Withdrawal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Account Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-semibold text-stone-800 mb-4">
                Edit Account Details
              </h3>
              <form onSubmit={handleUpdateAccount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={accountDetails.name}
                    onChange={handleInputChange}
                    className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bank"
                    value={accountDetails.bank}
                    onChange={handleInputChange}
                    className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNo"
                    value={accountDetails.accountNo}
                    onChange={handleInputChange}
                    className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="ifsc"
                    value={accountDetails.ifsc}
                    onChange={handleInputChange}
                    className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-stone-700 hover:text-stone-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAccount;
