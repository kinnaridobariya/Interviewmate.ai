
import React from 'react';
import Button from './Button';
import Card from './Card';

interface WelcomeScreenProps {
    onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
    return (
        <Card className="text-center flex flex-col items-center">
            <h2 className="text-3xl font-bold text-white mb-4">Welcome to Your AI Interview Coach</h2>
            <p className="text-slate-300 mb-8 max-w-2xl">
                Get ready to ace your next interview. We'll generate tailored questions based on your target job role and provide instant, expert feedback on your answers.
            </p>
            <Button onClick={onStart}>
                Get Started
            </Button>
        </Card>
    );
};

export default WelcomeScreen;
