import axios from 'axios';

// Mock sentiment analysis for development
const mockSentimentAnalysis = (text: string) => {
  // Simple sentiment analysis based on keyword matching
  const positiveWords = ['amazing', 'great', 'love', 'perfect', 'fantastic', 'excellent'];
  const negativeWords = ['terrible', 'bad', 'horrible', 'disappointed', 'frustrating', 'issues'];
  
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
    sentiment: score > 0.3 ? 'positive' : score < -0.3 ? 'negative' : 'neutral'
  };
};

export const analyzeSentiment = async (text: string) => {
  try {
    // For development, return mock sentiment analysis
    return mockSentimentAnalysis(text);

    // Real API call code (commented out for now)
    /*
    const response = await axios.post(
      `${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `Analyze the sentiment of the following text and return a JSON object with a 'score' property (range -1 to 1) and a 'sentiment' property: "${text}"`
          }]
        }]
      }
    );

    const generatedText = response.data.candidates[0].content.parts[0].text;
    return JSON.parse(generatedText);
    */
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw new Error('Failed to analyze sentiment. Please try again later.');
  }
};