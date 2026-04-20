import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, Calendar, Clock, ChevronLeft, Loader2, Edit, Send } from 'lucide-react';
import { getJobById } from '../services/job.service';
import { getCurrentUser } from '../services/auth.service';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = getCurrentUser();
    
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ownership & Role detection (Exhaustive Check)
    const currentUserId = user?.id || user?._id || user?.userId;
    const jobOwnerId = job?.postedBy;
    
    const isOwner = !!(jobOwnerId && currentUserId && String(jobOwnerId) === String(currentUserId));
    const isSeeker = user?.role === 'JOB_SEEKER';
    const isRecruiter = user?.role === 'RECRUITER';

    // Debugging logs (Mandatory per test requirements)
    if (job && !loading) {
        console.log("Job postedBy:", job.postedBy);
        console.log("Current user ID:", user?.id);
        console.log("Is Owner:", isOwner);
    }

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await getJobById(id);
                setJob(response.data);
            } catch (error) {
                console.error(error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id, navigate]);

    if (loading) return (
        <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
        </div>
    );

    if (!job) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Back Button */}
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
            >
                <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Jobs
            </button>

            {/* Main Header Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                        <p className="text-xl text-blue-600 font-semibold mt-1">{job.company?.name}</p>
                        
                        <div className="mt-4 flex flex-wrap gap-4 text-gray-500">
                            <div className="flex items-center">
                                <MapPin className="h-5 w-5 mr-1.5 text-gray-400" /> {job.location}
                            </div>
                            <div className="flex items-center">
                                <Briefcase className="h-5 w-5 mr-1.5 text-gray-400" /> {job.employmentType.replace('_', ' ')}
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-5 w-5 mr-1.5 text-gray-400" /> {job.experienceLevel}
                            </div>
                        </div>
                    </div>
                    
                    {/* Action Buttons: Strictly Role-Based */}
                    <div className="flex flex-wrap gap-4">
                        {isOwner ? (
                            <>
                                <button 
                                    className="bg-amber-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-200 flex items-center"
                                >
                                    <Edit className="h-5 w-5 mr-2" /> Edit Job
                                </button>
                                <button 
                                    className="bg-red-50 text-red-600 px-8 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center border border-red-100"
                                >
                                    Delete Job
                                </button>
                            </>
                        ) : isSeeker ? (
                            <button 
                                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center"
                            >
                                <Send className="h-5 w-5 mr-2" /> Apply for this Job
                            </button>
                        ) : isRecruiter ? (
                            <div className="bg-gray-100 text-gray-500 px-6 py-3 rounded-xl font-medium border border-gray-200 italic flex items-center">
                                <Briefcase className="h-4 w-4 mr-2" /> Published by another Recruiter
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                        <IndianRupee className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Salary Range</p>
                            <p className="text-gray-900 font-semibold">{job.salary?.min} - {job.salary?.max}</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                        <Calendar className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Posted On</p>
                            <p className="text-gray-900 font-semibold">{new Date(job.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8 text-left">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">Job Description</h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">Skills Required</h2>
                    <div className="flex flex-wrap gap-2">
                        {job.skillsRequired.split(',').map((skill, idx) => (
                            <span key={idx} className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-100">
                                {skill.trim()}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
