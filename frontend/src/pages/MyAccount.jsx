import { useState, useEffect } from "react";
import {
  Wallet,
  Edit2,
  CheckCircle2,
  Building2,
  CreditCard,
} from "lucide-react";
import { useSelector } from "react-redux";
import api from "../utils/api"; 

function MyAccount() {
  const [accountDetails, setAccountDetails] = useState({
    bankName: "",
    accountNo: "",
    IFSCNo: "",
    totalBalance: 0,
    expiredDate:"",
    CVC:""
  });
  const user = useSelector((state) => state.auth.user);
  const [paymentHistory, setPaymentHistory] = useState([]); 
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchAccountDetails = async () => {
    try {
      const response = await api.get(`/api/accounts/${user.EID}`, {
        withCredentials: true,
      });
      setAccountDetails(response.data);
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };

  useEffect(() => {
    

    const fetchPaymentHistory = async () => {
      try {
        const response = await api.get(`/api/gigs/payments/${user.EID}`, {
          withCredentials: true,
        });
        setPaymentHistory(response.data);
      } catch (error) {
        console.error("Error fetching payment history:", error);
      }
    };

    if (user && user.EID) {
      fetchAccountDetails();
      fetchPaymentHistory();
    }
  }, [user]);

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/accounts/${user.EID}`, accountDetails, {
        withCredentials: true,
      });
      setShowEditModal(false);
      fetchAccountDetails(); 
    } catch (error) {
      console.error("Error updating account details:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options).replace(/\//g, '-');
    };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-stone-800">My Account</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-stone-500">
              Welcome back, {accountDetails.name || user.fullName}
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
                <p className="text-4xl font-bold">
                  ₹{accountDetails.totalBalance || 0}
                </p>
                <p className="text-sm text-stone-300 mt-1">
                  Available for withdrawal
                </p>
              </div>
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
                <Building2 className="w-5 h-5 text-stone-500" />
                <div>
                  <p className="text-sm text-stone-500">Bank Name</p>
                  <p className="font-medium text-stone-800">
                    {accountDetails.bankName}
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
              <div className="flex items-center space-x-3 p-3 bg-stone-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-stone-500" />
                <div>
                  <p className="text-sm text-stone-500">IFSC Code</p>
                  <p className="font-medium text-stone-800">
                    {accountDetails.IFSCNo}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-stone-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-stone-500" />
                <div>
                  <p className="text-sm text-stone-500">Expired Date(MM/YY)</p>
                  <p className="font-medium text-stone-800">
                    {accountDetails.expiredDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-stone-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-stone-500" />
                <div>
                  <p className="text-sm text-stone-500">CVC</p>
                  <p className="font-medium text-stone-800">
                    {accountDetails.CVC}
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
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paymentHistory.map((payment, index) => (
                  <tr key={index} className="text-stone-800">
                    <td className="py-4">{formatDate(payment.completedAt)}</td>
                    <td className="py-4 font-medium">{payment.title}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center space-x-1 text-stone-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{payment.amount}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={accountDetails.bankName}
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
                    name="IFSCNo"
                    value={accountDetails.IFSCNo}
                    onChange={handleInputChange}
                    className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Expired Date
                  </label>
                  <input
                    type="text"
                    name="expiredDate"
                    value={accountDetails.expiredDate}
                    onChange={handleInputChange}
                    className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                      CVC
                  </label>
                  <input
                    type="number"
                    name="CVC"
                    value={accountDetails.CVC}
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
                  <button>
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
