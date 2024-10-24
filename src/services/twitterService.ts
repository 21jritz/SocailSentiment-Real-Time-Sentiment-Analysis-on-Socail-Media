import axios from 'axios';

// Mock data for development
const MOCK_TWEETS = [
  { id: '1', text: 'Just had an amazing experience with the new iPhone! The camera is incredible! #Apple #iPhone', created_at: '2024-03-10T10:00:00Z' },
  { id: '2', text: 'The customer service was terrible. Been waiting for hours! Never shopping here again. #BadService', created_at: '2024-03-10T10:05:00Z' },
  { id: '3', text: 'Beautiful day for a walk in the park. Nature is so peaceful. #Outdoors', created_at: '2024-03-10T10:10:00Z' },
  { id: '4', text: 'This new restaurant is okay. Food was decent but a bit overpriced. #FoodReview', created_at: '2024-03-10T10:15:00Z' },
  { id: '5', text: 'Absolutely love the new update! Great improvements! #Software', created_at: '2024-03-10T10:20:00Z' },
  { id: '6', text: 'Traffic is horrible today. Going to be late for work again... #Traffic #Monday', created_at: '2024-03-10T10:25:00Z' },
  { id: '7', text: 'Just finished reading an amazing book! Highly recommend! #Reading', created_at: '2024-03-10T10:30:00Z' },
  { id: '8', text: 'Why is the wifi so slow today? Frustrating! #Internet #Problems', created_at: '2024-03-10T10:35:00Z' },
  { id: '9', text: 'Great meeting with the team today. Exciting projects ahead! #Work', created_at: '2024-03-10T10:40:00Z' },
  { id: '10', text: 'This weather is perfect! Not too hot, not too cold. #Weather', created_at: '2024-03-10T10:45:00Z' }
];

// Function to generate more mock tweets based on the query
const generateMockTweets = (query: string, count: number = 100) => {
  const sentiments = ['positive', 'negative', 'neutral'];
  const hashtags = ['#Technology', '#Service', '#Life', '#Review', '#Experience'];
  const baseTexts = [
    'Really loving the {query}! Amazing experience!',
    'Not happy with the {query}. Needs improvement.',
    'Just tried {query}. It\'s okay I guess.',
    'Can\'t believe how great {query} is! Fantastic!',
    'Disappointed with {query}. Expected better.',
    'Mixed feelings about {query}. Has pros and cons.',
    '{query} is exactly what I needed! Perfect!',
    'Having issues with {query}. Very frustrating.',
    'Neutral opinion about {query}. Nothing special.',
    'The new {query} update is amazing! Great work!'
  ];

  return Array.from({ length: count }, (_, i) => {
    const baseText = baseTexts[Math.floor(Math.random() * baseTexts.length)];
    const hashtag = hashtags[Math.floor(Math.random() * hashtags.length)];
    const text = baseText.replace('{query}', query) + ' ' + hashtag;
    const date = new Date(Date.now() - Math.floor(Math.random() * 86400000));

    return {
      id: (i + 1).toString(),
      text,
      created_at: date.toISOString()
    };
  });
};

export const fetchTweets = async (query: string) => {
  try {
    // For development, return mock data
    const mockTweets = generateMockTweets(query);
    return mockTweets;

    // Real API call code (commented out for now)
    /*
    const response = await axios.get(TWITTER_API_ENDPOINT, {
      params: {
        query: query,
        max_results: 100,
        'tweet.fields': 'created_at,text'
      },
      headers: {
        Authorization: `Bearer ${TWITTER_API_BEARER_TOKEN}`
      }
    });
    return response.data.data;
    */
  } catch (error) {
    console.error('Error fetching tweets:', error);
    throw new Error('Failed to fetch tweets. Please try again later.');
  }
};