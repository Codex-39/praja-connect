import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Clock, CheckCircle, XCircle, AlertCircle, AlertTriangle, MapPin, ArrowRight, BarChart3 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import * as api from '../services/api';

const CitizenDashboard = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await api.getMyComplaints();
        setComplaints(data);
      } catch (err) {
        setError('Failed to load complaints. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    emergency: complaints.filter(c => c.priority === 'Emergency').length,
  };

  const getStatusBadge = (status) => {
    const map = {
      'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock className="w-3.5 h-3.5" /> },
      'In Progress': { bg: 'bg-blue-100', text: 'text-blue-800', icon: <AlertCircle className="w-3.5 h-3.5" /> },
      'Resolved': { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle className="w-3.5 h-3.5" /> },
      'Rejected': { bg: 'bg-red-100', text: 'text-red-800', icon: <XCircle className="w-3.5 h-3.5" /> },
    };
    const s = map[status] || map['Pending'];
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
        {s.icon} {status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const map = {
      'Low': 'bg-green-50 text-green-700 border-green-200',
      'Medium': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'High': 'bg-orange-50 text-orange-700 border-orange-200',
      'Emergency': 'bg-red-50 text-red-700 border-red-200',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[priority] || ''}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, <span className="text-blue-600">{user?.name || 'Citizen'}</span>
          </h1>
          <p className="text-gray-600 mt-1">Track the status of your reported civic issues.</p>
        </div>
        <Link
          to="/new-complaint"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-5 h-5" />
          New Complaint
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gray-100 p-2 rounded-lg"><BarChart3 className="w-5 h-5 text-gray-600" /></div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</span>
          </div>
          <span className="text-3xl font-extrabold text-gray-900">{stats.total}</span>
        </div>
        <div className="bg-yellow-50/60 p-5 rounded-2xl border border-yellow-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-yellow-100 p-2 rounded-lg"><Clock className="w-5 h-5 text-yellow-600" /></div>
            <span className="text-xs font-semibold text-yellow-600 uppercase tracking-wider">Pending</span>
          </div>
          <span className="text-3xl font-extrabold text-yellow-700">{stats.pending}</span>
        </div>
        <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-lg"><AlertCircle className="w-5 h-5 text-blue-600" /></div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">In Progress</span>
          </div>
          <span className="text-3xl font-extrabold text-blue-700">{stats.inProgress}</span>
        </div>
        <div className="bg-green-50/60 p-5 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 p-2 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600" /></div>
            <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">Resolved</span>
          </div>
          <span className="text-3xl font-extrabold text-green-700">{stats.resolved}</span>
        </div>
        <div className="bg-red-50/60 p-5 rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-100 p-2 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
            <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Emergency</span>
          </div>
          <span className="text-3xl font-extrabold text-red-700">{stats.emergency}</span>
        </div>
      </div>

      {/* Complaints List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No complaints yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            You haven't reported any issues. Help keep your city clean and safe by reporting civic issues.
          </p>
          <Link
            to="/new-complaint"
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-6 py-3 rounded-xl text-sm font-bold transition-all"
          >
            Report an Issue
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">My Complaints</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Issue Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Ward</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {complaints.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px] block">{c.issueTitle || c.title}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{c.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className="text-sm text-gray-700 font-medium">{c.wardNumber || '—'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getPriorityBadge(c.priority || 'Low')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(c.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <span className="text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link to={`/complaint/${c._id}`} className="text-blue-600 hover:text-blue-800 font-semibold text-sm inline-flex items-center gap-1">
                        Track <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
