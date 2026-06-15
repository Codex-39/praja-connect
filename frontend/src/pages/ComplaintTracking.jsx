import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, AlertTriangle, MapPin, Calendar, User, FileText, Phone, Home } from 'lucide-react';
import * as api from '../services/api';

const ComplaintTracking = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const data = await api.getComplaintById(id);
        setComplaint(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load complaint details.');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaintDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex items-center gap-3 border border-red-100 shadow-sm">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="font-bold">Error Loading Complaint</h3>
            <p className="text-sm">{error || 'Complaint not found.'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Determine current step index for status timeline
  const statuses = ['Pending', 'In Progress', 'Resolved'];
  const isRejected = complaint.status === 'Rejected';
  const currentStatusIndex = isRejected ? -1 : statuses.indexOf(complaint.status);

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Low': return 'bg-green-400/20 text-green-300 border-green-400/30';
      case 'Medium': return 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30';
      case 'High': return 'bg-orange-400/20 text-orange-300 border-orange-400/30';
      case 'Emergency': return 'bg-red-400/20 text-red-300 border-red-400/30';
      default: return 'bg-gray-400/20 text-gray-300 border-gray-400/30';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-md">
                  {complaint.category}
                </span>
                {complaint.priority && (
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${getPriorityStyle(complaint.priority)}`}>
                    {complaint.priority === 'Emergency' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                    {complaint.priority}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold">{complaint.issueTitle || complaint.title}</h1>
              <p className="text-blue-100 text-sm mt-1">Complaint ID: {complaint._id}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-blue-200 block uppercase tracking-wider font-semibold">Current Status</span>
              <div className="mt-1">
                {complaint.status === 'Pending' && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                    <Clock className="w-4 h-4" /> Pending
                  </span>
                )}
                {complaint.status === 'In Progress' && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold bg-blue-400/20 text-blue-300 border border-blue-400/30">
                    <AlertCircle className="w-4 h-4" /> In Progress
                  </span>
                )}
                {complaint.status === 'Resolved' && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold bg-green-400/20 text-green-300 border border-green-400/30">
                    <CheckCircle className="w-4 h-4" /> Resolved
                  </span>
                )}
                {complaint.status === 'Rejected' && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold bg-red-400/20 text-red-300 border border-red-400/30">
                    <XCircle className="w-4 h-4" /> Rejected
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Tracking Stepper */}
        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" /> Resolution Timeline
          </h2>

          {isRejected ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold">Complaint Rejected</h4>
                <p className="text-sm mt-0.5">This complaint was reviewed and rejected by the administrator.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between relative gap-8 md:gap-4 md:px-8">
              {/* Connector line for Desktop */}
              <div className="hidden md:block absolute top-[22px] left-[10%] right-[10%] h-[3px] bg-gray-200 -z-0">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${currentStatusIndex === 0 ? '0%' : currentStatusIndex === 1 ? '50%' : '100%'}` }}
                />
              </div>

              {/* Step 1: Pending */}
              <div className="flex md:flex-col items-center gap-4 md:gap-2 z-10 w-full md:w-1/3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all shadow-sm ${
                  currentStatusIndex >= 0
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-left md:text-center">
                  <h4 className="font-bold text-gray-900 text-sm">Complaint Submitted</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Step 2: In Progress */}
              <div className="flex md:flex-col items-center gap-4 md:gap-2 z-10 w-full md:w-1/3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all shadow-sm ${
                  currentStatusIndex >= 1
                    ? 'bg-green-500 border-green-500 text-white'
                    : currentStatusIndex === 0
                      ? 'bg-blue-600 border-blue-600 text-white animate-pulse'
                      : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="text-left md:text-center">
                  <h4 className="font-bold text-gray-900 text-sm">In Progress</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Under investigation by local department</p>
                </div>
              </div>

              {/* Step 3: Resolved */}
              <div className="flex md:flex-col items-center gap-4 md:gap-2 z-10 w-full md:w-1/3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all shadow-sm ${
                  currentStatusIndex >= 2
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="text-left md:text-center">
                  <h4 className="font-bold text-gray-900 text-sm">Resolved</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Issue successfully fixed</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Complaint Info Section */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Issue Description */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2">Issue Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-100">
                {complaint.issueDescription || complaint.description}
              </p>
            </div>

            {/* Location Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><MapPin className="w-5 h-5" /></div>
                <div>
                  <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">Location</span>
                  <span className="text-gray-900 font-medium block">
                    {complaint.colonyName && `${complaint.colonyName}, `}
                    {complaint.streetName && `${complaint.streetName}`}
                    {complaint.wardNumber && ` (Ward ${complaint.wardNumber})`}
                  </span>
                  {complaint.landmark && <span className="text-sm text-gray-500">Near {complaint.landmark}</span>}
                  {/* Fallback for old data */}
                  {!complaint.colonyName && complaint.location && (
                    <span className="text-gray-900 font-medium">{complaint.location}</span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Calendar className="w-5 h-5" /></div>
                <div>
                  <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">Date Submitted</span>
                  <span className="text-gray-900 font-medium">{new Date(complaint.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Citizen Info */}
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><User className="w-5 h-5" /></div>
                <div>
                  <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">Citizen Details</span>
                  <span className="text-gray-900 font-medium block">{complaint.citizenName || complaint.userId?.name || 'Unknown'}</span>
                  <span className="text-sm text-gray-500">{complaint.mobileNumber || complaint.userId?.mobile || ''}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Section */}
          <div className="flex flex-col justify-start">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Photo Evidence</h3>
            {complaint.imageUrl ? (
              <div className="border border-gray-150 rounded-2xl overflow-hidden shadow-sm bg-gray-50 h-64 md:h-80">
                <img
                  src={complaint.imageUrl}
                  alt={complaint.issueTitle || complaint.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=No+Photo+Available'; }}
                />
              </div>
            ) : (
              <div className="border border-gray-200 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 bg-gray-50/50 text-center h-64 md:h-80">
                <FileText className="w-12 h-12 text-gray-350 mb-2" />
                <p className="text-gray-500 text-sm font-medium">No photo evidence was attached to this report.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintTracking;
