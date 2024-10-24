import React, { useState } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { fetchTweets } from '../services/twitterService';
import { analyzeSentiment } from '../services/sentimentService';
import { Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistance } from 'date-fns';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const Dashboard = () => {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [sentimentData, setSentimentData] = useState({
    overallScore: 0,
    sentimentOverTime: [] as { x: string; y: number }[],
    sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
    confidenceScores: [] as number[],
    topKeywords: [] as { keyword: string; count: number }[]
  });

  const handleAnalyze = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      const fetchedPosts = await fetchTweets(query);
      setPosts(fetchedPosts);
      
      setAnalyzing(true);
      const sentiments = await Promise.all(
        fetchedPosts.map(post => analyzeSentiment(post.text))
      );

      const overallScore = sentiments.reduce((acc, curr) => acc + curr.score, 0) / sentiments.length;
      const sentimentOverTime = sentiments.map((s, i) => ({
        x: formatDistance(new Date(fetchedPosts[i].created_at), new Date(), { addSuffix: true }),
        y: s.score
      }));

      const distribution = sentiments.reduce((acc, curr) => {
        if (curr.score > 0.3) acc.positive++;
        else if (curr.score < -0.3) acc.negative++;
        else acc.neutral++;
        return acc;
      }, { positive: 0, neutral: 0, negative: 0 });

      setSentimentData({
        overallScore,
        sentimentOverTime,
        sentimentDistribution: distribution,
        confidenceScores: sentiments.map(s => s.confidence || 1),
        topKeywords: extractTopKeywords(fetchedPosts.map(p => p.text))
      });

      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const extractTopKeywords = (texts: string[]): { keyword: string; count: number }[] => {
    const stopWords = new Set(['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have']);
    const words = texts.flatMap(text => 
      text.toLowerCase()
         .split(/\s+/)
         .filter(word => !stopWords.has(word) && word.length > 2)
    );

    const wordCounts = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([keyword, count]) => ({ keyword, count }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search query"
          className="flex-grow p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading || analyzing}
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || analyzing}
          className="bg-blue-500 text-white p-2 rounded flex items-center hover:bg-blue-600 disabled:opacity-50"
        >
          {loading || analyzing ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <Search className="mr-2" />
          )}
          {loading ? 'Searching...' : analyzing ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {posts.length > 0 && !loading && !analyzing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Overall Sentiment</h2>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">
                {sentimentData.overallScore.toFixed(2)}
              </p>
              <p className="text-gray-500">
                {sentimentData.overallScore > 0.3 ? 'Positive' : 
                 sentimentData.overallScore < -0.3 ? 'Negative' : 'Neutral'}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Sentiment Distribution</h2>
            <Pie
              data={{
                labels: ['Positive', 'Neutral', 'Negative'],
                datasets: [{
                  data: [
                    sentimentData.sentimentDistribution.positive,
                    sentimentData.sentimentDistribution.neutral,
                    sentimentData.sentimentDistribution.negative
                  ],
                  backgroundColor: [
                    'rgba(72, 187, 120, 0.6)',
                    'rgba(237, 137, 54, 0.6)',
                    'rgba(245, 101, 101, 0.6)'
                  ]
                }]
              }}
            />
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Sentiment Over Time</h2>
            <Line
              data={{
                labels: sentimentData.sentimentOverTime.map(d => d.x),
                datasets: [{
                  label: 'Sentiment Score',
                  data: sentimentData.sentimentOverTime.map(d => d.y),
                  borderColor: 'rgb(66, 153, 225)',
                  tension: 0.1
                }]
              }}
              options={{
                scales: {
                  y: {
                    min: -1,
                    max: 1
                  }
                }
              }}
            />
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Top Keywords</h2>
            <Bar
              data={{
                labels: sentimentData.topKeywords.map(k => k.keyword),
                datasets: [{
                  label: 'Frequency',
                  data: sentimentData.topKeywords.map(k => k.count),
                  backgroundColor: 'rgba(90, 103, 216, 0.6)'
                }]
              }}
            />
          </div>

          <div className="col-span-full bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
            <div className="space-y-4">
              {posts.slice(0, 5).map(post => (
                <div key={post.id} className="border-b pb-4">
                  <p className="text-gray-800">{post.text}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {formatDistance(new Date(post.created_at), new Date(), { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;