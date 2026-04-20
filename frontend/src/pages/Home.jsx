import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, IndianRupee, Loader2, Plus } from 'lucide-react';
import { getJobs } from '../services/job.service';
import { getCurrentUser } from '../services/auth.service';

const Home = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        location: '',
        employmentType: ''
    });

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const response = await getJobs(filters);
            setJobs(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchJobs();
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [filters]);

    return (
        <div className="space-y-8">
            {/* Hero / Welcome */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        {user?.role === 'RECRUITER' ? 'Recruiter Dashboard' : 'Explore Opportunities'}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {user?.role === 'RECRUITER' 
                            ? 'Manage your postings and find the best talent.' 
                            : 'Find your dream job at top tech companies.'}
                    </p>
                </div>
                {user?.role === 'RECRUITER' && (
                    <Link 
                        to="/recruiter/create-job" 
                        className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-shadow shadow-lg shadow-blue-100"
                    >
                        <Plus className="h-5 w-5 mr-2" /> Post New Job
                    </Link>
                )}
            </div>
            {/* Header & Filters */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search jobs by title..."
                        className="pl-10 w-full border-gray-200 focus:ring-blue-500 focus:border-blue-500 rounded-lg py-2 border outline-none"
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                    />
                </div>
                <div className="relative w-full md:w-48">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Location"
                        className="pl-10 w-full border-gray-200 focus:ring-blue-500 focus:border-blue-500 rounded-lg py-2 border outline-none"
                        onChange={(e) => setFilters({...filters, location: e.target.value})}
                    />
                </div>
                <select
                    className="w-full md:w-48 border-gray-200 focus:ring-blue-500 focus:border-blue-500 rounded-lg py-2 border text-gray-600 outline-none"
                    onChange={(e) => setFilters({...filters, employmentType: e.target.value})}
                >
                    <option value="">All Types</option>
                    <option value="FULL_TIME">Full-time</option>
                    <option value="PART_TIME">Part-time</option>
                    <option value="CONTRACT">Contract</option>
                </select>
            </div>

            {/* Jobs Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.length > 0 ? jobs.map((job) => (
                        <div 
                            key={job.id} 
                            onClick={() => navigate(`/jobs/${job.id}`)}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
                        >
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{job.title}</h3>
                            <p className="text-blue-600 font-medium mt-1">{job.company?.name || 'Confidential'}</p>
                            
                            <div className="mt-4 space-y-2 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2" /> {job.location}
                                </div>
                                <div className="flex items-center">
                                    <Briefcase className="h-4 w-4 mr-2" /> {job.employmentType.replace('_', ' ')}
                                </div>
                                <div className="flex items-center text-green-600 font-medium">
                                    <IndianRupee className="h-4 w-4 mr-2" /> {job.salary?.min} - {job.salary?.max}
                                </div>
                            </div>
                            
                            <button className="mt-6 w-full py-2 bg-gray-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                                View Details
                            </button>
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            No jobs found matching your search.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
