import { useState } from "react";
import { Card, Button, Modal } from "flowbite-react";
import { Edit, CheckCircle } from "react-feather";

const MyAccount = () => {
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
    { task: "Build a Portfolio", amount: "₹200", date: "2024-02-15" },
    { task: "Fix UI Bugs", amount: "₹150", date: "2024-02-18" },
    { task: "Create Dashboard", amount: "₹300", date: "2024-02-20" },
  ];

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    // Handle withdrawal logic
    setShowWithdrawModal(false);
    setWithdrawAmount("");
  };

  const handleUpdateAccount = (e) => {
    e.preventDefault();
    // Handle account update logic
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
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Account</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Balance Card */}
        <Card className="p-6 text-center bg-gradient-to-r from-blue-100 to-blue-200">
          <h3 className="text-2xl font-bold text-gray-800">Total Balance</h3>
          <p className="text-3xl font-semibold text-blue-800 my-4">₹850</p>
          <Button
            color="success"
            onClick={() => setShowWithdrawModal(true)}
            className="w-1/2 mx-auto"
          >
            Withdraw
          </Button>
        </Card>

        {/* Account Details Card */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Account Details</h3>
            <Button
              color="light"
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </div>
          <div className="text-gray-700 space-y-3">
            <p>
              <strong>Name:</strong> {accountDetails.name}
            </p>
            <p>
              <strong>Bank Name:</strong> {accountDetails.bank}
            </p>
            <p>
              <strong>Account No:</strong> {accountDetails.accountNo}
            </p>
            <p>
              <strong>IFSC No:</strong> {accountDetails.ifsc}
            </p>
          </div>
        </Card>
      </div>

      {/* Payment History */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Payment History
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Date
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Task
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Amount 💵
                </th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="border-r border-gray-200 px-4 py-2 text-gray-600 text-center">
                    {payment.date}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-2 text-gray-800 font-medium text-center">
                    {payment.task}
                  </td>
                  <td className="flex gap-2 justify-center border-gray-200 px-4 py-2 text-green-600 font-semibold">
                    {payment.amount}
                    <span>
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdraw Modal */}
      <Modal
        show={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
      >
        <Modal.Header>Withdraw Amount</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount to Withdraw
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button color="gray" onClick={() => setShowWithdrawModal(false)}>
                Cancel
              </Button>
              <Button type="submit" color="success">
                Confirm Withdrawal
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Edit Account Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <Modal.Header>Edit Account Details</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdateAccount} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Holder Name
              </label>
              <input
                type="text"
                name="name"
                value={accountDetails.name}
                onChange={handleInputChange}
                className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name
              </label>
              <input
                type="text"
                name="bank"
                value={accountDetails.bank}
                onChange={handleInputChange}
                className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number
              </label>
              <input
                type="text"
                name="accountNo"
                value={accountDetails.accountNo}
                onChange={handleInputChange}
                className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IFSC Number
              </label>
              <input
                type="text"
                name="ifscNo"
                value={accountDetails.ifsc}
                onChange={handleInputChange}
                className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button color="gray" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="submit" color="blue">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MyAccount;
