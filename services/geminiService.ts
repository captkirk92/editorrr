import { GoogleGenAI, Modality } from "@google/genai";
import { toBase64 } from "../utils/fileUtils";

const model = 'gemini-2.5-flash-image-preview';

// Lazily get the AI client to avoid crashing on load if API key is missing
function getAiClient() {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        // This error will be caught by the try/catch block in the EditTab component
        throw new Error("API_KEY environment variable not set.");
    }
    return new GoogleGenAI({ apiKey: API_KEY });
}


async function generateImageFromPrompt(file: File, prompt: string): Promise<string> {
    const ai = getAiClient(); // Initialize client only when needed
    const { base64, mimeType } = await toBase64(file);

    const response = await ai.models.generateContent({
        model,
        contents: {
            parts: [
                { inlineData: { data: base64, mimeType } },
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }

    throw new Error("AI could not generate a valid image response.");
}

export const removeBackground = async (file: File): Promise<string> => {
    return generateImageFromPrompt(
        file,
        'Remove the background from this image completely. Make the background transparent. Return only the main subject with a transparent background.'
    );
};

export const createPortrait = async (file: File): Promise<string> => {
    return generateImageFromPrompt(
        file,
        'Transform this photo into a stylized, artistic portrait suitable for a sticker. Focus on the main subject. The background should be transparent.'
    );
};