// services/news.ts
export const fetchNewsTicker = async (category: 'kashmir' | 'sports' | 'latest') => {
  try {
    const prompt = `Give me 5 brief news headlines for ${category} in Kashmir. Format as short sentences separated by ' • '.`;
    
    // Puter AI provides a free alternative that won't hit your personal quota
    const response = await (window as any).puter.ai.chat(prompt);
    
    // Safety check for undefined text
    const text = response.message.content || "Live news feed updating...";
    return text.replace(/\n/g, ' ').trim();
  } catch (e: any) {
    return "News feed temporarily busy. Retrying soon...";
  }
};