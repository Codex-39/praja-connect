import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, AlertCircle, AlertTriangle, Trash2, Calendar, Search, BarChart3, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import * as api from '../services/api';
import ComplaintDetailModal from '../components/ComplaintDetailModal';

const CATEGORIES = [
  'All', 'Potholes', 'Drainage Overflow', 'Garbage Collection', 'Water Supply Problem',
  'Street Light Not Working', 'Road Damage', 'Sewage Leakage', 'Electricity Problem',
  'Illegal Dumping', 'Mosquito Breeding', 'Public Toilet Issue', 'Park Maintenance',
  'Traffic Signal Issue', 'Other',
];
const STATUSES = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'];
const PRIORITIES = ['All', 'Low', 'Medium', 'High', 'Emergency'];
const PIE_COLORS = ['#f59e0b', '#3b82f6', '#22c55e', '#ef4444'];

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);
  const [filterWard, setFilterWard] = useState('All');
  const [showDetail, setShowDetail] = useState(false);
  const [detailComplaint, setDetailComplaint] = useState(null);

  const openDetail = (complaint) => {
    setDetailComplaint(complaint);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setDetailComplaint(null);
  };
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [complaintsData, analyticsData] = await Promise.all([
        api.getAllComplaints(),
        api.getAnalytics(),
      ]);
      setComplaints(complaintsData);
      setAnalytics(analyticsData);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await api.updateComplaintStatus(id, newStatus);
      setComplaints(complaints.map(c => c._id === id ? { ...c, status: newStatus } : c));
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await api.deleteComplaint(id);
        setComplaints(complaints.filter(c => c._id !== id));
      } catch (err) {
        alert('Failed to delete complaint');
      }
    }
  };

  // Get unique wards from data
  const wards = ['All', ...new Set(complaints.map(c => c.wardNumber).filter(Boolean))].sort();

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = !searchTerm || (c.citizenName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || c.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || c.priority === filterPriority;
    const matchesWard = filterWard === 'All' || c.wardNumber === filterWard;
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority && matchesWard;
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    rejected: complaints.filter(c => c.status === 'Rejected').length,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and resolve citizen complaints.</p>
        </div>
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-indigo-200"
        >
          <BarChart3 className="w-5 h-5" />
          {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
        {[
          { label: 'Total', val: stats.total, bg: 'bg-white', border: 'border-gray-100', color: 'text-gray-900', labelColor: 'text-gray-500' },
          { label: 'Pending', val: stats.pending, bg: 'bg-yellow-50', border: 'border-yellow-100', color: 'text-yellow-700', labelColor: 'text-yellow-600' },
          { label: 'Progress', val: stats.inProgress, bg: 'bg-blue-50', border: 'border-blue-100', color: 'text-blue-700', labelColor: 'text-blue-600' },
          { label: 'Resolved', val: stats.resolved, bg: 'bg-green-50', border: 'border-green-100', color: 'text-green-700', labelColor: 'text-green-600' },
          { label: 'Rejected', val: stats.rejected, bg: 'bg-red-50', border: 'border-red-100', color: 'text-red-700', labelColor: 'text-red-600' },
          { label: 'Emergency', val: stats.emergency, bg: 'bg-red-50', border: 'border-red-200', color: 'text-red-800', labelColor: 'text-red-600' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} px-4 py-3 rounded-xl shadow-sm border ${s.border} flex flex-col items-center`}>
            <span className={`text-[10px] ${s.labelColor} font-bold uppercase tracking-wider`}>{s.label}</span>
            <span className={`text-xl font-extrabold ${s.color}`}>{s.val}</span>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      {showAnalytics && analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* By Category */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Complaints by Category</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={analytics.byCategory} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution Pie */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={analytics.byStatus} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {analytics.byStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* By Ward */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Complaints by Ward</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.byWard} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Emergency Count Card */}
          <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl shadow-sm p-6 text-white flex flex-col items-center justify-center">
            <AlertTriangle className="w-10 h-10 mb-3 opacity-80" />
            <span className="text-4xl font-extrabold">{analytics.emergencyCount}</span>
            <span className="text-sm font-semibold uppercase tracking-wider mt-1 opacity-90">Emergency Complaints</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Filters</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wider">Search Citizen</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Citizen name..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {[
            { label: 'Category', value: filterCategory, setter: setFilterCategory, options: CATEGORIES },
            { label: 'Ward', value: filterWard, setter: setFilterWard, options: wards },
            { label: 'Priority', value: filterPriority, setter: setFilterPriority, options: PRIORITIES },
            { label: 'Status', value: filterStatus, setter: setFilterStatus, options: STATUSES },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wider">{f.label}</label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                value={f.value}
                onChange={(e) => f.setter(e.target.value)}
              >
                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100 mb-6">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Table */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">No complaints found</h3>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-600">Showing {filteredComplaints.length} of {complaints.length} complaints</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Citizen</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Mobile</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Ward</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Colony</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredComplaints.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs text-gray-500 font-mono">
                        {c._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">{c.citizenName || c.userId?.name || '—'}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                      <span className="text-sm text-gray-600">{c.mobileNumber || c.userId?.mobile || '—'}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                      <span className="text-sm font-medium text-gray-700">{c.wardNumber || '—'}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                      <span className="text-sm text-gray-600 truncate max-w-[120px] block">{c.colonyName || '—'}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{c.category}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{getPriorityBadge(c.priority || 'Low')}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <select
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                        value={c.status}
                        disabled={updatingId === c._id}
                        onChange={(e) => handleStatusUpdate(c._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      {updatingId === c._id && <span className="ml-1 animate-spin inline-block w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full"></span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to="#" onClick={(e) => { e.preventDefault(); openDetail(c); }} className="text-blue-600 hover:text-blue-800 text-xs font-semibold">View</Link>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Complaint Detail Modal */}
      <ComplaintDetailModal
        complaint={detailComplaint}
        isOpen={showDetail}
        onClose={closeDetail}
      />
    </div>
  );
};

export default AdminDashboard;
