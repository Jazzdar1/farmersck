/**
 * Puter Service - Handles Puter API interactions for data persistence
 * Puter is a cloud storage/database system used for storing farmer data
 */

const puter = (window as any).puter;

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
 * Get user data from Puter KV storage
 */
export async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const data = await puter.kv.get(`fck_user_${userId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

/**
 * Save user data to Puter KV storage
 */
export async function saveUserData(userId: string, data: UserData): Promise<boolean> {
  try {
    await puter.kv.set(`fck_user_${userId}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
}

/**
 * Get Mandi (Market) data from Puter
 */
export async function getMandiData(): Promise<MandiData[]> {
  try {
    const data = await puter.kv.get('fck_mandi_db');
    if (data) {
      return JSON.parse(data);
    }
    // Default data if none exists
    return [
      { id: '1', crop: 'Apple (Delicious)', market: 'Kulgam', price: '800-1100', trend: 'up' },
      { id: '2', crop: 'Apple (Kullu)', market: 'Sopore', price: '900-1250', trend: 'up' },
      { id: '3', crop: 'Apple (American)', market: 'Srinagar', price: '600-850', trend: 'down' }
    ];
  } catch (error) {
    console.error('Error fetching mandi data:', error);
    return [];
  }
}

/**
 * Save Mandi data to Puter (Admin only)
 */
export async function saveMandiData(data: MandiData[]): Promise<boolean> {
  try {
    await puter.kv.set('fck_mandi_db', JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving mandi data:', error);
    return false;
  }
}

/**
 * Get forum posts from Puter
 */
export async function getForumPosts(): Promise<any[]> {
  try {
    const data = await puter.kv.get('fck_forum_posts');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return [];
  }
}

/**
 * Save forum posts to Puter
 */
export async function saveForumPosts(posts: any[]): Promise<boolean> {
  try {
    await puter.kv.set('fck_forum_posts', JSON.stringify(posts));
    return true;
  } catch (error) {
    console.error('Error saving forum posts:', error);
    return false;
  }
}

/**
 * Check if Puter is available
 */
export function isPuterAvailable(): boolean {
  return typeof puter !== 'undefined' && puter !== null;
}
