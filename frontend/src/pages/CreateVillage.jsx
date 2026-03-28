import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createVillage } from '../api/village.api';

export default function CreateVillage() {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        population: '',
        water: 50,
        energy: 50,
        food: 50,
        budget: '',
        wasteRecycling: 50,
        greenEnergy: 50,
        infrastructure: 50,
        education: 50
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleSliderChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: parseInt(e.target.value)
        });
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = {
                ...formData,
                population: parseInt(formData.population),
                budget: parseFloat(formData.budget)
            };

            await createVillage(data);
            navigate('/home');
        } catch (err) {
            setError(err.message || 'Failed to create village');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const getUserInitials = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        }
        if (user?.email) {
            return user.email[0].toUpperCase();
        }
        return 'U';
    };

    const getValueColor = (value) => {
        if (value >= 80) return 'text-green-600';
        if (value >= 60) return 'text-blue-600';
        if (value >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center cursor-pointer" onClick={() => navigate('/home')}>
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">EcoHub</h1>
                                <p className="text-sm text-gray-500">Create New Village</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                {isLoggingOut ? 'Logging out...' : 'Logout'}
                            </button>
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                <span className="text-emerald-700 font-medium">{getUserInitials()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-xl font-semibold text-gray-900">Create New Village</h2>
                        <p className="text-sm text-gray-500">Fill in the details to start your sustainability journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Village Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter village name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="City, Region"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Population *</label>
                                <input
                                    type="number"
                                    name="population"
                                    value={formData.population}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    placeholder="Number of residents"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Budget (thousands BGN) *</label>
                                <input
                                    type="number"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="1000"
                                    placeholder="Available budget"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Resource Sliders */}
                        <div className="space-y-6 pt-4 border-t border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Resource Assessment</h3>
                            <p className="text-sm text-gray-500">Rate each resource from 0% (critical) to 100% (excellent)</p>

                            {/* Water */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">💧 Water Resources</label>
                                    <span className={`text-sm font-semibold ${getValueColor(formData.water)}`}>{formData.water}%</span>
                                </div>
                                <input
                                    type="range"
                                    name="water"
                                    min="0"
                                    max="100"
                                    value={formData.water}
                                    onChange={handleSliderChange}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.water < 30 ? 'Critical water shortage' :
                                        formData.water < 60 ? 'Limited water supply' :
                                            formData.water < 80 ? 'Adequate water supply' : 'Excellent water resources'}
                                </p>
                            </div>

                            {/* Energy */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">⚡ Energy Resources</label>
                                    <span className={`text-sm font-semibold ${getValueColor(formData.energy)}`}>{formData.energy}%</span>
                                </div>
                                <input
                                    type="range"
                                    name="energy"
                                    min="0"
                                    max="100"
                                    value={formData.energy}
                                    onChange={handleSliderChange}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.energy < 30 ? 'Frequent power outages' :
                                        formData.energy < 60 ? 'Unstable power supply' :
                                            formData.energy < 80 ? 'Stable electricity' : 'Reliable energy with renewables'}
                                </p>
                            </div>

                            {/* Food */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">🌾 Food Security</label>
                                    <span className={`text-sm font-semibold ${getValueColor(formData.food)}`}>{formData.food}%</span>
                                </div>
                                <input
                                    type="range"
                                    name="food"
                                    min="0"
                                    max="100"
                                    value={formData.food}
                                    onChange={handleSliderChange}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.food < 30 ? 'Food crisis, external aid needed' :
                                        formData.food < 60 ? 'Food shortage, imports needed' :
                                            formData.food < 80 ? 'Adequate food production' : 'Food self-sufficient with surplus'}
                                </p>
                            </div>

                            {/* Waste Recycling */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">♻️ Waste Recycling</label>
                                    <span className={`text-sm font-semibold ${getValueColor(formData.wasteRecycling)}`}>{formData.wasteRecycling}%</span>
                                </div>
                                <input
                                    type="range"
                                    name="wasteRecycling"
                                    min="0"
                                    max="100"
                                    value={formData.wasteRecycling}
                                    onChange={handleSliderChange}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.wasteRecycling < 30 ? 'No recycling system' :
                                        formData.wasteRecycling < 60 ? 'Basic recycling bins' :
                                            formData.wasteRecycling < 80 ? 'Good recycling program' : 'Zero-waste community'}
                                </p>
                            </div>

                            {/* Green Energy */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">🌞 Green Energy</label>
                                    <span className={`text-sm font-semibold ${getValueColor(formData.greenEnergy)}`}>{formData.greenEnergy}%</span>
                                </div>
                                <input
                                    type="range"
                                    name="greenEnergy"
                                    min="0"
                                    max="100"
                                    value={formData.greenEnergy}
                                    onChange={handleSliderChange}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.greenEnergy < 30 ? '100% fossil fuel dependent' :
                                        formData.greenEnergy < 60 ? 'Few solar panels installed' :
                                            formData.greenEnergy < 80 ? 'Significant renewable share' : 'Energy independent with renewables'}
                                </p>
                            </div>

                            {/* Infrastructure */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">🏗️ Infrastructure</label>
                                    <span className={`text-sm font-semibold ${getValueColor(formData.infrastructure)}`}>{formData.infrastructure}%</span>
                                </div>
                                <input
                                    type="range"
                                    name="infrastructure"
                                    min="0"
                                    max="100"
                                    value={formData.infrastructure}
                                    onChange={handleSliderChange}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.infrastructure < 30 ? 'Poor roads, no internet' :
                                        formData.infrastructure < 60 ? 'Basic infrastructure' :
                                            formData.infrastructure < 80 ? 'Good roads, broadband internet' : 'Modern infrastructure, smart village'}
                                </p>
                            </div>

                            {/* Education */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">📚 Education</label>
                                    <span className={`text-sm font-semibold ${getValueColor(formData.education)}`}>{formData.education}%</span>
                                </div>
                                <input
                                    type="range"
                                    name="education"
                                    min="0"
                                    max="100"
                                    value={formData.education}
                                    onChange={handleSliderChange}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.education < 30 ? 'No school, high illiteracy' :
                                        formData.education < 60 ? 'Basic education available' :
                                            formData.education < 80 ? 'Good schools, educated population' : 'Excellent education, skilled workforce'}
                                </p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate('/home')}
                                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400"
                            >
                                {loading ? 'Creating...' : 'Create Village'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}