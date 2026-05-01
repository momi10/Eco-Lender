import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DollarSign, Clock, CheckCircle, AlertCircle, TrendingUp, ArrowUpRight, ArrowDownRight, FileText, Award, XCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { loanService } from '../services/api';

const Loans = () => {
  const { user } = useSelector(state => state.auth);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [paymentModal, setPaymentModal] = useState({ open: false, loan: null });
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentType, setPaymentType] = useState('principal');

  useEffect(() => {
    fetchLoans();
  }, [filter]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter) params.status = filter;
      const response = await loanService.getLoans(params);
      setLoans(response.data.loans || []);
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (loanId) => {
    try {
      await loanService.recordPayment(loanId, {
        amount: parseFloat(paymentAmount),
        type: paymentType
      });
      setPaymentModal({ open: false, loan: null });
      setPaymentAmount('');
      setPaymentType('principal');
      fetchLoans();
    } catch (error) {
      console.error('Error recording payment:', error);
    }
  };

  const handleCancelLoan = async (loanId) => {
    if (!window.confirm('Are you sure you want to cancel this pending loan? This action cannot be undone.')) {
      return;
    }
    try {
      await loanService.cancelLoan(loanId);
      fetchLoans();
    } catch (error) {
      console.error('Error cancelling loan:', error);
      alert(error.response?.data?.message || 'Error cancelling loan');
    }
  };

  const downloadPdf = async (loanId, type) => {
    try {
      const response = await loanService.downloadPdf(loanId, type);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-${loanId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      defaulted: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  // Calculate cash flow summary
  const cashFlowSummary = loans.reduce((acc, loan) => {
    const isLender = loan.lender?._id === user?._id;
    if (isLender) {
      acc.totalLent += loan.principalAmount || 0;
      acc.totalInterestEarned += loan.cashFlow?.totalInterestPaid || 0;
      acc.totalReceived += loan.cashFlow?.totalRepaid || 0;
      acc.totalOwedToMe += loan.cashFlow?.outstandingBalance || 0;
    } else {
      acc.totalBorrowed += loan.principalAmount || 0;
      acc.totalInterestPaid += loan.cashFlow?.totalInterestPaid || 0;
      acc.totalPaid += loan.cashFlow?.totalRepaid || 0;
      acc.totalOwedByMe += loan.cashFlow?.outstandingBalance || 0;
    }
    return acc;
  }, { totalLent: 0, totalBorrowed: 0, totalInterestEarned: 0, totalInterestPaid: 0, totalReceived: 0, totalPaid: 0, totalOwedToMe: 0, totalOwedByMe: 0 });

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">My Loans</h1>

        {/* Investment Summary */}
        {(cashFlowSummary.totalLent > 0 || user?.userType === 'lender') && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Investment Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Lent</p>
                    <p className="text-2xl font-bold text-gray-900">${cashFlowSummary.totalLent.toLocaleString()}</p>
                  </div>
                  <ArrowUpRight size={24} className="text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-5 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Received</p>
                    <p className="text-2xl font-bold text-gray-900">${cashFlowSummary.totalReceived.toLocaleString()}</p>
                  </div>
                  <ArrowDownRight size={24} className="text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-5 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Interest Earned</p>
                    <p className="text-2xl font-bold text-gray-900">${cashFlowSummary.totalInterestEarned.toFixed(2)}</p>
                  </div>
                  <TrendingUp size={24} className="text-yellow-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-5 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Outstanding Owed to You</p>
                    <p className="text-2xl font-bold text-gray-900">${cashFlowSummary.totalOwedToMe.toLocaleString()}</p>
                  </div>
                  <AlertCircle size={24} className="text-red-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Borrowing Summary */}
        {(cashFlowSummary.totalBorrowed > 0 || user?.userType === 'borrower') && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Borrowing Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Borrowed</p>
                    <p className="text-2xl font-bold text-gray-900">${cashFlowSummary.totalBorrowed.toLocaleString()}</p>
                  </div>
                  <ArrowUpRight size={24} className="text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-5 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Paid</p>
                    <p className="text-2xl font-bold text-gray-900">${cashFlowSummary.totalPaid.toLocaleString()}</p>
                  </div>
                  <ArrowDownRight size={24} className="text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-5 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Interest Paid</p>
                    <p className="text-2xl font-bold text-gray-900">${cashFlowSummary.totalInterestPaid.toFixed(2)}</p>
                  </div>
                  <TrendingUp size={24} className="text-yellow-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-5 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Outstanding Debt</p>
                    <p className="text-2xl font-bold text-gray-900">${cashFlowSummary.totalOwedByMe.toLocaleString()}</p>
                  </div>
                  <AlertCircle size={24} className="text-red-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-wrap gap-2">
            {['', 'active', 'completed', 'defaulted', 'pending'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Loans List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading loans...</p>
          </div>
        ) : loans.length > 0 ? (
          <div className="space-y-4">
            {loans.map(loan => (
              <div key={loan._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900">{loan.loanId || 'Loan'}</h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadge(loan.status)}`}>
                        {loan.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Project: <span className="font-medium">{loan.project?.title || 'N/A'}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      {loan.lender?._id === user?._id ? (
                        <>Borrower: <span className="font-medium">{loan.borrower?.firstName} {loan.borrower?.lastName}</span></>
                      ) : (
                        <>Lender: <span className="font-medium">{loan.lender?.firstName} {loan.lender?.lastName}</span></>
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="text-xs text-gray-500">Principal</p>
                      <p className="font-bold text-gray-900">${loan.principalAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Rate</p>
                      <p className="font-bold text-gray-900">{loan.interestRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Outstanding</p>
                      <p className="font-bold text-red-600">${loan.cashFlow?.outstandingBalance?.toLocaleString() || '0'}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {(loan.status === 'active' || loan.status === 'pending') && (
                      <button
                        onClick={() => setPaymentModal({ open: true, loan })}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg"
                      >
                        Make Payment
                      </button>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadPdf(loan._id, 'agreement')}
                        className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50"
                        title="Download Loan Agreement"
                      >
                        <FileText size={14} /> Agreement
                      </button>
                      <button
                        onClick={() => downloadPdf(loan._id, 'certificate')}
                        className="flex items-center gap-1 px-3 py-1.5 border border-yellow-300 text-yellow-700 text-xs font-medium rounded-lg hover:bg-yellow-50"
                        title="Download Impact Certificate"
                      >
                        <Award size={14} /> Certificate
                      </button>
                      {loan.status === 'pending' && loan.lender?._id === user?._id && (
                        <button
                          onClick={() => handleCancelLoan(loan._id)}
                          className="flex items-center gap-1 px-3 py-1.5 border border-red-300 text-red-700 text-xs font-medium rounded-lg hover:bg-red-50"
                          title="Cancel Pending Loan"
                        >
                          <XCircle size={14} /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment History */}
                {loan.payments && loan.payments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Payment History</p>
                    <div className="space-y-1">
                      {loan.payments.slice(-3).map((payment, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {new Date(payment.date).toLocaleDateString()} — {payment.transactionId}
                          </span>
                          <span className="font-medium text-green-600">${payment.amount?.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">No loans found</p>
            <p className="text-gray-400 text-sm mt-1">Invest in a project to create your first loan</p>
          </div>
        )}

        {/* Payment Modal */}
        {paymentModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Record Payment</h3>
              <p className="text-sm text-gray-600 mb-4">
                Outstanding: <span className="font-bold text-red-600">
                  ${paymentModal.loan?.cashFlow?.outstandingBalance?.toLocaleString()}
                </span>
              </p>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
              >
                <option value="principal">Principal Repayment</option>
                <option value="interest">Interest Payment</option>
              </select>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setPaymentModal({ open: false, loan: null })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePayment(paymentModal.loan._id)}
                  disabled={!paymentAmount}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg disabled:opacity-50"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Loans;
