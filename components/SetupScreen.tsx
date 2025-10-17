
import React, { useState } from 'react';
import Button from './Button';
import Card from './Card';
import LoadingSpinner from './LoadingSpinner';

interface SetupScreenProps {
    onStartInterview: (role: string) => void;
    isLoading: boolean;
    error: string | null;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStartInterview, isLoading, error }) => {
    const [role, setRole] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (role.trim()) {
            onStartInterview(role.trim());
        }
    };

    return (
        <Card>
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
                <h2 className="text-2xl font-semibold text-white">Let's Get Started</h2>
                <p className="text-slate-300 text-center">Enter the job role you are interviewing for.</p>
                <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g., Senior Frontend Engineer"
                    className="w-full max-w-md bg-slate-700 text-white placeholder-slate-400 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    disabled={isLoading}
                />
                <Button type="submit" disabled={!role.trim() || isLoading}>
                    {isLoading ? (
                        <div className="flex items-center space-x-2">
                            <LoadingSpinner size={5} />
                            <span>Generating Questions...</span>
                        </div>
                    ) : (
                        "Start Interview"
                    )}
                </Button>
                {error && <p className="text-red-400 mt-4">{error}</p>}
            </form>
        </Card>
    );
};

export default SetupScreen;
