
import React, { useState, useCallback } from 'react';
import { AppState, InterviewSession } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import SetupScreen from './components/SetupScreen';
import InterviewScreen from './components/InterviewScreen';
import ReviewScreen from './components/ReviewScreen';
import { generateInterviewQuestions } from './services/geminiService';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
    const [interviewSession, setInterviewSession] = useState<InterviewSession | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

    const handleStartSetup = () => {
        setAppState(AppState.SETUP);
        setError(null);
        setInterviewSession(null);
    };

    const handleStartInterview = useCallback(async (role: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const questions = await generateInterviewQuestions(role);
            setInterviewSession({
                role,
                questions,
                answers: {},
                feedback: {},
            });
            setCurrentQuestionIndex(0);
            setAppState(AppState.INTERVIEW);
        } catch (e) {
            setError((e as Error).message);
            setAppState(AppState.SETUP); // Revert to setup on error
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleAnswerSubmit = (answer: string, feedback: any) => {
        if (!interviewSession) return;

        setInterviewSession(prev => prev ? ({
            ...prev,
            answers: { ...prev.answers, [currentQuestionIndex]: answer },
            feedback: { ...prev.feedback, [currentQuestionIndex]: feedback },
        }) : null);
    };

    const handleNextQuestion = () => {
        if (!interviewSession) return;
        if (currentQuestionIndex < interviewSession.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setAppState(AppState.REVIEW);
        }
    };

    const renderContent = () => {
        switch (appState) {
            case AppState.WELCOME:
                return <WelcomeScreen onStart={handleStartSetup} />;
            case AppState.SETUP:
                return (
                    <SetupScreen
                        onStartInterview={handleStartInterview}
                        isLoading={isLoading}
                        error={error}
                    />
                );
            case AppState.INTERVIEW:
                if (!interviewSession) return null;
                return (
                    <InterviewScreen
                        session={interviewSession}
                        currentQuestionIndex={currentQuestionIndex}
                        onAnswerSubmit={handleAnswerSubmit}
                        onNextQuestion={handleNextQuestion}
                    />
                );
            case AppState.REVIEW:
                 if (!interviewSession) return null;
                return <ReviewScreen session={interviewSession} onStartOver={handleStartSetup} />;
            default:
                return <WelcomeScreen onStart={handleStartSetup} />;
        }
    };
    
    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center justify-center p-4 font-sans">
            <header className="w-full max-w-4xl text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    Interview Prep AI
                </h1>
                <p className="text-slate-400 mt-2">Your personal AI-powered interview coach.</p>
            </header>
            <main className="w-full max-w-4xl">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;
