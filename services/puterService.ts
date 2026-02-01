// services/puterService.ts
export const askAI = async (prompt: string, isUrdu: boolean = true) => {
    try {
        // Puter AI system instruction for consistent responses
        const systemPrompt = isUrdu 
            ? "Aap Farmer's Corner Kashmir ke expert hain. Sirf Urdu (Urdu script) mein jawab dein." 
            : "You are an expert agriculture consultant for Kashmir. If JSON is requested, provide ONLY raw JSON.";
            
        // Using Gemini 2.0 Flash Lite via Puter (No API Key Required)
        const response = await (window as any).puter.ai.chat(`${systemPrompt} ${prompt}`, {
            model: 'google/gemini-2.0-flash-lite-001'
        });

        let content = response.message.content;

        // Clean Markdown formatting for JSON parsing
        if (content.includes('```')) {
            content = content.replace(/```json/g, '').replace(/```/g, '').trim();
        }

        return content;
    } catch (error) {
        console.error("Puter AI Error:", error);
        return null;
    }
};

// Cloud KV Storage helper
export const saveUserData = async (key: string, data: any) => {
    return await (window as any).puter.kv.set(key, JSON.stringify(data));
};

export const getUserData = async (key: string) => {
    const data = await (window as any).puter.kv.get(key);
    return data ? JSON.parse(data) : null;
};