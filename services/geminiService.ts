
import { GoogleGenAI, Type } from "@google/genai";
import { InterviewFeedback } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateInterviewQuestions(role: string): Promise<string[]> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate 5 common interview questions for a ${role} position. The questions should cover a range of topics including technical skills, behavioral questions, and problem-solving scenarios.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        questions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                                description: "An interview question."
                            }
                        }
                    }
                }
            }
        });

        const jsonResponse = JSON.parse(response.text);
        if (jsonResponse.questions && Array.isArray(jsonResponse.questions)) {
            return jsonResponse.questions;
        } else {
            throw new Error("Invalid response format from API.");
        }
    } catch (error) {
        console.error("Error generating interview questions:", error);
        throw new Error("Failed to generate interview questions. Please try again.");
    }
}

export async function getAnswerFeedback(role: string, question: string, answer: string): Promise<InterviewFeedback> {
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `As an expert interviewer and career coach, analyze the following interview answer and provide constructive feedback.
            Job Role: ${role}
            Question: ${question}
            Answer: ${answer}

            Provide feedback on the following points:
            1. Clarity and Conciseness: Was the answer clear and to the point?
            2. Relevance: Did the answer directly address the question?
            3. Completeness: Did the answer cover all important aspects?
            4. Overall Impression: Give a summary of the answer's strengths and weaknesses and provide a suggested improved answer.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        clarity: {
                            type: Type.STRING,
                            description: "Feedback on the clarity and conciseness of the answer."
                        },
                        relevance: {
                            type: Type.STRING,
                            description: "Feedback on the relevance of the answer to the question."
                        },
                        completeness: {
                             type: Type.STRING,
                            description: "Feedback on the completeness of the answer."
                        },
                        summary: {
                             type: Type.STRING,
                            description: "An overall summary of strengths, weaknesses, and a suggested improved answer."
                        }
                    },
                     required: ["clarity", "relevance", "completeness", "summary"]
                }
            }
        });
        
        const jsonResponse = JSON.parse(response.text);
        return jsonResponse as InterviewFeedback;

    } catch (error) {
        console.error("Error getting feedback:", error);
        throw new Error("Failed to get feedback on the answer. Please try again.");
    }
}
