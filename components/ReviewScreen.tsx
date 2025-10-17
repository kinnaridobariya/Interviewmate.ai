
import React from 'react';
import { InterviewSession } from '../types';
import Button from './Button';
import Card from './Card';
import FeedbackDisplay from './FeedbackDisplay';

interface ReviewScreenProps {
    session: InterviewSession;
    onStartOver: () => void;
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({ session, onStartOver }) => {
    return (
        <Card className="w-full">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white">Interview Review</h2>
                <p className="text-slate-400 mt-2">Here's a summary of your performance for the <span className="font-semibold text-blue-400">{session.role}</span> role.</p>
            </div>

            <div className="space-y-6">
                {session.questions.map((question, index) => (
                    <details key={index} className="bg-slate-800 rounded-lg p-4 border border-slate-700 group">
                        <summary className="font-semibold text-lg text-white cursor-pointer list-none flex justify-between items-center">
                            <span>{`Q${index + 1}: ${question}`}</span>
                            <span className="transform transition-transform duration-200 group-open:rotate-180">▼</span>
                        </summary>
                        <div className="mt-4 pt-4 border-t border-slate-700 space-y-4">
                            <div>
                                <h4 className="font-semibold text-blue-300 mb-2">Your Answer:</h4>
                                <p className="text-slate-300 bg-slate-700/50 p-3 rounded-md whitespace-pre-wrap">{session.answers[index] || "No answer provided."}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-blue-300 mb-2">AI Feedback:</h4>
                                {session.feedback[index] ? (
                                    <FeedbackDisplay feedback={session.feedback[index]} />
                                ) : (
                                    <p className="text-slate-400">No feedback available.</p>
                                )}
                            </div>
                        </div>
                    </details>
                ))}
            </div>

            <div className="text-center mt-8">
                <Button onClick={onStartOver}>
                    Start a New Session
                </Button>
            </div>
        </Card>
    );
};

export default ReviewScreen;
