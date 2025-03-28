import { useState, useEffect } from "react";
import {
  Wallet,
  CheckCircle2,
} from "lucide-react";
import { useSelector } from "react-redux";
import api from "../utils/api"; 

function MyAccount() {
  
  const user = useSelector((state) => state.auth.user);
  const [paymentHistory, setPaymentHistory] = useState([]); 
  const [accountBalance, setAccountBalance] = useState(0); 

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

    const fetchAccountBalance = async () => {
      try {
        const response = await api.get(`http://localhost:3000/api/users/get-user/${user.EID}`, {
          withCredentials: true,
        });
        setAccountBalance(response.data.accountBalance); 
      } catch (error) {
        console.error("Error fetching account balance:", error);
      }
    };

    if (user && user.EID) {
      fetchPaymentHistory();
      fetchAccountBalance(); 
    }
  }, [user]);

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
              Welcome back, {user.fullName || user.fullName}
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
                  ₹{accountBalance || 0} 
                </p>
                <p className="text-sm text-stone-300 mt-1">
                  Available for withdrawal
                </p>
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
      </div>
    </div>
  );
}

export default MyAccount;
