/**
 * OpenAI Service - Handles API calls for data processing
 * Replaces Puter with reliable OpenAI integration
 */

export interface UserData {
  id: string;
  name: string;
  phone: string;
  orchardName: string;
  location: string;
  crops: string[];
  lastLogin: string;
}

export interface MandiData {
  id: string;
  crop: string;
  market: string;
  price: string;
  trend: 'up' | 'down' | 'stable';
}

/**
 * Get user data from localStorage
 */
export function getUserData(userId: string): UserData | null {
  try {
    const data = localStorage.getItem(`fck_user_${userId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

/**
 * Save user data to localStorage
 */
export function saveUserData(userId: string, data: UserData): boolean {
  try {
    localStorage.setItem(`fck_user_${userId}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
}

/**
 * Get Mandi (Market) data - returns default data
 */
export function getMandiData(): MandiData[] {
  try {
    const storedData = localStorage.getItem('fck_mandi_db');
    if (storedData) {
      return JSON.parse(storedData);
    }
    // Default Kashmir apple data
    const defaultData: MandiData[] = [
      { id: '1', crop: 'Apple (Delicious)', market: 'Kulgam', price: '800-1100', trend: 'up' },
      { id: '2', crop: 'Apple (Kullu)', market: 'Sopore', price: '900-1250', trend: 'up' },
      { id: '3', crop: 'Apple (American)', market: 'Srinagar', price: '600-850', trend: 'down' },
      { id: '4', crop: 'Walnut', market: 'Anantnag', price: '400-600', trend: 'stable' },
      { id: '5', crop: 'Saffron', market: 'Pulwama', price: '8000-12000', trend: 'up' }
    ];
    return defaultData;
  } catch (error) {
    console.error('Error fetching mandi data:', error);
    return [];
  }
}

/**
 * Save Mandi data to localStorage
 */
export function saveMandiData(data: MandiData[]): boolean {
  try {
    localStorage.setItem('fck_mandi_db', JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving mandi data:', error);
    return false;
  }
}

/**
 * Get forum posts
 */
export function getForumPosts(): any[] {
  try {
    const data = localStorage.getItem('fck_forum_posts');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return [];
  }
}

/**
 * Save forum posts
 */
export function saveForumPosts(posts: any[]): boolean {
  try {
    localStorage.setItem('fck_forum_posts', JSON.stringify(posts));
    return true;
  } catch (error) {
    console.error('Error saving forum posts:', error);
    return false;
  }
}
