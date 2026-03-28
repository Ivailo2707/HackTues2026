import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllVillages, deleteVillage } from '../api/village.api';

export default function Home() {
    const navigate = useNavigate();
    const { logout, user } = useAuth(); // Вземаме logout от AuthContext
    const [villages, setVillages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState(null);

    // Fetch villages on component mount
    useEffect(() => {
        fetchVillages();
    }, []);

    const fetchVillages = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllVillages();
            setVillages(data);
        } catch (err) {
            console.error('Failed to fetch villages:', err);
            setError(err.message || 'Failed to load villages');
        } finally {
            setLoading(false);
        }
    };

    const handleVillageClick = (id) => {
        navigate(`/villages/${id}`);
    };

    const handleNewVillage = () => {
        navigate('/create-village');
    };

    const handleDeleteVillage = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this village?')) {
            try {
                await deleteVillage(id);
                setVillages(villages.filter(v => v.id !== id));
            } catch (err) {
                console.error('Failed to delete village:', err);
                alert('Failed to delete village');
            }
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        setLogoutError(null);

        try {
            await logout(); // Използваме logout от AuthContext
            navigate("/");
        } catch (err) {
            setLogoutError(err.message);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const getRatingColor = (rating) => {
        switch (rating) {
            case "Excellent":
                return "bg-green-100 text-green-700";
            case "Good":
                return "bg-blue-100 text-blue-700";
            case "Poor":
                return "bg-yellow-100 text-yellow-700";
            case "Critical":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getRatingIcon = (rating) => {
        switch (rating) {
            case "Excellent":
                return "🌟";
            case "Good":
                return "👍";
            case "Poor":
                return "⚠️";
            case "Critical":
                return "🔴";
            default:
                return "📊";
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('bg-BG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        }
        if (user?.email) {
            return user.email[0].toUpperCase();
        }
        return 'U';
    };

    // Stats calculations
    const totalVillages = villages.length;
    const excellentCount = villages.filter(v => v.rating === "Excellent").length;
    const goodCount = villages.filter(v => v.rating === "Good").length;
    const poorCount = villages.filter(v => v.rating === "Poor").length;
    const criticalCount = villages.filter(v => v.rating === "Critical").length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">EcoHub</h1>
                                <p className="text-sm text-gray-500">Village Development Manager</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Logout Button */}
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

                            {/* Notification Bell */}
                            <button className="text-gray-600 hover:text-gray-900">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>

                            {/* User Avatar */}
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                <span className="text-emerald-700 font-medium">{getUserInitials()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Logout Error Message */}
                    {logoutError && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{logoutError}</p>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section with User Name */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.firstName || user?.email?.split('@')[0] || 'User'}! 👋
                    </h2>
                    <p className="text-gray-600">Manage and track your communities' sustainability</p>
                </div>

                {/* Top Section */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">My Villages</h3>
                        <p className="text-sm text-gray-500">You have {totalVillages} village{totalVillages !== 1 ? 's' : ''}</p>
                    </div>
                    <button
                        onClick={handleNewVillage}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Village
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 text-sm">Total Villages</span>
                            <span className="text-2xl">🏘️</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{totalVillages}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 text-sm">Excellent</span>
                            <span className="text-2xl">🌟</span>
                        </div>
                        <p className="text-3xl font-bold text-green-600">{excellentCount}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 text-sm">Good</span>
                            <span className="text-2xl">👍</span>
                        </div>
                        <p className="text-3xl font-bold text-blue-600">{goodCount}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 text-sm">Needs Attention</span>
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <p className="text-3xl font-bold text-yellow-600">{poorCount + criticalCount}</p>
                    </div>
                </div>

                {/* Villages List */}
                {!loading && !error && villages.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-900">My Villages</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {villages.map((village) => (
                                <div
                                    key={village.id}
                                    onClick={() => handleVillageClick(village.id)}
                                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-2xl">🏡</span>
                                                <h4 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                                    {village.name}
                                                </h4>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRatingColor(village.rating)}`}>
                          {getRatingIcon(village.rating)} {village.rating}
                        </span>
                                            </div>
                                            <p className="text-gray-600 mb-2 ml-11">
                                                {village.location} • Population: {village.population.toLocaleString()}
                                            </p>
                                            <div className="ml-11">
                                                <div className="flex items-center gap-4 mb-2">
                          <span className="text-sm text-gray-500">
                            Sustainability Score: {village.overallScore}%
                          </span>
                                                    <span className="text-sm text-gray-400">•</span>
                                                    <span className="text-sm text-gray-500">
                            Created: {formatDate(village.createdAt)}
                          </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-emerald-600 h-2 rounded-full transition-all"
                                                        style={{ width: `${village.overallScore}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => handleDeleteVillage(village.id, e)}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                            <svg
                                                className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="text-4xl mb-4">⏳</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading villages...</h3>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="text-4xl mb-4">❌</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading villages</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={fetchVillages}
                            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && villages.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="text-6xl mb-4">🌱</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No villages yet</h3>
                        <p className="text-gray-600 mb-6">Start your sustainability journey by creating your first village!</p>
                        <button
                            onClick={handleNewVillage}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create First Village
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}