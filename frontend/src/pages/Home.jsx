import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Plus, TrendingUp, Users, ChevronRight, Loader2, Inbox, ListTodo } from 'lucide-react';
import { getJobs } from '../services/job.service';
import { getMyApplications } from '../services/application.service';
import { getCurrentUser } from '../services/auth.service';

const Home = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('BROWSE'); // BROWSE or APPLIED for job seekers
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

    const fetchAppliedJobs = async () => {
        try {
            const response = await getMyApplications();
            setAppliedJobs(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchJobs();
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [filters]);

    useEffect(() => {
        if (user?.role === 'JOB_SEEKER') {
            fetchAppliedJobs();
        } else if (user?.role === 'RECRUITER' && !filters.postedBy) {
            // For recruiters, filter jobs to show only their postings (only set once)
            setFilters(prev => ({ ...prev, postedBy: user.id }));
        }
    }, [user?.id, user?.role]);

    const stats = [
        { number: '84K+', label: 'Active job listings' },
        { number: '23K+', label: 'Verified companies' },
        { number: '1.2M', label: 'Successful hires' },
        { number: '96%', label: 'Satisfaction rate' }
    ];

    const categories = [
        { icon: '💻', name: 'Technology', count: '18,432 open roles' },
        { icon: '✏️', name: 'Design & Creative', count: '7,210 open roles' },
        { icon: '📊', name: 'Finance', count: '9,840 open roles' },
        { icon: '👨‍⚕️', name: 'Healthcare', count: '11,300 open roles' },
        { icon: '📣', name: 'Marketing', count: '5,670 open roles' },
        { icon: '⚙️', name: 'Engineering', count: '14,920 open roles' },
        { icon: '🏫', name: 'Education', count: '4,100 open roles' },
        { icon: '📋', name: 'Legal & Compliance', count: '3,580 open roles' }
    ];

    const testimonials = [
        {
            stars: 5,
            text: '"Found my dream role as a UX lead in under two weeks. The job matching is impressively accurate — it actually read my profile."',
            name: 'Priya Rao',
            role: 'UX Lead · Dropbox',
            avatar: 'PR',
            bgColor: 'bg-indigo-600'
        },
        {
            stars: 5,
            text: '"As a recruiter, HireHub cuts my sourcing time in half. The quality of applicants is genuinely much higher than any platform I\'ve used before."',
            name: 'Marcus Kim',
            role: 'Talent Lead · Stripe',
            avatar: 'MK',
            bgColor: 'bg-blue-400',
            featured: true
        },
        {
            stars: 5,
            text: '"We posted our first listing and had 40+ qualified applicants in 3 days. The platform is clean, fast, and the team is super responsive."',
            name: 'Sara Chen',
            role: 'CEO · BuildFast',
            avatar: 'SC',
            bgColor: 'bg-green-600'
        }
    ];

    const heroJobs = jobs.slice(0, 3).map((job, index) => ({
        id: job.id,
        company: job.company?.name || 'Company',
        logo: (job.company?.name || 'C').charAt(0).toUpperCase(),
        bgColor: ['bg-blue-600', 'bg-teal-600', 'bg-purple-700'][index],
        title: job.title,
        location: job.location,
        tags: job.skillsRequired && job.skillsRequired.trim() ? job.skillsRequired.split(',').slice(0, 3).map(s => s.trim()) : [],
        salary: job.salary ? `₹${job.salary.min}–${job.salary.max}` : 'Competitive',
        featured: index === 0
    }));

    // RECRUITER DASHBOARD
    if (user?.role === 'RECRUITER') {
        return (
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">🏢 Recruiter Dashboard</h1>
                        <p className="text-gray-500 mt-1">Manage your postings, track applications, and find the best talent.</p>
                    </div>
                    <Link to="/recruiter/create-job" className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-shadow shadow-lg shadow-blue-100">
                        <Plus className="h-5 w-5 mr-2" /> Post New Job
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-6 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Active Jobs</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{jobs.filter(j => j.status === 'OPEN').length}</p>
                            </div>
                            <Briefcase className="h-12 w-12 text-blue-600 opacity-20" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-6 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Views</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">2,340</p>
                            </div>
                            <TrendingUp className="h-12 w-12 text-green-600 opacity-20" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-6 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Applications</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">156</p>
                            </div>
                            <Users className="h-12 w-12 text-purple-600 opacity-20" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Your Job Postings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.length > 0 ? jobs.map((job) => (
                            <div key={job.id} className="border border-gray-200 p-6 rounded-xl hover:shadow-md transition-all cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex-1">{job.title}</h3>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold ml-2">Active</span>
                                </div>
                                <p className="text-blue-600 font-medium text-sm mb-3">{job.company?.name || 'Confidential'}</p>
                                <div className="space-y-2 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> {job.location}</div>
                                    <div className="flex items-center"><Briefcase className="h-4 w-4 mr-2" /> {job.employmentType?.replace('_', ' ')}</div>
                                </div>
                                <button onClick={() => navigate(`/recruiter/applications/${job.id}`)} className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all">View Applications</button>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                <p className="text-lg font-medium mb-2">No jobs posted yet</p>
                                <p className="text-sm">Start by posting your first job to attract talent!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // JOB SEEKER - COMPLETE LANDING PAGE STYLE
    return (
        <div className="w-full bg-white -mx-4 -my-8">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-12 px-6">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 -z-10"></div>

                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-6">
                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                            Welcome back! 👋
                        </div>

                        <h1 className="text-5xl font-bold leading-tight mb-4 text-gray-900">
                            Find the job you<br />were <em className="italic text-blue-600">meant</em> to do.
                        </h1>

                        <p className="text-lg text-gray-600 leading-relaxed mb-6 max-w-md">
                            Continue your journey with HireHub. Explore thousands of opportunities from exceptional companies.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 mb-8">
                            <button onClick={() => navigate('/applications')} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition flex items-center justify-center gap-2">
                                My Applications →
                            </button>
                            <button onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})} className="px-6 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-full hover:border-blue-600 hover:text-blue-600 transition flex items-center justify-center gap-2">
                                Explore Jobs
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                                <div className="w-9 h-9 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white">PK</div>
                                <div className="w-9 h-9 bg-cyan-600 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white">MR</div>
                                <div className="w-9 h-9 bg-green-600 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white">SL</div>
                                <div className="w-9 h-9 bg-amber-600 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white">AT</div>
                            </div>
                            <p className="text-sm text-gray-600"><strong className="text-gray-900">40,000+</strong> people hired this month</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {heroJobs.length > 0 ? heroJobs.map((job, i) => (
                            <div key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} className={`p-5 rounded-2xl border-2 transition hover:shadow-lg cursor-pointer ${job.featured ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-blue-25' : 'border-gray-200 bg-white hover:border-blue-300'}`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex gap-3">
                                        <div className={`w-12 h-12 ${job.bgColor} rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0`}>
                                            {job.logo}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{job.title}</div>
                                            <div className="text-sm text-gray-500">{job.company} · {job.location}</div>
                                        </div>
                                    </div>
                                    {job.featured && <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Featured</span>}
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {job.tags.map((tag, j) => (
                                        <span key={j} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                    <div className="font-bold text-gray-900">{job.salary} <span className="text-xs text-gray-500 font-normal">/ yr</span></div>
                                    <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 transition font-semibold">
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-sm">Loading recent jobs...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Stats Band */}
            <div className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4 py-8 px-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center border-r border-gray-700 last:border-r-0">
                            <div className="text-4xl font-bold font-serif mb-2">{stat.number}</div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs for Job Seeker */}
            {user?.role === 'JOB_SEEKER' && (
                <div className="bg-white border-b border-gray-200 px-6">
                    <div className="max-w-7xl mx-auto flex gap-8">
                        <button
                            onClick={() => setActiveTab('BROWSE')}
                            className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
                                activeTab === 'BROWSE'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <Search className="h-5 w-5" />
                                Browse All Jobs
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('APPLIED')}
                            className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
                                activeTab === 'APPLIED'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <ListTodo className="h-5 w-5" />
                                Applied Jobs ({appliedJobs.length})
                            </div>
                        </button>
                        <button
                            onClick={() => navigate('/inbox')}
                            className="py-4 px-2 font-semibold text-gray-600 hover:text-blue-600 transition-colors ml-auto flex items-center gap-2"
                        >
                            <Inbox className="h-5 w-5" />
                            Inbox
                        </button>
                    </div>
                </div>
            )}

            {/* Search Section */}
            {activeTab === 'BROWSE' && (
            <section className="bg-gray-50 border-b border-gray-200 py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Quick Search</p>
                        <h2 className="text-3xl font-bold text-gray-900 mt-1">Find your next opportunity</h2>
                    </div>

                    <div className="bg-white border border-gray-300 rounded-2xl p-2 flex items-center gap-2 mb-4">
                        <Search className="w-5 h-5 text-gray-400 ml-3 flex-shrink-0" />
                        <input 
                            type="text" 
                            placeholder="Job title, skill, or keyword..." 
                            className="flex-1 border-none outline-none bg-transparent text-gray-900" 
                            value={filters.search}
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                        />
                        <div className="w-px h-7 bg-gray-200"></div>
                        <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <input 
                            type="text" 
                            placeholder="City or Remote" 
                            className="w-40 border-none outline-none bg-transparent text-gray-900" 
                            value={filters.location}
                            onChange={(e) => setFilters({...filters, location: e.target.value})}
                        />
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition flex-shrink-0">
                            Search
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                        {['All Types', 'Remote', 'Full-time', 'Part-time', 'Freelance'].map((type, i) => (
                            <button key={i} className={`px-4 py-2 rounded-full text-sm font-medium transition ${i === 0 ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-600 hover:border-blue-600'}`}>
                                {type}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm text-gray-600 font-medium">Popular:</p>
                        {['UI/UX Designer', 'Software Engineer', 'Product Manager', 'Data Analyst'].map((tag, i) => (
                            <button key={i} className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full hover:bg-blue-200 transition font-semibold">
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </section>
            )}

            {/* Applied Jobs Section */}
            {user?.role === 'JOB_SEEKER' && activeTab === 'APPLIED' && (
            <section className="bg-gray-50 py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-10">
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Your Progress</p>
                        <h2 className="text-3xl font-bold text-gray-900 mt-1">Track your applications</h2>
                    </div>

                    {appliedJobs.length === 0 ? (
                        <div className="bg-white p-16 rounded-2xl border border-dashed border-gray-300 text-center">
                            <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
                                <ListTodo className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">No applications yet</h3>
                            <p className="text-gray-500 mt-2 mb-6">Start applying to jobs to track your progress here</p>
                            <button onClick={() => setActiveTab('BROWSE')} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold">
                                Browse Jobs
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {appliedJobs.map((app) => (
                                <div key={app.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-gray-900">{app.job?.title}</h3>
                                                <span className={`text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 border ${
                                                    app.status === 'HIRED' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    app.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                                                    app.status === 'INTERVIEW' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                    app.status === 'SHORTLISTED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                }`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                            <p className="text-blue-600 font-semibold text-lg mb-3">{app.job?.company?.name}</p>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                <div className="flex items-center"><MapPin className="h-4 w-4 mr-1.5" /> {app.job?.location}</div>
                                                <div className="flex items-center"><Briefcase className="h-4 w-4 mr-1.5" /> {app.job?.employmentType?.replace('_', ' ')}</div>
                                            </div>
                                        </div>
                                        <Link 
                                            to={`/jobs/${app.job?.id}`}
                                            className="flex items-center justify-center text-blue-600 font-bold px-6 py-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all whitespace-nowrap"
                                        >
                                            View Details <ChevronRight className="h-5 w-5 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            )}

            {/* Categories */}
            {activeTab === 'BROWSE' && (
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Categories</p>
                            <h2 className="text-3xl font-bold text-gray-900 mt-1">Explore by industry</h2>
                        </div>
                        <a href="#" className="text-blue-600 font-semibold text-sm hover:text-blue-700">Browse all →</a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {categories.map((cat, i) => (
                            <div key={i} onClick={() => setFilters({...filters, search: cat.name})} className="p-6 border border-gray-200 rounded-2xl hover:bg-blue-600 hover:border-blue-600 hover:text-white transition cursor-pointer">
                                <div className="text-2xl mb-3">{cat.icon}</div>
                                <div className="font-bold text-gray-900 hover:text-white transition">{cat.name}</div>
                                <div className="text-sm text-gray-600 hover:text-blue-100 transition">{cat.count}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            )}

            {/* Featured Jobs */}
            {activeTab === 'BROWSE' || user?.role !== 'JOB_SEEKER' ? (
            <section className="bg-gray-50 py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Featured</p>
                            <h2 className="text-3xl font-bold text-gray-900 mt-1">Jobs for you</h2>
                        </div>
                        <a href="#" className="text-blue-600 font-semibold text-sm hover:text-blue-700 flex items-center gap-1">See all jobs <ChevronRight className="w-4 h-4" /></a>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {jobs.slice(0, 3).map((job) => (
                                <div key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-xl transition cursor-pointer">
                                    <h3 className="font-bold text-lg mb-1 text-gray-900">{job.title}</h3>
                                    <p className="text-sm text-blue-600 mb-4">{job.company?.name || 'Company'}</p>
                                    <p className="text-xs text-gray-600 mb-4">{job.location}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {['Remote', 'Full-time', 'Competitive'].map((tag, i) => (
                                            <span key={i} className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                        <span className="font-bold text-gray-900">{job.salary?.min}K - {job.salary?.max}K</span>
                                        <button className="text-xs px-4 py-1.5 rounded-full font-bold bg-blue-600 text-white hover:bg-blue-700 transition">
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            ) : null}

            {/* Testimonials */}
            {activeTab === 'BROWSE' || user?.role !== 'JOB_SEEKER' ? (
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Reviews</p>
                            <h2 className="text-3xl font-bold text-gray-900 mt-1">People love HireHub</h2>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testi, i) => (
                            <div key={i} className={`p-6 rounded-2xl ${testi.featured ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'}`}>
                                <div className="mb-4 text-yellow-400">
                                    {'★'.repeat(testi.stars)}
                                </div>
                                <p className={`text-sm leading-relaxed mb-4 ${testi.featured ? 'text-blue-50' : 'text-gray-600'}`}>
                                    {testi.text}
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 ${testi.bgColor} rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                                        {testi.avatar}
                                    </div>
                                    <div>
                                        <div className={`font-semibold text-sm ${testi.featured ? 'text-white' : 'text-gray-900'}`}>{testi.name}</div>
                                        <div className={`text-xs ${testi.featured ? 'text-blue-200' : 'text-gray-600'}`}>{testi.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            ) : null}

            {/* CTA */}
            <section className="mx-6 mb-12 bg-blue-600 rounded-3xl p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500 rounded-full opacity-10 -z-10"></div>
                <div className="max-w-2xl relative z-10">
                    <h2 className="text-4xl font-bold text-white leading-tight mb-3">Ready to apply?</h2>
                    <p className="text-blue-100 mb-8">Start your journey to your dream job today. Join thousands of professionals who found their perfect role through HireHub.</p>
                    <div className="flex gap-3">
                        <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="px-6 py-3 bg-white text-blue-600 font-bold rounded-full hover:bg-gray-100 transition">
                            Explore Jobs
                        </button>
                        <button onClick={() => navigate('/inbox')} className="px-6 py-3 bg-transparent text-white border-2 border-blue-300 font-bold rounded-full hover:bg-blue-500 transition">
                            Inbox
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
