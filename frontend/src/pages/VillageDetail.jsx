import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getVillageById } from '../api/village.api';
import { sendAiMessage } from '../api/ai.api';

export default function VillageDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const [village, setVillage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // AI Plan states
    const [userPlan, setUserPlan] = useState('');
    const [aiAnalysis, setAiAnalysis] = useState('');
    const [generatedPlan, setGeneratedPlan] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState('analyze'); // 'analyze' or 'generate'

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        fetchVillage();
    }, [id]);

    const fetchVillage = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getVillageById(id);
            setVillage(data);
        } catch (err) {
            console.error('Failed to fetch village:', err);
            setError(err.message || 'Failed to load village');
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyzePlan = async () => {
        if (!userPlan.trim()) {
            alert('Please write a development plan first');
            return;
        }

        setIsAnalyzing(true);
        setAiAnalysis('');

        try {
            const prompt = `Анализирай този план за село "${village.name}" (рейтинг: ${village.overallScore}%):

Текущи ресурси: Вода ${village.water}% | Храна ${village.food}% | Енергия ${village.energy}%

План: ${userPlan}

Дай кратък анализ:
🌾 Храна (${village.food}%): [1 изречение]
💧 Вода (${village.water}%): [1 изречение]
⚡ Енергия (${village.energy}%): [1 изречение]
✅ Силни страни: [1-2 точки]
⚠️ Рискове: [1-2 точки]
💡 Препоръки: [1-2 точки]

Отговори на български.`;

            const response = await sendAiMessage(prompt);
            setAiAnalysis(response);
        } catch (err) {
            console.error('Failed to analyze plan:', err);
            setAiAnalysis('Грешка: Неуспешен анализ. Моля опитайте отново.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleGeneratePlan = async () => {
        setIsGenerating(true);
        setGeneratedPlan('');

        try {
            const prompt = `Генерирай кратък план за земеделско развитие на село "${village.name}":

Текущо състояние:
- Население: ${village.population}
- Вода: ${village.water}%
- Енергия: ${village.energy}%
- Храна: ${village.food}%
- Бюджет: ${village.budget} хил.лв

Дай план в следния формат:

🎯 3 ПРИОРИТЕТНИ ПРОЕКТА
1. [Име] - [1 изречение описание] - Бюджет: X - Резултат: Y

💡 2 УСТОЙЧИВИ ПРАКТИКИ
- [кратко описание]

💰 ОБЩ БЮДЖЕТ: [сума]
📈 ОЧАКВАН РЕЗУЛТАТ: Хранителна сигурност +X%

Отговори на български, кратко и конкретно. Максимум 8-10 реда.`;

            const response = await sendAiMessage(prompt);
            setGeneratedPlan(response);
        } catch (err) {
            console.error('Failed to generate plan:', err);
            setGeneratedPlan('Грешка: Неуспешно генериране. Моля опитайте отново.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            navigate("/");
        } catch (err) {
            console.error('Logout error:', err);
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

    const getRatingColor = (rating) => {
        switch (rating) {
            case "Excellent": return "text-green-600";
            case "Good": return "text-blue-600";
            case "Poor": return "text-yellow-600";
            case "Critical": return "text-red-600";
            default: return "text-gray-600";
        }
    };

    const getValueColor = (value) => {
        if (value >= 80) return 'text-green-600';
        if (value >= 60) return 'text-blue-600';
        if (value >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">⏳</div>
                    <p className="text-gray-600">Loading village...</p>
                </div>
            </div>
        );
    }

    if (error || !village) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">❌</div>
                    <p className="text-gray-600 mb-4">{error || 'Village not found'}</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home')}>
                            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">EcoHub</h1>
                                <p className="text-sm text-gray-500">{village.name}</p>
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

            {/* Main Content - Left and Right Panels */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT PANEL - Village Details & AI Plan */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Village Overview Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900">Village Overview</h2>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${getRatingColor(village.rating).split('-')[1]}-100 ${getRatingColor(village.rating)}`}>
                    {village.rating} ({village.overallScore}%)
                  </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{village.location}</p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <p className="text-sm text-gray-500">Population</p>
                                        <p className="text-2xl font-semibold text-gray-900">{village.population.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Budget</p>
                                        <p className="text-2xl font-semibold text-gray-900">{village.budget.toLocaleString()} хил. лв</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="font-medium text-gray-700 mb-3">Resource Assessment</h3>

                                    {[
                                        { label: '💧 Water', value: village.water },
                                        { label: '⚡ Energy', value: village.energy },
                                        { label: '🌾 Food', value: village.food },
                                        { label: '♻️ Waste Recycling', value: village.wasteRecycling },
                                        { label: '🌞 Green Energy', value: village.greenEnergy },
                                        { label: '🏗️ Infrastructure', value: village.infrastructure },
                                        { label: '📚 Education', value: village.education }
                                    ].map((item) => (
                                        <div key={item.label}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">{item.label}</span>
                                                <span className={getValueColor(item.value)}>{item.value}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-emerald-600 h-2 rounded-full transition-all"
                                                    style={{ width: `${item.value}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* AI Plan Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="text-xl font-semibold text-gray-900">🌾 AI Agricultural Development Assistant</h2>
                                <p className="text-sm text-gray-500">Specialized in agricultural and food security planning</p>
                            </div>

                            <div className="p-6">
                                {/* Tabs */}
                                <div className="flex gap-2 mb-6 border-b border-gray-200">
                                    <button
                                        onClick={() => setActiveTab('analyze')}
                                        className={`px-4 py-2 font-medium transition-colors ${
                                            activeTab === 'analyze'
                                                ? 'text-emerald-600 border-b-2 border-emerald-600'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        📝 Analyze Agricultural Plan
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('generate')}
                                        className={`px-4 py-2 font-medium transition-colors ${
                                            activeTab === 'generate'
                                                ? 'text-emerald-600 border-b-2 border-emerald-600'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        🌾 Generate Agricultural Plan
                                    </button>
                                </div>

                                {/* Analyze Tab */}
                                {activeTab === 'analyze' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                ✍️ Write your agricultural development plan
                                            </label>
                                            <textarea
                                                value={userPlan}
                                                onChange={(e) => setUserPlan(e.target.value)}
                                                rows={5}
                                                placeholder="Пример: Планираме да въведем капково напояване на 200 декара, да засадим овощни градини и да изградим модерен склад за зърно. Също така искаме да организираме обучение за млади фермери и да въведем сертификация за биологично производство..."
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">
                                                {userPlan.length} символа
                                            </p>
                                        </div>

                                        <button
                                            onClick={handleAnalyzePlan}
                                            disabled={isAnalyzing || !userPlan.trim()}
                                            className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            {isAnalyzing ? '🔍 Analyzing agricultural plan...' : '🔍 Analyze Agricultural Plan'}
                                        </button>

                                        {aiAnalysis && (
                                            <div className="mt-4 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="text-2xl">🌾</span>
                                                    <h3 className="font-semibold text-gray-900 text-lg">Agricultural Analysis</h3>
                                                </div>
                                                <div className="text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto pr-2 leading-relaxed">
                                                    {aiAnalysis}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Generate Tab */}
                                {activeTab === 'generate' && (
                                    <div className="space-y-4">
                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-2 border border-green-200">
                                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                <span>📊</span> Current Agricultural Status
                                            </h3>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">🌾 Food Security:</span>
                                                    <span className={`font-bold ${getValueColor(village.food)}`}>{village.food}%</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">💧 Irrigation:</span>
                                                    <span className={`font-bold ${getValueColor(village.water)}`}>{village.water}%</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">⚡ Energy for farming:</span>
                                                    <span className={`font-bold ${getValueColor(village.energy)}`}>{village.energy}%</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">💰 Agricultural budget:</span>
                                                    <span className="font-bold text-gray-700">{village.budget} хил.лв</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleGeneratePlan}
                                            disabled={isGenerating}
                                            className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            {isGenerating ? '🌾 Generating agricultural plan...' : '🌾 Generate Agricultural Development Plan'}
                                        </button>

                                        {generatedPlan && (
                                            <div className="mt-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="text-2xl">🌱</span>
                                                    <h3 className="font-semibold text-gray-900 text-lg">Agricultural Development Plan</h3>
                                                </div>
                                                <div className="text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto pr-2 leading-relaxed">
                                                    {generatedPlan}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL - Community Chat (Placeholder) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                    </svg>
                                    <h2 className="text-lg font-semibold text-gray-900">Community Chat</h2>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Coming soon - Connect with other villages</p>
                            </div>
                            <div className="p-6 text-center">
                                <div className="text-4xl mb-3">💬</div>
                                <p className="text-gray-500 text-sm">
                                    Chat with other village managers, share ideas, and collaborate on sustainability projects.
                                </p>
                                <p className="text-xs text-gray-400 mt-3">Feature coming in the next update</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}