import { useState } from 'react';
import { User, Mail, Lock, UserPlus, Loader2, CheckCircle2, Briefcase, Building2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/auth.service';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'JOB_SEEKER'
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const validate = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";

        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (validate()) {
            setLoading(true);
            try {
                const response = await register(formData);
                if (response.success) {
                    // Auto-login after registration for seamless flow
                    const loginRes = await import('../services/auth.service').then(m => m.login(formData.email, formData.password));
                    if (loginRes.success) {
                        const user = loginRes.data?.user;
                        if (user?.role === 'RECRUITER') {
                            navigate('/recruiter/onboarding');
                        } else {
                            navigate('/dashboard');
                        }
                    } else {
                        navigate('/login');
                    }
                }
            } catch (err) {
                const errorMsg = err.response?.data?.errors ||
                    err.response?.data?.message ||
                    err.message ||
                    'Registration failed';
                setApiError(errorMsg);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side: Visual Content */}
            <div className="hidden lg:flex flex-1 bg-slate-900 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -ml-64 -mt-64"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -mr-64 -mb-64"></div>

                <div className="max-w-md space-y-12 relative z-10">
                    <div className="space-y-6">
                        <h3 className="text-5xl font-black text-white leading-tight">
                            Start your <span className="text-blue-500">professional</span> journey today.
                        </h3>
                        <p className="text-slate-400 font-medium text-lg leading-relaxed">
                            Join over 1.2 million professionals and 23,000 verified companies on the world's most modern hiring platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                            <Briefcase className="text-blue-500 w-8 h-8 mb-4" />
                            <p className="text-white font-black text-lg">For Seekers</p>
                            <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">Land your dream job</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                            <Building2 className="text-emerald-500 w-8 h-8 mb-4" />
                            <p className="text-white font-black text-lg">For Recruiters</p>
                            <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">Hire top 1% talent</p>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        {[
                            'Free forever for individual job seekers',
                            'No hidden fees or commission on hiring',
                            'Privacy-first professional networking'
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-white font-bold text-sm">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-24">
                <div className="mx-auto w-full max-w-sm">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start mb-10">
                            <div className="h-20 w-72 overflow-hidden flex items-center justify-center lg:justify-start relative">
                                <img src="/logo.png?v=2" alt="HireHub Logo" className="h-64 w-auto max-w-none object-contain scale-[1.25] ml-4" />
                            </div>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 mb-2">Create Account.</h2>
                        <p className="text-slate-500 font-medium">Join our global community of professionals.</p>
                    </div>

                    {apiError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col gap-1 animate-in fade-in slide-in-from-top-1">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <p className="text-sm text-red-600 font-bold">{apiError}</p>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold ml-4 uppercase">Please check your details and try again</p>
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'JOB_SEEKER' })}
                                    className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${formData.role === 'JOB_SEEKER' ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 border-transparent text-slate-400'}`}
                                >
                                    Job Seeker
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'RECRUITER' })}
                                    className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${formData.role === 'RECRUITER' ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-100' : 'bg-slate-50 border-transparent text-slate-400'}`}
                                >
                                    Recruiter
                                </button>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                                        <User className="h-5 w-5 text-slate-300" />
                                    </div>
                                    <input
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl font-bold text-slate-900 transition-all outline-none ${errors.name ? 'border-red-100 focus:border-red-500' : 'border-transparent focus:border-blue-600 focus:bg-white focus:shadow-xl focus:shadow-blue-50'}`}
                                        placeholder="John Doe"
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-xs font-bold mt-2 ml-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                                        <Mail className="h-5 w-5 text-slate-300" />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl font-bold text-slate-900 transition-all outline-none ${errors.email ? 'border-red-100 focus:border-red-500' : 'border-transparent focus:border-blue-600 focus:bg-white focus:shadow-xl focus:shadow-blue-50'}`}
                                        placeholder="john@example.com"
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs font-bold mt-2 ml-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                                        <Lock className="h-5 w-5 text-slate-300" />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl font-bold text-slate-900 transition-all outline-none ${errors.password ? 'border-red-100 focus:border-red-500' : 'border-transparent focus:border-blue-600 focus:bg-white focus:shadow-xl focus:shadow-blue-50'}`}
                                        placeholder="Min 6 characters"
                                    />
                                </div>
                                {errors.password && <p className="text-red-500 text-xs font-bold mt-2 ml-1">{errors.password}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-100 hover:bg-black hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            ) : null}
                            {loading ? 'Creating Account...' : 'Join HireHub Community'}
                        </button>

                        <div className="text-center pt-2">
                            <p className="text-sm font-bold text-slate-500">
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-600 hover:text-blue-700 transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
