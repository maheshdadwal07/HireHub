import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, MapPin, Loader2, Globe } from 'lucide-react';
import { createCompany } from '../../services/company.service';

const CreateCompany = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        website: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createCompany(formData);
            navigate('/recruiter/create-job');
        } catch (err) {
            setError(err.message || 'Failed to create company');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-10">
            <div className="text-center mb-8">
                <Building className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h1 className="text-2xl font-bold">Register Your Company</h1>
                <p className="text-gray-500">You need to register a company before posting jobs.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                        required
                        name="name"
                        onChange={handleChange}
                        className="w-full border-gray-200 rounded-lg p-3 border outline-none focus:ring-blue-500"
                        placeholder="e.g. Acme Corp"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            required
                            name="location"
                            onChange={handleChange}
                            className="w-full pl-10 border-gray-200 rounded-lg p-3 border outline-none focus:ring-blue-500"
                            placeholder="e.g. San Francisco, US"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website (Optional)</label>
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            name="website"
                            onChange={handleChange}
                            className="w-full pl-10 border-gray-200 rounded-lg p-3 border outline-none focus:ring-blue-500"
                            placeholder="https://example.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brief Description</label>
                    <textarea
                        required
                        name="description"
                        onChange={handleChange}
                        rows="3"
                        className="w-full border-gray-200 rounded-lg p-3 border outline-none focus:ring-blue-500"
                        placeholder="Tell us about your company..."
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-blue-300 flex justify-center items-center"
                >
                    {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Register Company'}
                </button>
            </form>
        </div>
    );
};

export default CreateCompany;
