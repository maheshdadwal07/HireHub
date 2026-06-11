import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    MapPin, Briefcase, IndianRupee, Calendar, Clock, 
    ChevronLeft, Loader2, Edit, Send, CheckCircle, 
    AlertCircle, Building2, ShieldCheck, Globe, Zap,
    ArrowLeft, Trash2, Star
} from 'lucide-react';
import { getJobById, deleteJob } from '../services/job.service';
import { getCurrentUser } from '../services/auth.service';
import { applyToJob, getMyApplications } from '../services/application.service';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = getCurrentUser();
    
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [applicationStatus, setApplicationStatus] = useState(null);
    const [fetchingStatus, setFetchingStatus] = useState(false);

    const handleApply = async () => {
        setApplying(true);
        setMessage({ type: '', text: '' });
        try {
            await applyToJob(id);
            setMessage({ type: 'success', text: 'Application submitted successfully!' });
            await fetchApplicationStatus();
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to apply' });
        } finally {
            setApplying(false);
        }
    };

    const fetchApplicationStatus = async () => {
        if (user?.role !== 'JOB_SEEKER' || !id) return;
        try {
            setFetchingStatus(true);
            const response = await getMyApplications();
            const currentAppStatus = response.data.find(app => String(app.job?.id) === String(id));
            setApplicationStatus(currentAppStatus || null);
        } catch (error) {
            console.error('Failed to fetch application status:', error);
        } finally {
            setFetchingStatus(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this job posting?')) return;
        try {
            await deleteJob(id);
            navigate('/recruiter/jobs');
        } catch (error) {
            console.error(error);
        }
    };

    const currentUserId = user?.id || user?._id || user?.userId;
    const jobOwnerId = job?.postedBy;
    const isOwner = !!(jobOwnerId && currentUserId && String(jobOwnerId) === String(currentUserId));
    const isSeeker = user?.role === 'JOB_SEEKER';
    const isRecruiter = user?.role === 'RECRUITER';

    const getStatusTheme = (status) => {
        switch (status) {
            case 'APPLIED': return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: Clock };
            case 'SHORTLISTED': return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: Star };
            case 'INTERVIEW': return { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', icon: Zap };
            case 'HIRED': return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle };
            case 'REJECTED': return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: AlertCircle };
            default: return { color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100', icon: Clock };
        }
    };

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
    }, [id]);

    useEffect(() => {
        if (user?.role === 'JOB_SEEKER' && id) {
            fetchApplicationStatus();
        }
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="space-y-4 text-center">
                <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
                <p className="text-slate-500 font-black text-xs uppercase tracking-widest">Loading opportunity...</p>
            </div>
        </div>
    );

    if (!job) return null;

    const theme = applicationStatus ? getStatusTheme(applicationStatus.status) : null;
    const StatusIcon = theme?.icon;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-32">
          
            <div className="bg-white border-b border-slate-100 pt-12 pb-6">
                <div className="max-w-5xl mx-auto px-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-xs uppercase tracking-widest transition-colors group mb-8"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> 
                        Back to browsing
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                {job.company?.logoUrl ? (
                                    <img src={job.company.logoUrl} alt={job.company.name} className="w-20 h-20 rounded-[2rem] object-contain bg-white shadow-2xl shadow-slate-200 p-2 border border-slate-50" />
                                ) : (
                                    <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-slate-200">
                                        {(typeof job.company === 'object' ? job.company.name : job.company)?.[0] || 'J'}
                                    </div>
                                )}
                                <div>
                                    <h1 className="text-4xl font-black text-slate-900 leading-tight mb-1">{job.title}</h1>
                                    <Link to={`/company/${job.company?.id}`} className="text-xl text-blue-600 font-bold hover:underline">
                                        {typeof job.company === 'object' ? job.company.name : job.company}
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-6 pt-2">
                                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                    <MapPin className="w-4 h-4 text-slate-300" /> {job.location}
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                    <Briefcase className="w-4 h-4 text-slate-300" /> {job.employmentType}
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                    <ShieldCheck className="w-4 h-4 text-slate-300" /> {job.experienceLevel}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 min-w-[240px]">
                            {isOwner ? (
                                <div className="grid grid-cols-1 gap-3">
                                    <button 
                                        onClick={() => navigate(`/recruiter/edit/${job.id}`)}
                                        className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-slate-100 hover:bg-black hover:-translate-y-0.5 transition-all active:scale-95"
                                    >
                                        <Edit className="w-5 h-5" /> Edit Opportunity
                                    </button>
                                    <button 
                                        onClick={handleDelete}
                                        className="flex items-center justify-center gap-2 bg-white text-red-500 border-2 border-red-50 px-8 py-4 rounded-2xl font-black hover:bg-red-50 transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" /> Delete Posting
                                    </button>
                                </div>
                            ) : isSeeker ? (
                                <>
                                    {applicationStatus ? (
                                        <div className={`${theme.bg} ${theme.border} border-2 p-6 rounded-3xl space-y-3 relative overflow-hidden`}>
                                            <div className="flex items-center gap-3 relative z-10">
                                                <div className={`w-10 h-10 ${theme.bg} border-2 ${theme.border} rounded-xl flex items-center justify-center ${theme.color}`}>
                                                    <StatusIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className={`font-black uppercase tracking-widest text-[10px] ${theme.color}`}>Status</p>
                                                    <p className="font-black text-slate-900 text-lg">{applicationStatus.status}</p>
                                                </div>
                                            </div>
                                            <p className="text-slate-500 font-medium text-xs leading-relaxed relative z-10">
                                                Applied on {new Date(applicationStatus.appliedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={handleApply}
                                            disabled={applying}
                                            className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black shadow-2xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {applying ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-white" />}
                                            {applying ? 'Submitting...' : 'Apply for this Role'}
                                        </button>
                                    )}
                                    {message.text && (
                                        <div className={`text-center py-3 rounded-2xl font-black text-xs uppercase tracking-widest ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            {message.text}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="bg-slate-100 p-6 rounded-3xl border border-slate-200">
                                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2 text-center">Recruiter View</p>
                                    <p className="text-slate-500 font-bold text-sm text-center italic">Published by another recruiter</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 mt-12 grid lg:grid-cols-3 gap-12">
                
                <div className="lg:col-span-2 space-y-12">
                    <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                                Job Description
                            </h2>
                            <div className="text-slate-600 font-medium leading-relaxed whitespace-pre-line text-lg">
                                {job.description}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
                                Skills Required
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {job.skillsRequired.split(',').map((skill, idx) => (
                                    <span key={idx} className="bg-slate-50 text-slate-700 px-6 py-2.5 rounded-2xl text-sm font-black border border-slate-100 hover:bg-white hover:border-blue-600 hover:text-blue-600 transition-all cursor-default">
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="bg-slate-900 p-12 rounded-[3.5rem] text-white space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700"></div>
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center p-3">
                                    {job.company?.logoUrl ? (
                                        <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <Building2 className="w-10 h-10 text-slate-200" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Company Overview</p>
                                    <h2 className="text-3xl font-black text-white">{job.company?.name}</h2>
                                </div>
                            </div>
                            <Link to={`/company/${job.company?.id}`} className="px-8 py-4 bg-white text-slate-900 font-black rounded-2xl text-sm hover:bg-blue-50 transition-all active:scale-95">
                                Visit Company Page
                            </Link>
                        </div>

                        <p className="text-slate-400 font-medium leading-relaxed relative z-10 text-lg">
                            {job.company?.description || "A leading innovator in the industry, focused on building the future with world-class talent and ground-breaking technology solutions."}
                        </p>
                    </section>
                </div>

              
                <div className="space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[3rem] text-white space-y-8 shadow-2xl shadow-slate-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
                        
                        <div className="space-y-6 relative z-10">
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Compensation</p>
                                <p className="text-3xl font-black text-white">
                                    {job.salary ? `₹${job.salary.min?.toLocaleString()} - ${job.salary.max?.toLocaleString()}` : 'Negotiable'}
                                </p>
                                <p className="text-slate-500 font-bold text-xs mt-1">Per annum (INR)</p>
                            </div>

                            <div className="h-px bg-white/10"></div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-blue-400">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Posted On</p>
                                        <p className="font-black text-sm">{new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Work Type</p>
                                        <p className="font-black text-sm capitalize">{job.employmentType.replace('_', ' ')}</p>
                                    </div>
                                </div>
                                {job.applicationDeadline && (
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-red-400">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deadline</p>
                                            <p className="font-black text-sm">{new Date(job.applicationDeadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-4">
                        <p className="text-slate-900 font-black text-sm mb-4">About the Company</p>
                        <div className="flex items-center gap-4 mb-4">
                        {job.company?.logoUrl ? (
                            <img src={job.company.logoUrl} alt={job.company.name} className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-100 p-1" />
                        ) : (
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-400">
                                {(typeof job.company === 'object' ? job.company?.name : job.company)?.[0] || 'J'}
                            </div>
                        )}
                            <div>
                                <p className="font-black text-slate-900 leading-none mb-1">
                                    {typeof job.company === 'object' ? job.company?.name : (job.company || 'Unknown Company')}
                                </p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Employer</p>
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            A leading innovator in the industry, focused on building the future with world-class talent.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
