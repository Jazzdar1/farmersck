// services/puterService.ts
export const askAI = async (prompt: string, isUrdu: boolean = true) => {
    try {
        const systemPrompt = isUrdu 
            ? "Aap Farmer's Corner Kashmir ke expert hain. Roman Urdu mein jawab dein." 
            : "You are an expert agriculture consultant for Kashmir. If JSON is requested, provide ONLY raw JSON.";
            
        const response = await (window as any).puter.ai.chat(`${systemPrompt} ${prompt}`, {
            model: 'google/gemini-2.0-flash-lite-001'
        });

        let content = response.message.content;

        // Clean Markdown backticks if AI includes them
        if (content.includes('```')) {
            content = content.replace(/```json/g, '').replace(/```/g, '').trim();
        }

        return content;
    } catch (error) {
        console.error("Puter AI Error:", error);
        return null;
    }
};

export const saveUserData = async (key: string, data: any) => {
    return await (window as any).puter.kv.set(key, JSON.stringify(data));
};

export const getUserData = async (key: string) => {
    const data = await (window as any).puter.kv.get(key);
    return data ? JSON.parse(data) : null;
};