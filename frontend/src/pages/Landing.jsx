import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, MapPin, Activity } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Activity className="h-20 w-20 text-blue-600 mx-auto mb-6" />
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          Empowering Citizens with <br className="hidden md:block" />
          <span className="text-blue-600">Praja Connect</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Report civic issues in your locality, track their resolution status in real-time, and help build a better community together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Citizen Register <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-blue-600 hover:bg-blue-50 border border-blue-200 px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-sm"
          >
            Citizen Login
          </Link>
          <Link
            to="/admin/login"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-gray-800 text-white hover:bg-gray-900 border border-gray-700 px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-sm"
          >
            Admin Login
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="text-blue-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Report Issues</h3>
            <p className="text-gray-600">Easily report problems like bad roads, broken streetlights, or garbage pile-ups with precise locations.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Activity className="text-green-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor the status of your complaints in real-time from pending to resolved.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <ShieldCheck className="text-purple-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Action</h3>
            <p className="text-gray-600">Local authorities review and take action on verified citizen reports efficiently.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
