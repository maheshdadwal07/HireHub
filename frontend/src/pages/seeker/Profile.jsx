import { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Camera, FileText, Upload, Plus, X, Check, Edit2, Download } from 'lucide-react';
import { getProfile, updateProfile } from '../../services/user.service';
import { getCurrentUser } from '../../services/auth.service';

const Profile = () => {
    const BACKEND_URL = import.meta.env.VITE_API_URL || "http://44.213.126.195/api";
    const authUser = getCurrentUser();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editStates, setEditStates] = useState({
        header: false,
        contact: false,
        bio: false,
        socials: false,
        expertise: false,
        experience: false,
        education: false,
        resume: false
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const toggleEdit = (section) => {
        setEditStates(prev => ({ ...prev, [section]: !prev[section] }));
        setError(null);
        setSuccess(null);
    };

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        bio: '',
        skills: [],
        socialLinks: [],
        education: [],
        experience: []
    });
    const [newSkill, setNewSkill] = useState('');
    const [newSocial, setNewSocial] = useState({ platform: '', url: '' });
    const [newEducation, setNewEducation] = useState({
        school: '',
        degree: '',
        fieldOfStudy: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        description: ''
    });
    const [newExperience, setNewExperience] = useState({
        company: '',
        role: '',
        employmentType: '',
        location: '',
        locationType: '',
        currentlyWorking: true,
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        description: ''
    });






    const [selectedResume, setSelectedResume] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [selectedCover, setSelectedCover] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    const fileInputRef = useRef(null);
    const photoInputRef = useRef(null);
    const coverInputRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await getProfile();
            if (response.success) {
                setUser(response.data);
                setFormData({
                    name: response.data.name || '',
                    phone: response.data.phone || '',
                    bio: response.data.bio || '',
                    skills: response.data.skills || [],
                    socialLinks: Array.isArray(response.data.socialLinks) ? response.data.socialLinks : [],
                    education: response.data.education || [],
                    experience: response.data.experience || []
                });
                if (response.data.profilePhotoUrl) {
                    setPhotoPreview(`${BACKEND_URL}${response.data.profilePhotoUrl}`);
                }
                if (response.data.coverPhotoUrl) {
                    setCoverPreview(`${BACKEND_URL}${response.data.coverPhotoUrl}`);
                }
            }
        } catch (err) {
            setError('Failed to load profile');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSocial = () => {
        if (newSocial.platform && newSocial.url) {
            setFormData(prev => ({
                ...prev,
                socialLinks: [...prev.socialLinks, newSocial]
            }));
            setNewSocial({ platform: '', url: '' });
        }
    };

    const handleRemoveSocial = (index) => {
        setFormData(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.filter((_, i) => i !== index)
        }));
    };

    const handleAddEducation = () => {
        if (newEducation.school && newEducation.degree) {
            const year = `${newEducation.startMonth} ${newEducation.startYear} - ${newEducation.endMonth} ${newEducation.endYear}`;
            const eduToAdd = {
                ...newEducation,
                year // Keep year for display logic
            };
            setFormData(prev => ({
                ...prev,
                education: [...prev.education, eduToAdd]
            }));
            setNewEducation({
                school: '',
                degree: '',
                fieldOfStudy: '',
                startMonth: '',
                startYear: '',
                endMonth: '',
                endYear: '',
                description: ''
            });
        }
    };


    const handleRemoveEducation = (index) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    const handleAddExperience = () => {
        if (newExperience.company && newExperience.role) {
            // Construct a display duration string
            const duration = `${newExperience.startMonth} ${newExperience.startYear} - ${newExperience.currentlyWorking ? 'Present' : `${newExperience.endMonth} ${newExperience.endYear}`}`;

            const expToAdd = {
                ...newExperience,
                duration // Keep duration for existing display logic
            };

            setFormData(prev => ({
                ...prev,
                experience: [...prev.experience, expToAdd]
            }));
            setNewExperience({
                company: '',
                role: '',
                employmentType: '',
                location: '',
                locationType: '',
                currentlyWorking: true,
                startMonth: '',
                startYear: '',
                endMonth: '',
                endYear: '',
                description: ''
            });
        }
    };

    const handleRemoveExperience = (index) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skillToRemove)
        }));
    };

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setError('Resume file is too large. Maximum limit is 5MB.');
                return;
            }
            setSelectedResume(file);
            setError(null);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setError('Profile photo is too large. Maximum limit is 5MB.');
                return;
            }
            setSelectedPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
            setError(null);
        }
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setError('Cover image is too large. Maximum limit is 5MB.');
                return;
            }
            setSelectedCover(file);
            setCoverPreview(URL.createObjectURL(file));
            setError(null);
        }
    };

    const handleSubmit = async (section) => {
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('phone', formData.phone);
            submitData.append('bio', formData.bio);
            submitData.append('skills', JSON.stringify(formData.skills));
            submitData.append('socialLinks', JSON.stringify(formData.socialLinks));
            submitData.append('education', JSON.stringify(formData.education));
            submitData.append('experience', JSON.stringify(formData.experience));

            if (selectedResume) {
                submitData.append('resume', selectedResume);
            }
            if (selectedPhoto) {
                submitData.append('profilePhoto', selectedPhoto);
            }
            if (selectedCover) {
                submitData.append('coverPhoto', selectedCover);
            }

            const response = await updateProfile(submitData);
            if (response.success) {
                setSuccess(`${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully!`);
                setUser(response.data);
                toggleEdit(section);
                // Update local storage if name changed
                const currentUser = JSON.parse(localStorage.getItem('user'));
                localStorage.setItem('user', JSON.stringify({ ...currentUser, name: response.data.name }));

                // Clear file selections
                setSelectedResume(null);
                setSelectedPhoto(null);
                setSelectedCover(null);

                // Trigger an event to update Navbar
                window.dispatchEvent(new CustomEvent('user-updated'));
            }
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="relative w-20 h-20">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Header / Cover Section */}
            <div className="group mb-12">
                {/* Cover Image */}
                <div className="h-64 w-full bg-slate-100 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    {coverPreview ? (
                        <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <FileText className="w-20 h-20 text-white/5 relative z-10" />
                        </div>
                    )}

                    {editStates.header && (
                        <button
                            onClick={() => coverInputRef.current?.click()}
                            className="absolute top-6 right-6 flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold border border-white/30 hover:bg-white/30 transition-all shadow-xl z-20"
                        >
                            <Camera className="w-4 h-4" /> Change Cover
                        </button>
                    )}
                    <input
                        type="file"
                        ref={coverInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleCoverChange}
                    />
                </div>

                {/* Profile Photo & Name Section */}
                <div className="px-12 flex flex-col sm:flex-row items-start sm:items-end gap-8 -mt-20 relative z-10">
                    <div className="relative">
                        <div className="w-40 h-40 rounded-[2rem] bg-white p-2 shadow-2xl ring-4 ring-white">
                            <div className="w-full h-full rounded-[1.5rem] bg-gray-50 overflow-hidden flex items-center justify-center border border-gray-100">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-20 h-20 text-gray-300" />
                                )}
                            </div>
                        </div>
                        {editStates.header && (
                            <button
                                onClick={() => photoInputRef.current?.click()}
                                className="absolute bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-xl hover:bg-blue-700 transition-all border-4 border-white"
                            >
                                <Camera className="w-5 h-5" />
                            </button>
                        )}
                        <input
                            type="file"
                            ref={photoInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handlePhotoChange}
                        />
                    </div>

                    <div className="flex-1 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                {editStates.header ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="text-4xl font-black text-gray-900 border-none bg-blue-50/50 rounded-xl px-4 py-1 focus:ring-2 focus:ring-blue-500 w-full"
                                    />
                                ) : (
                                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                                        {user?.name}
                                    </h1>
                                )}
                                {!editStates.header && <Check className="w-6 h-6 text-blue-600 bg-blue-100 p-1 rounded-full shadow-sm" />}
                            </div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
                                <p className="text-blue-600 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                                    <Briefcase className="w-3.5 h-3.5" /> {user?.role?.toLowerCase().replace('_', ' ')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {editStates.header ? (
                                <>
                                    <button onClick={() => toggleEdit('header')} className="px-4 py-2 font-black text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
                                    <button onClick={() => handleSubmit('header')} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">Save Changes</button>
                                </>
                            ) : (
                                <button
                                    onClick={() => toggleEdit('header')}
                                    className="group flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-2xl shadow-xl hover:shadow-2xl transition-all border border-gray-100 font-bold"
                                >
                                    <Edit2 className="w-4 h-4 text-blue-600 group-hover:rotate-12 transition-transform" />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-5 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-2xl flex items-center gap-3 shadow-sm">
                    <div className="bg-red-100 p-2 rounded-lg"><X className="w-5 h-5" /></div>
                    <span className="font-semibold">{error}</span>
                </div>
            )}

            {success && (
                <div className="mb-8 p-5 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-2xl flex items-center gap-3 shadow-sm">
                    <div className="bg-green-100 p-2 rounded-lg"><Check className="w-5 h-5" /></div>
                    <span className="font-semibold">{success}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Info & Socials */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Contact Info */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-50">
                        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center justify-between">
                            Contact Info
                            <div className="w-10 h-1 bg-blue-600 rounded-full"></div>
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Email</p>
                                    <p className="text-gray-900 font-bold break-all">{user?.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Phone</p>
                                        {!editStates.contact ? (
                                            <button onClick={() => toggleEdit('contact')} className="p-1.5 hover:bg-indigo-50 rounded-lg transition-colors group">
                                                <Phone className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600" />
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => toggleEdit('contact')} className="text-[9px] font-black text-gray-400 hover:text-gray-600">Cancel</button>
                                                <button onClick={() => handleSubmit('contact')} className="text-[9px] font-black text-indigo-600 hover:text-indigo-800">Update</button>
                                            </div>
                                        )}
                                    </div>
                                    {editStates.contact ? (
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+1 234..."
                                            className="w-full border-none bg-gray-50 rounded-xl px-3 py-1 text-sm font-bold focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-bold">{user?.phone || 'Add phone'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-50">
                        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center justify-between">
                            Social Profiles
                            {!editStates.socials ? (
                                <button onClick={() => toggleEdit('socials')} className="p-2 hover:bg-blue-50 rounded-lg transition-all group">
                                    <Plus className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
                                </button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button onClick={() => toggleEdit('socials')} className="text-xs font-black text-gray-400">Done</button>
                                    <button onClick={() => handleSubmit('socials')} className="text-xs font-black text-blue-600">Save</button>
                                </div>
                            )}
                        </h2>

                        {editStates.socials && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                                <input
                                    placeholder="Platform (e.g. GitHub)"
                                    value={newSocial.platform}
                                    onChange={e => setNewSocial({ ...newSocial, platform: e.target.value })}
                                    className="w-full bg-white border-none rounded-xl px-3 py-2 text-xs font-bold"
                                />
                                <input
                                    placeholder="URL (https://...)"
                                    value={newSocial.url}
                                    onChange={e => setNewSocial({ ...newSocial, url: e.target.value })}
                                    className="w-full bg-white border-none rounded-xl px-3 py-2 text-xs font-bold"
                                />
                                <button
                                    onClick={handleAddSocial}
                                    className="w-full bg-blue-600 text-white py-2 rounded-xl text-xs font-black"
                                >
                                    Add Link
                                </button>
                            </div>
                        )}

                        <div className="space-y-4">
                            {(Array.isArray(editStates.socials ? formData.socialLinks : user?.socialLinks) ? (editStates.socials ? formData.socialLinks : user?.socialLinks) : []).map((social, i) => (
                                <div key={i} className="flex items-center gap-4 group/social">
                                    <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl group-hover/social:bg-blue-600 group-hover/social:text-white transition-all">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] text-gray-400 font-black uppercase mb-1">{social.platform}</p>
                                            {editStates.socials && <X className="w-3.5 h-3.5 text-red-400 cursor-pointer" onClick={() => handleRemoveSocial(i)} />}
                                        </div>
                                        <a href={social.url} target="_blank" rel="noreferrer" className="text-blue-600 font-bold text-sm hover:underline truncate block">
                                            {social.url.replace('https://', '')}
                                        </a>
                                    </div>
                                </div>
                            ))}
                            {(!editStates.socials && (!user?.socialLinks || user.socialLinks.length === 0)) && (
                                <p className="text-gray-300 text-xs font-bold italic text-center py-2">No profiles linked</p>
                            )}
                        </div>
                    </div>

                    {/* Expertise */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-50">
                        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center justify-between">
                            Expertise
                            {!editStates.expertise ? (
                                <button onClick={() => toggleEdit('expertise')} className="p-2 hover:bg-emerald-50 rounded-lg transition-all group">
                                    <Plus className="w-5 h-5 text-gray-300 group-hover:text-emerald-600 transition-colors" />
                                </button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button onClick={() => toggleEdit('expertise')} className="text-xs font-black text-gray-400">Cancel</button>
                                    <button onClick={() => handleSubmit('expertise')} className="text-xs font-black text-emerald-600">Save</button>
                                </div>
                            )}
                        </h2>
                        {editStates.expertise && (
                            <form onSubmit={handleAddSkill} className="mb-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        placeholder="Add skill..."
                                        className="w-full border-none bg-gray-50 rounded-xl pl-4 pr-10 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button type="submit" className="absolute right-2 top-2 p-1 bg-blue-600 text-white rounded-lg">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {(Array.isArray(editStates.expertise ? formData.skills : user?.skills) ? (editStates.expertise ? formData.skills : user?.skills) : []).map((skill, i) => (
                                <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-xl text-xs font-black border border-slate-100 flex items-center gap-2">
                                    {skill}
                                    {editStates.expertise && <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" onClick={() => handleRemoveSkill(skill)} />}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Experience, Education, Bio */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Bio */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-50">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black text-gray-900">About Me</h2>
                            {!editStates.bio ? (
                                <button onClick={() => toggleEdit('bio')} className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors group">
                                    <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-black uppercase tracking-tighter">Edit Bio</span>
                                </button>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <button onClick={() => toggleEdit('bio')} className="text-sm font-black text-gray-400">Cancel</button>
                                    <button onClick={() => handleSubmit('bio')} className="text-sm font-black text-blue-600">Save Bio</button>
                                </div>
                            )}
                        </div>
                        {editStates.bio ? (
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full border-none bg-gray-50 rounded-[1.5rem] p-6 text-gray-900 focus:ring-2 focus:ring-blue-500 resize-none font-medium"
                            />
                        ) : (
                            <p className="text-gray-600 leading-relaxed font-medium">{user?.bio || 'No bio yet.'}</p>
                        )}
                    </div>

                    {/* Experience */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-50">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                Professional Experience
                                <Briefcase className="w-6 h-6 text-blue-600" />
                            </h2>
                            {!editStates.experience ? (
                                <button onClick={() => toggleEdit('experience')} className="p-2 hover:bg-blue-50 rounded-lg transition-all group">
                                    <Plus className="w-6 h-6 text-gray-300 group-hover:text-blue-600" />
                                </button>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <button onClick={() => toggleEdit('experience')} className="text-sm font-black text-gray-400">Cancel</button>
                                    <button onClick={() => handleSubmit('experience')} className="text-sm font-black text-blue-600">Save List</button>
                                </div>
                            )}
                        </div>

                        {editStates.experience && (
                            <div className="bg-blue-50/50 p-8 rounded-3xl mb-8 space-y-6 border border-blue-100">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Title *</label>
                                        <input
                                            placeholder="Ex: Retail Sales Manager"
                                            value={newExperience.role}
                                            onChange={e => setNewExperience({ ...newExperience, role: e.target.value })}
                                            className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold shadow-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Employment type</label>
                                        <select
                                            value={newExperience.employmentType}
                                            onChange={e => setNewExperience({ ...newExperience, employmentType: e.target.value })}
                                            className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold shadow-sm"
                                        >
                                            <option value="">Please select</option>
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Self-employed">Self-employed</option>
                                            <option value="Freelance">Freelance</option>
                                            <option value="Internship">Internship</option>
                                            <option value="Contract">Contract</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Company or organization *</label>
                                        <input
                                            placeholder="Ex: Microsoft"
                                            value={newExperience.company}
                                            onChange={e => setNewExperience({ ...newExperience, company: e.target.value })}
                                            className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold shadow-sm"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 py-2">
                                        <input
                                            type="checkbox"
                                            id="currentlyWorking"
                                            checked={newExperience.currentlyWorking}
                                            onChange={e => setNewExperience({ ...newExperience, currentlyWorking: e.target.checked })}
                                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="currentlyWorking" className="text-sm font-bold text-gray-700 cursor-pointer">I am currently working in this role</label>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Start Month</label>
                                            <select
                                                value={newExperience.startMonth}
                                                onChange={e => setNewExperience({ ...newExperience, startMonth: e.target.value })}
                                                className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold shadow-sm"
                                            >
                                                <option value="">Month</option>
                                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                                    <option key={m} value={m}>{m}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Start Year *</label>
                                            <select
                                                value={newExperience.startYear}
                                                onChange={e => setNewExperience({ ...newExperience, startYear: e.target.value })}
                                                className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold shadow-sm"
                                            >
                                                <option value="">Year</option>
                                                {Array.from({ length: 50 }).map((_, i) => {
                                                    const year = new Date().getFullYear() - i;
                                                    return <option key={year} value={year}>{year}</option>;
                                                })}
                                            </select>
                                        </div>
                                    </div>

                                    {!newExperience.currentlyWorking && (
                                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">End Month</label>
                                                <select
                                                    value={newExperience.endMonth}
                                                    onChange={e => setNewExperience({ ...newExperience, endMonth: e.target.value })}
                                                    className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold shadow-sm"
                                                >
                                                    <option value="">Month</option>
                                                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                                        <option key={m} value={m}>{m}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">End Year *</label>
                                                <select
                                                    value={newExperience.endYear}
                                                    onChange={e => setNewExperience({ ...newExperience, endYear: e.target.value })}
                                                    className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold shadow-sm"
                                                >
                                                    <option value="">Year</option>
                                                    {Array.from({ length: 50 }).map((_, i) => {
                                                        const year = new Date().getFullYear() - i;
                                                        return <option key={year} value={year}>{year}</option>;
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Location</label>
                                        <input
                                            placeholder="Ex: London, United Kingdom"
                                            value={newExperience.location}
                                            onChange={e => setNewExperience({ ...newExperience, location: e.target.value })}
                                            className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold shadow-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Location type</label>
                                        <select
                                            value={newExperience.locationType}
                                            onChange={e => setNewExperience({ ...newExperience, locationType: e.target.value })}
                                            className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold shadow-sm"
                                        >
                                            <option value="">Please select</option>
                                            <option value="On-site">On-site</option>
                                            <option value="Hybrid">Hybrid</option>
                                            <option value="Remote">Remote</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Description</label>
                                        <textarea
                                            placeholder="Briefly describe your responsibilities and achievements..."
                                            value={newExperience.description}
                                            onChange={e => setNewExperience({ ...newExperience, description: e.target.value })}
                                            className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-medium shadow-sm resize-none"
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddExperience}
                                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 mt-4"
                                >
                                    Add to Profile
                                </button>
                            </div>
                        )}

                        <div className="space-y-10">
                            {(Array.isArray(editStates.experience ? formData.experience : user?.experience) ? (editStates.experience ? formData.experience : user?.experience) : []).map((exp, i) => (
                                <div key={i} className="flex gap-8 relative group/exp">
                                    <div className="flex flex-col items-center">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                                            <Briefcase className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1 w-0.5 bg-slate-100 mt-4 rounded-full"></div>
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <h3 className="text-xl font-black text-gray-900">{exp.role}</h3>
                                                <p className="text-blue-600 font-bold">{exp.company} • <span className="text-gray-500 font-medium">{exp.employmentType}</span></p>
                                            </div>
                                            {editStates.experience && <X className="w-5 h-5 text-red-400 cursor-pointer hover:bg-red-50 rounded-lg p-1 transition-all" onClick={() => handleRemoveExperience(i)} />}
                                        </div>
                                        <p className="text-gray-400 font-black text-[11px] uppercase tracking-wider mb-3">
                                            {exp.duration} • {exp.location} ({exp.locationType})
                                        </p>
                                        <p className="text-gray-600 leading-relaxed font-medium bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">{exp.description}</p>
                                    </div>
                                </div>
                            ))}
                            {(!editStates.experience && (!user?.experience || user.experience.length === 0)) && (
                                <p className="text-gray-400 italic text-center py-4">No experience listed.</p>
                            )}
                        </div>
                    </div>

                    {/* Education */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-50">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center justify-between">
                                Education
                                <FileText className="w-6 h-6 text-indigo-600" />
                            </h2>
                            {!editStates.education ? (
                                <button onClick={() => toggleEdit('education')} className="p-2 hover:bg-indigo-50 rounded-lg transition-all group">
                                    <Plus className="w-6 h-6 text-gray-300 group-hover:text-indigo-600" />
                                </button>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <button onClick={() => toggleEdit('education')} className="text-sm font-black text-gray-400">Cancel</button>
                                    <button onClick={() => handleSubmit('education')} className="text-sm font-black text-indigo-600">Save List</button>
                                </div>
                            )}
                        </div>

                        {editStates.education && (
                            <div className="bg-indigo-50/50 p-8 rounded-3xl mb-8 space-y-6 border border-indigo-100">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">School *</label>
                                        <input
                                            placeholder="Ex: Boston University"
                                            value={newEducation.school}
                                            onChange={e => setNewEducation({ ...newEducation, school: e.target.value })}
                                            className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold shadow-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Degree</label>
                                        <input
                                            placeholder="Ex: Bachelor of Science"
                                            value={newEducation.degree}
                                            onChange={e => setNewEducation({ ...newEducation, degree: e.target.value })}
                                            className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold shadow-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Field of study</label>
                                        <input
                                            placeholder="Ex: Business"
                                            value={newEducation.fieldOfStudy}
                                            onChange={e => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })}
                                            className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold shadow-sm"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Start Month</label>
                                            <select
                                                value={newEducation.startMonth}
                                                onChange={e => setNewEducation({ ...newEducation, startMonth: e.target.value })}
                                                className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold shadow-sm"
                                            >
                                                <option value="">Month</option>
                                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                                    <option key={m} value={m}>{m}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Start Year</label>
                                            <select
                                                value={newEducation.startYear}
                                                onChange={e => setNewEducation({ ...newEducation, startYear: e.target.value })}
                                                className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold shadow-sm"
                                            >
                                                <option value="">Year</option>
                                                {Array.from({ length: 50 }).map((_, i) => {
                                                    const year = new Date().getFullYear() - i;
                                                    return <option key={year} value={year}>{year}</option>;
                                                })}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">End Month (or expected)</label>
                                            <select
                                                value={newEducation.endMonth}
                                                onChange={e => setNewEducation({ ...newEducation, endMonth: e.target.value })}
                                                className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold shadow-sm"
                                            >
                                                <option value="">Month</option>
                                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                                    <option key={m} value={m}>{m}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">End Year (or expected)</label>
                                            <select
                                                value={newEducation.endYear}
                                                onChange={e => setNewEducation({ ...newEducation, endYear: e.target.value })}
                                                className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold shadow-sm"
                                            >
                                                <option value="">Year</option>
                                                {Array.from({ length: 60 }).map((_, i) => {
                                                    const year = (new Date().getFullYear() + 10) - i;
                                                    return <option key={year} value={year}>{year}</option>;
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddEducation}
                                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 mt-4"
                                >
                                    Add to Profile
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(Array.isArray(editStates.education ? formData.education : user?.education) ? (editStates.education ? formData.education : user?.education) : []).map((edu, i) => (
                                <div key={i} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 relative group/edu hover:bg-white hover:shadow-xl hover:shadow-indigo-50/50 transition-all">
                                    {editStates.education && <X className="absolute top-6 right-6 w-5 h-5 text-red-400 cursor-pointer hover:bg-red-50 rounded-lg p-1 transition-all" onClick={() => handleRemoveEducation(i)} />}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-indigo-50 shadow-sm">
                                            <FileText className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-gray-900 leading-tight">{edu.school}</h3>
                                            <p className="text-indigo-600 font-bold text-sm">{edu.degree} • <span className="text-gray-500">{edu.fieldOfStudy}</span></p>
                                        </div>
                                    </div>
                                    <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest bg-white/50 px-3 py-1.5 rounded-full inline-block">
                                        {edu.year}
                                    </p>
                                </div>
                            ))}
                            {(!editStates.education && (!user?.education || user.education.length === 0)) && (
                                <p className="text-gray-400 italic py-4 col-span-2">No education listed.</p>
                            )}
                        </div>
                    </div>

                    {/* Resume - Only for Seeker */}
                    {user?.role === 'JOB_SEEKER' && (
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-50 overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                    Resume & Portfolio
                                </h2>
                                {!editStates.resume ? (
                                    <button onClick={() => toggleEdit('resume')} className="flex items-center gap-2 text-blue-600 font-black hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">
                                        <Upload className="w-4 h-4" /> Change File
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => toggleEdit('resume')} className="text-sm font-black text-gray-400">Cancel</button>
                                        <button onClick={() => handleSubmit('resume')} className="text-sm font-black text-blue-600">Upload</button>
                                    </div>
                                )}
                            </div>

                            {user?.resumeUrl && !editStates.resume ? (
                                <div className="flex items-center justify-between p-6 bg-blue-50 border border-blue-100 rounded-3xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-blue-600">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <p className="font-black text-gray-900">{user.resumeName || 'Resume'}</p>
                                    </div>
                                    <a href={`http://44.213.126.195${user.resumeUrl}`} target="_blank" rel="noreferrer" className="bg-white text-blue-600 px-6 py-2.5 rounded-2xl font-black shadow-lg">Download</a>
                                </div>
                            ) : (editStates.resume || !user?.resumeUrl) && (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-200 rounded-[2rem] p-10 text-center cursor-pointer hover:bg-gray-50 transition-all"
                                >
                                    <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeChange} />
                                    <Upload className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                                    <p className="font-black text-gray-900">{selectedResume ? selectedResume.name : (user?.resumeUrl ? 'Click to change Resume' : 'Click to upload Resume')}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
