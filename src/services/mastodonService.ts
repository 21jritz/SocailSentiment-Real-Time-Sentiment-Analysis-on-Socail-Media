import axios from 'axios';
import { formatDistance } from 'date-fns';

const MASTODON_INSTANCE = 'https://mastodon.social';

export interface Post {
  id: string;
  content: string;
  created_at: string;
  account: {
    username: string;
    display_name: string;
    avatar: string;
  };
  formatted_time?: string;
}

export const searchPosts = async (query: string): Promise<Post[]> => {
  try {
    const response = await axios.get(`${MASTODON_INSTANCE}/api/v2/search`, {
      params: {
        q: query,
        type: 'statuses',
        limit: 100
      }
    });

    return response.data.statuses.map((post: any) => ({
      id: post.id,
      content: post.content.replace(/<[^>]*>/g, ''), // Remove HTML tags
      created_at: post.created_at,
      formatted_time: formatDistance(new Date(post.created_at), new Date(), { addSuffix: true }),
      account: {
        username: post.account.username,
        display_name: post.account.display_name || post.account.username,
        avatar: post.account.avatar
      }
    }));
  } catch (error) {
    console.error('Error fetching Mastodon posts:', error);
    throw new Error('Failed to fetch posts. Please try again later.');
  }
};