import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/user.api";
import { Mail, Lock, User } from "lucide-react";

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
    });

    const [globalError, setGlobalError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });

        if (fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setGlobalError(null);
        setFieldErrors({});

        if (form.password !== form.confirmPassword) {
            setFieldErrors({
                confirmPassword: "Passwords do not match"
            });
            setIsLoading(false);
            return;
        }

        try {
            await registerUser(form);
            navigate("/login");
        } catch (err) {
            setGlobalError(err.message);
            setFieldErrors(err.errors || {});
        } finally {
            setIsLoading(false);
        }
    };

    const handleDismissError = () => {
        setGlobalError(null);
        setFieldErrors({});
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-semibold text-gray-900">EcoHub</h1>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create your account</h2>
                    <p className="text-gray-600">Join us in building a sustainable future</p>
                </div>

                {/* Registration Form */}
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    {/* Global Error Message */}
                    {globalError && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                            <span className="text-sm text-red-600">{globalError}</span>
                            <button
                                onClick={handleDismissError}
                                className="text-red-500 hover:text-red-700"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name fields - Grid layout */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        placeholder="John"
                                        required
                                        disabled={isLoading}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                                            fieldErrors.firstName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                </div>
                                {fieldErrors.firstName && (
                                    <p className="mt-1 text-sm text-red-600">{fieldErrors.firstName}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    required
                                    disabled={isLoading}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                                        fieldErrors.lastName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {fieldErrors.lastName && (
                                    <p className="mt-1 text-sm text-red-600">{fieldErrors.lastName}</p>
                                )}
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    required
                                    disabled={isLoading}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                                        fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                            </div>
                            {fieldErrors.email && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    required
                                    disabled={isLoading}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                                        fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                            </div>
                            {fieldErrors.password && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    required
                                    disabled={isLoading}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                                        fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                            </div>
                            {fieldErrors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start">
                            <input
                                id="terms"
                                type="checkbox"
                                required
                                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 mt-1"
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                                I agree to the{' '}
                                <a href="#" className="text-emerald-600 hover:text-emerald-700">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-emerald-600 hover:text-emerald-700">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <a href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-6 text-center">
                    <a href="/" className="text-gray-600 hover:text-gray-900 text-sm inline-flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Register;