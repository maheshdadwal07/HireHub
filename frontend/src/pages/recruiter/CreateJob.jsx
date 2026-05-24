import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
    Briefcase, MapPin, IndianRupee, Clock, Loader2, 
    Plus, AlertCircle, Save, ArrowLeft, Building2, 
    Zap, Sparkles, ChevronRight, CheckCircle2,
    Calendar, Target, FileText
} from 'lucide-react';
import { createJob, getJobById, updateJob } from '../../services/job.service';
import { getCompanies } from '../../services/company.service';
import { getCurrentUser } from '../../services/auth.service';
import { getMyMemberships } from '../../services/companyMember.service';

const CreateJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skillsRequired: '',
        location: '',
        employmentType: 'FULL_TIME',
        experienceLevel: 'FRESHER',
        salaryMin: '',
        salaryMax: '',
        applicationDeadline: '',
        companyId: ''
    });

    useEffect(() => {
        const user = getCurrentUser();
        if (!user) {
            navigate('/login');
            return;
        }

        const loadInitialData = async () => {
            try {
                // Fetch approved memberships
                const memRes = await getMyMemberships();
                const memberships = memRes.data?.data || [];
                const approvedMemberships = memberships.filter(m => m.status === 'APPROVED' && m.company);
                
                const companyList = approvedMemberships.map(m => m.company);
                setCompanies(companyList);

                if (isEditMode) {
                    const jRes = await getJobById(id);
                    const job = jRes.data;
                    if (job) {
                        setFormData({
                            title: job.title || '',
                            description: job.description || '',
                            skillsRequired: job.skillsRequired || '',
                            location: job.location || '',
                            employmentType: job.employmentType || 'FULL_TIME',
                            experienceLevel: job.experienceLevel || 'FRESHER',
                            salaryMin: job.salary?.min || '',
                            salaryMax: job.salary?.max || '',
                            applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
                            companyId: job.company?.id || ''
                        });
                    }
                } else if (companyList.length > 0) {
                    setFormData(prev => ({ ...prev, companyId: companyList[0]?.id || '' }));
                } else {
                    setError('You need to be an approved member of a company before posting a job.');
                }
            } catch (err) {
                console.error('Error loading initial data:', err);
                setError('Failed to load required data. Please ensure you have a registered and approved company profile.');
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [id, isEditMode, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const data = {
                ...formData,
                salaryMin: parseInt(formData.salaryMin),
                salaryMax: parseInt(formData.salaryMax),
                companyId: parseInt(formData.companyId)
            };
            
            if (isEditMode) {
                await updateJob(id, data);
                navigate(`/jobs/${id}`);
            } else {
                const response = await createJob(data);
                navigate(`/jobs/${response.data.id}`);
            }
        } catch (err) {
            setError(err.errors || err.message || 'Failed to save job');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="space-y-4 text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
                    <p className="text-slate-500 font-black text-xs uppercase tracking-widest">Preparing editor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-32">
            {/* Header */}
            <section className="pt-20 pb-12 bg-slate-50 border-b border-slate-100">
                <div className="max-w-4xl mx-auto px-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-xs uppercase tracking-widest transition-colors group mb-8"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> 
                        Cancel & return
                    </button>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                            <Plus className="w-3 h-3" />
                            <span>Creation Studio</span>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 leading-tight">
                            {isEditMode ? 'Refine your' : 'Define your'} <span className="text-blue-600">Opportunity.</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-lg max-w-xl">
                            {isEditMode ? 'Update your job details to ensure you attract the most relevant candidates.' : 'Craft a compelling job posting to find the perfect addition to your professional team.'}
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-6 mt-16">
                {error && (
                    <div className="mb-10 p-6 bg-red-50 border border-red-100 rounded-3xl flex items-start gap-4">
                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600 flex-shrink-0">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-red-600 font-black text-lg mb-1">Configuration Error</p>
                            <p className="text-red-500 font-medium">{error}</p>
                            {error.includes('create a company first') && (
                                <button 
                                    onClick={() => navigate('/recruiter/create-company')}
                                    className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all"
                                >
                                    Register Company Now
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Section 1: Basic Info */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                                <FileText className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">Core Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="col-span-full group">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Job Title</label>
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none"
                                    placeholder="e.g. Senior Frontend Engineer"
                                />
                            </div>

                            <div className="col-span-full group">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Representing Company</label>
                                <div className="relative">
                                    <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    <select
                                        required
                                        name="companyId"
                                        value={formData.companyId}
                                        onChange={handleChange}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none appearance-none"
                                    >
                                        <option value="" disabled>Select a registered company</option>
                                        {companies.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Work Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    <input
                                        required
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none"
                                        placeholder="e.g. Remote, Bangalore"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Employment Type</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    <select
                                        name="employmentType"
                                        value={formData.employmentType}
                                        onChange={handleChange}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none appearance-none"
                                    >
                                        <option value="FULL_TIME">Full Time</option>
                                        <option value="PART_TIME">Part Time</option>
                                        <option value="CONTRACT">Contract</option>
                                        <option value="INTERNSHIP">Internship</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Compensation & Logistics */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                                <Target className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">Requirements & Perks</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="group">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Experience Level</label>
                                <div className="relative">
                                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    <select
                                        name="experienceLevel"
                                        value={formData.experienceLevel}
                                        onChange={handleChange}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none appearance-none"
                                    >
                                        <option value="FRESHER">Fresher</option>
                                        <option value="JUNIOR">Junior (1-3 yrs)</option>
                                        <option value="MID">Mid Level (3-5 yrs)</option>
                                        <option value="SENIOR">Senior (5+ yrs)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Application Deadline</label>
                                <div className="relative">
                                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    <input
                                        required
                                        type="date"
                                        name="applicationDeadline"
                                        value={formData.applicationDeadline}
                                        onChange={handleChange}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Min Salary (Annual)</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    <input
                                        required
                                        type="number"
                                        name="salaryMin"
                                        value={formData.salaryMin}
                                        onChange={handleChange}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none"
                                        placeholder="e.g. 800000"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Max Salary (Annual)</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    <input
                                        required
                                        type="number"
                                        name="salaryMax"
                                        value={formData.salaryMax}
                                        onChange={handleChange}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none"
                                        placeholder="e.g. 1500000"
                                    />
                                </div>
                            </div>

                            <div className="col-span-full group">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Skills & Keywords (Comma separated)</label>
                                <div className="relative">
                                    <Sparkles className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    <input
                                        type="text"
                                        name="skillsRequired"
                                        value={formData.skillsRequired}
                                        onChange={handleChange}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none"
                                        placeholder="React, Node.js, AWS, System Design..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Description */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-100">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">The Pitch</h2>
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Job Description & Responsibilities</label>
                            <textarea
                                required
                                minLength={50}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="10"
                                className="w-full px-6 py-6 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-3xl font-bold text-slate-900 transition-all outline-none resize-none leading-relaxed"
                                placeholder="Describe the role, impact, and who you're looking for..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="pt-10 flex flex-col md:flex-row gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 px-8 py-5 border-2 border-slate-100 text-slate-400 font-black rounded-2xl hover:bg-slate-50 transition-all"
                        >
                            Discard Draft
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-[2] bg-blue-600 text-white px-10 py-5 rounded-2xl font-black shadow-2xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center gap-3"
                        >
                            {submitting ? (
                                <Loader2 className="animate-spin h-6 w-6" />
                            ) : (
                                isEditMode ? <Save className="w-6 h-6" /> : <Plus className="w-6 h-6" />
                            )}
                            {submitting ? 'Processing...' : (isEditMode ? 'Update Posting' : 'Publish Opportunity')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateJob;
