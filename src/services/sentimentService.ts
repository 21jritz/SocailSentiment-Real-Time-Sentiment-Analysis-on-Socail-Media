import axios from 'axios';

// Mock sentiment analysis for development
const mockSentimentAnalysis = (text: string) => {
  const positiveWords = ['amazing', 'great', 'love', 'perfect', 'fantastic', 'excellent', 'good', 'awesome'];
  const negativeWords = ['terrible', 'bad', 'horrible', 'disappointed', 'frustrating', 'issues', 'worst', 'hate'];
  
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 0.2;
    if (negativeWords.includes(word)) score -= 0.2;
  });
  
  // Clamp score between -1 and 1
  score = Math.max(-1, Math.min(1, score));
  
  return {
    score,
    sentiment: score > 0.3 ? 'positive' : score < -0.3 ? 'negative' : 'neutral',
    confidence: 0.8 + Math.random() * 0.2 // Mock confidence score between 0.8 and 1.0
  };
};

export const analyzeSentiment = async (text: string) => {
  try {
    // For development and demo, use mock sentiment analysis
    return mockSentimentAnalysis(text);
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw new Error('Failed to analyze sentiment. Please try again later.');
  }
};