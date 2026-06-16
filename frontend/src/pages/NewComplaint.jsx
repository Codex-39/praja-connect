import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, AlertCircle, ArrowLeft, Image as ImageIcon, MapPin, User, Phone, FileText } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import * as api from '../services/api';

const CATEGORIES = [
  'Potholes',
  'Drainage Overflow',
  'Garbage Collection',
  'Water Supply Problem',
  'Street Light Not Working',
  'Road Damage',
  'Sewage Leakage',
  'Electricity Problem',
  'Illegal Dumping',
  'Mosquito Breeding',
  'Public Toilet Issue',
  'Park Maintenance',
  'Traffic Signal Issue',
  'Other',
];

const PRIORITIES = ['Low', 'Medium', 'High', 'Emergency'];

const NewComplaint = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    citizenName: user?.name || '',
    mobileNumber: user?.mobile || '',
    colonyName: '',
    streetName: '',
    wardNumber: '',
    landmark: '',
    category: '',
    issueTitle: '',
    issueDescription: '',
    priority: '',
    pincode: '',
    latitude: '',
    longitude: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return setError('Image must be less than 5MB');
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Location obtained', position.coords);
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
        console.log('FormData after location set', {
          ...formData,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        });
        setLoading(false);
      },
      (err) => {
        setError('Unable to retrieve location');
        setLoading(false);
      }
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Submitting complaint with data:', formData);
      const payload = {
        ...formData,
        image: imagePreview // Send the base64 image string
      };

      await api.createComplaint(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1';

  const getPriorityColor = (p) => {
    switch (p) {
      case 'Low': return 'text-green-700 bg-green-50 border-green-200';
      case 'Medium': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'High': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Emergency': return 'text-red-700 bg-red-50 border-red-200';
      default: return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" /> Report a New Issue
          </h1>
          <p className="text-blue-100 mt-1 text-sm">Provide accurate details to help us resolve the issue quickly.</p>
        </div>

        <form onSubmit={onSubmit} className="p-8 space-y-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Section: Citizen Info */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
              <User className="w-5 h-5 text-blue-600" /> Citizen Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Citizen Name *</label>
                <input type="text" name="citizenName" required value={formData.citizenName} onChange={onChange} className={inputClass} placeholder="Full name" />
              </div>
              <div>
                <label className={labelClass}>Mobile Number *</label>
                <input type="tel" name="mobileNumber" required value={formData.mobileNumber} onChange={onChange} className={inputClass} placeholder="10-digit mobile number" />
              </div>
            </div>
          </div>

          {/* Section: Location Info */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
              <MapPin className="w-5 h-5 text-blue-600" /> Location Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Colony Name *</label>
                <input type="text" name="colonyName" required value={formData.colonyName} onChange={onChange} className={inputClass} placeholder="Colony / Area name" />
              </div>
              <div>
                <label className={labelClass}>Street Name *</label>
                <input type="text" name="streetName" required value={formData.streetName} onChange={onChange} className={inputClass} placeholder="Street / Road name" />
              </div>
              <div>
                <label className={labelClass}>Ward Number *</label>
                <input type="text" name="wardNumber" required value={formData.wardNumber} onChange={onChange} className={inputClass} placeholder="Ward No." />
              </div>
              <div>
                <label className={labelClass}>Landmark</label>
                <input type="text" name="landmark" value={formData.landmark} onChange={onChange} className={inputClass} placeholder="Nearby landmark (optional)" />
              </div>

                {/* Location fields and button in a responsive grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                  <div>
                    <label className={labelClass}>Pincode *</label>
                    <input type="text" name="pincode" required value={formData.pincode} onChange={onChange} className={inputClass} placeholder="6-digit pincode" />
                  </div>
                  <div className="flex items-center">
                    <button type="button" onClick={handleGetLocation} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                      <MapPin className="w-4 h-4" /> Get Current Location
                    </button>
                  </div>
                  <div>
                    <label className={labelClass}>Latitude</label>
                    <input type="text" name="latitude" readOnly value={formData.latitude} className={inputClass} placeholder="Latitude" />
                  </div>
                  <div>
                    <label className={labelClass}>Longitude</label>
                    <input type="text" name="longitude" readOnly value={formData.longitude} className={inputClass} placeholder="Longitude" />
                  </div>
                </div>
            </div>
          </div>

          {/* Section: Issue Details */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
              <AlertCircle className="w-5 h-5 text-blue-600" /> Issue Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Issue Title *</label>
                <input type="text" name="issueTitle" required value={formData.issueTitle} onChange={onChange} className={inputClass} placeholder="E.g., Large pothole near school" />
              </div>
              <div>
                <label className={labelClass}>Category *</label>
                <select name="category" required value={formData.category} onChange={onChange} className={`${inputClass} bg-white`}>
                  <option value="" disabled>Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Issue Description *</label>
                <textarea name="issueDescription" required rows={4} value={formData.issueDescription} onChange={onChange} className={`${inputClass} resize-none`} placeholder="Describe the issue in detail..." />
              </div>
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className={labelClass}>Priority Level *</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {PRIORITIES.map((p) => (
                <label
                  key={p}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all font-semibold text-sm ${
                    formData.priority === p
                      ? `${getPriorityColor(p)} ring-2 ring-offset-1 ring-blue-400 shadow-sm`
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={p}
                    checked={formData.priority === p}
                    onChange={onChange}
                    className="sr-only"
                    required
                  />
                  {p}
                </label>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelClass}>Photo Evidence (Optional)</label>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors relative">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="relative w-full max-w-sm mx-auto">
                    <img src={imagePreview} alt="Preview" className="rounded-lg object-cover h-48 w-full shadow-sm" />
                    <button
                      type="button"
                      onClick={() => { setImage(null); setImagePreview(null); }}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200 transition-colors"
                    >
                      <AlertCircle className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input id="file-upload" name="image" type="file" className="sr-only" onChange={onImageChange} accept="image/*" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 px-8 py-3 rounded-xl text-base font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 transform hover:-translate-y-0.5"
            >
              <Upload className="w-5 h-5" />
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewComplaint;
