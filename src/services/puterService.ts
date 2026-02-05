import { DiseaseAnalysis } from '../types';

// ⚡ FAST AI SERVICE (Using GPT-4o-Mini for Speed)
export const askAI = async (prompt: string, isUrdu: boolean = true) => {
    try {
        const systemPrompt = isUrdu 
            ? "You are an expert agriculture consultant for Kashmir named 'Maher'. Reply in short, clear Urdu (Urdu script). Keep answers under 3 lines for speed." 
            : "You are an expert agriculture consultant for Kashmir. Keep answers short and concise.";
            
        // Using 'gpt-4o-mini' because it is much faster than Gemini for text
        const response = await (window as any).puter.ai.chat(`${systemPrompt} ${prompt}`, {
            model: 'gpt-4o-mini' 
        });

        let content = response.message.content;
        
        // Cleanup formatting if any
        if (content.includes('```')) {
            content = content.replace(/```json/g, '').replace(/```/g, '').trim();
        }

        return content;
    } catch (error) {
        console.error("Puter AI Error:", error);
        return "Network slow hai, dobara puchein.";
    }
};

// Cloud KV Storage
export const saveUserData = async (key: string, data: any) => {
    return await (window as any).puter.kv.set(key, JSON.stringify(data));
};

export const getUserData = async (key: string) => {
    const data = await (window as any).puter.kv.get(key);
    return data ? JSON.parse(data) : null;
};

// 🍂 DISEASE ANALYSIS (Optimized)
export const analyzeCropDisease = async (imageBase64: string, lang: string = 'en'): Promise<DiseaseAnalysis> => {
    return new Promise((resolve) => {
        // Faster Simulation (1.5s instead of 3s)
        setTimeout(() => {
            const diseases: DiseaseAnalysis[] = [
                {
                    diseaseName: "Apple Scab (Venturia inaequalis)",
                    severity: "High",
                    description: "Olive-green spots on leaves. Common in high humidity.",
                    treatment: [
                        "Spray Captan 50 WP (0.3%).",
                        "Apply Difenoconazole 25 EC."
                    ]
                },
                {
                    diseaseName: "Alternaria Leaf Blotch",
                    severity: "Medium",
                    description: "Brown spots with yellow halos on leaves.",
                    treatment: [
                        "Spray Mancozeb 75 WP.",
                        "Clean fallen leaves."
                    ]
                },
                {
                    diseaseName: "San Jose Scale",
                    severity: "Low",
                    description: "Red spots on fruit, scales on bark.",
                    treatment: [
                        "Apply Horticulture Mineral Oil (HMO).",
                        "Scrub loose bark."
                    ]
                }
            ];
            const result = diseases[Math.floor(Math.random() * diseases.length)];
            resolve(result);
        }, 1500); // Reduced delay for snappy feel
    });
};