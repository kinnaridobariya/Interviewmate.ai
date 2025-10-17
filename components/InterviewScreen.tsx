
import React, { useState, useCallback } from 'react';
import { InterviewFeedback, InterviewSession } from '../types';
import Button from './Button';
import Card from './Card';
import LoadingSpinner from './LoadingSpinner';
import { getAnswerFeedback } from '../services/geminiService';
import FeedbackDisplay from './FeedbackDisplay';

interface InterviewScreenProps {
    session: InterviewSession;
    currentQuestionIndex: number;
    onAnswerSubmit: (answer: string, feedback: InterviewFeedback) => void;
    onNextQuestion: () => void;
}

const InterviewScreen: React.FC<InterviewScreenProps> = ({ session, currentQuestionIndex, onAnswerSubmit, onNextQuestion }) => {
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currentQuestion = session.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === session.questions.length - 1;

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!answer.trim()) return;

        setIsLoading(true);
        setError(null);
        setFeedback(null);
        try {
            const receivedFeedback = await getAnswerFeedback(session.role, currentQuestion, answer);
            setFeedback(receivedFeedback);
            onAnswerSubmit(answer, receivedFeedback);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setIsLoading(false);
        }
    }, [answer, currentQuestion, onAnswerSubmit, session.role]);

    const handleNext = () => {
        onNextQuestion();
        setAnswer('');
        setFeedback(null);
        setError(null);
    };

    return (
        <Card className="w-full">
            <div className="mb-6">
                <p className="text-blue-400 font-semibold mb-2">
                    Question {currentQuestionIndex + 1} of {session.questions.length}
                </p>
                <h2 className="text-2xl font-bold text-white">{currentQuestion}</h2>
            </div>

            {!feedback && !isLoading && (
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        rows={8}
                        className="w-full bg-slate-700 text-white placeholder-slate-400 border border-slate-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={!answer.trim() || isLoading}>
                        Submit Answer
                    </Button>
                </form>
            )}

            {isLoading && (
                <div className="flex flex-col items-center justify-center p-8 space-y-4">
                    <LoadingSpinner />
                    <p className="text-slate-300">Analyzing your answer...</p>
                </div>
            )}

            {error && <p className="text-red-400 mt-4">{error}</p>}
            
            {feedback && (
                <div className="mt-6 animate-fade-in">
                    <FeedbackDisplay feedback={feedback} />
                    <Button onClick={handleNext} className="mt-6">
                        {isLastQuestion ? "Finish & View Review" : "Next Question"}
                    </Button>
                </div>
            )}
        </Card>
    );
};

export default InterviewScreen;
