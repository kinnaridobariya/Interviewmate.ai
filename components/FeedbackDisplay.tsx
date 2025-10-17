
import React from 'react';
import { InterviewFeedback } from '../types';

interface FeedbackDisplayProps {
    feedback: InterviewFeedback;
}

const FeedbackItem: React.FC<{ title: string; content: string }> = ({ title, content }) => (
    <div>
        <h4 className="text-lg font-semibold text-blue-300 mb-1">{title}</h4>
        <p className="text-slate-300 whitespace-pre-wrap">{content}</p>
    </div>
);

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback }) => {
    return (
        <div className="bg-slate-900/50 rounded-lg p-6 space-y-4 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Feedback</h3>
            <FeedbackItem title="Clarity & Conciseness" content={feedback.clarity} />
            <FeedbackItem title="Relevance" content={feedback.relevance} />
            <FeedbackItem title="Completeness" content={feedback.completeness} />
            <div className="pt-4 border-t border-slate-700">
                <h4 className="text-lg font-semibold text-blue-300 mb-2">Summary & Suggested Answer</h4>
                 <p className="text-slate-300 whitespace-pre-wrap">{feedback.summary}</p>
            </div>
        </div>
    );
};

export default FeedbackDisplay;
