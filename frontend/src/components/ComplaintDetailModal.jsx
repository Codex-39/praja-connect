import { useEffect } from 'react';
import { XCircle, MapPin, Image } from 'lucide-react';

const ComplaintDetailModal = ({ complaint, isOpen, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !complaint) return null;

  const openLocation = () => {
    if (complaint.latitude && complaint.longitude) {
      const url = `https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`;
      window.open(url, '_blank');
    } else {
      alert('Location not available');
    }
  };

  // Helper to build full image URL (handles dev proxy)
  const getImageUrl = () => {
    if (!complaint.imageUrl) return '';
    // If imageUrl already absolute (starts with http) use it, else prepend API URL
    if (complaint.imageUrl.startsWith('http')) return complaint.imageUrl;
    const base = import.meta.env.VITE_API_URL || '';
    return `${base}${complaint.imageUrl}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <XCircle className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4">Complaint Details</h2>
        <div className="space-y-2">
          <p><span className="font-semibold">Citizen:</span> {complaint.citizenName}</p>
          <p><span className="font-semibold">Mobile:</span> {complaint.mobileNumber}</p>
          <p><span className="font-semibold">Category:</span> {complaint.category}</p>
          <p><span className="font-semibold">Title:</span> {complaint.issueTitle}</p>
          <p><span className="font-semibold">Description:</span> {complaint.issueDescription}</p>
          <p><span className="font-semibold">Priority:</span> {complaint.priority}</p>
          <p><span className="font-semibold">Status:</span> {complaint.status}</p>
          {/* Address fields */}
          <p><span className="font-semibold">Colony:</span> {complaint.colonyName}</p>
          <p><span className="font-semibold">Street:</span> {complaint.streetName}</p>
          <p><span className="font-semibold">Ward:</span> {complaint.wardNumber}</p>
          <p><span className="font-semibold">Landmark:</span> {complaint.landmark || 'N/A'}</p>
          <p><span className="font-semibold">Pincode:</span> {complaint.pincode}</p>
          <p><span className="font-semibold">Latitude:</span> {complaint.latitude || 'N/A'}</p>
          <p><span className="font-semibold">Longitude:</span> {complaint.longitude || 'N/A'}</p>
          {/* Image preview */}
          {complaint.imageUrl && (
            <div className="mt-4">
              <p className="font-semibold mb-1">Uploaded Image:</p>
              <img
                src={getImageUrl()}
                alt="Complaint"
                className="max-w-full h-auto rounded cursor-pointer hover:opacity-90 transition"
                onClick={() => window.open(getImageUrl(), '_blank')}
              />
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={openLocation}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <MapPin className="w-4 h-4" /> Open Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailModal;
