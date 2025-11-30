import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { ImageAspectRatio, ImageSize } from "../types";

// Ensure API key is available
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing via process.env.API_KEY");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// --- Text & Multimodal ---

export const generateScholarResponse = async (
  prompt: string,
  model: string,
  systemInstruction: string,
  useSearch: boolean = false,
  useThinking: boolean = false,
  images?: { inlineData: { data: string; mimeType: string } }[]
) => {
  const config: any = {
    systemInstruction,
  };

  if (useSearch) {
    config.tools = [{ googleSearch: {} }];
  }

  if (useThinking && model.includes('gemini-3-pro')) {
    // 32k is max for pro
    config.thinkingConfig = { thinkingBudget: 32768 }; 
  }

  try {
    const contents: any = { parts: [] };
    
    // Add images if present
    if (images && images.length > 0) {
       images.forEach(img => contents.parts.push(img));
    }
    
    // Add text prompt
    contents.parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model,
      contents: images ? contents : prompt, // If images exist use object structure, else string is fine usually but let's be safe
      config,
    });
    return response;
  } catch (error) {
    console.error("Error generating scholar response:", error);
    throw error;
  }
};

export const generateStreamResponse = async (
    prompt: string,
    model: string,
    systemInstruction?: string
) => {
    try {
        const responseStream = await ai.models.generateContentStream({
            model,
            contents: prompt,
            config: { systemInstruction }
        });
        return responseStream;
    } catch (error) {
        console.error("Error generating stream:", error);
        throw error;
    }
}

// --- Image Generation ---

export const generateImage = async (
  prompt: string,
  aspectRatio: ImageAspectRatio,
  size: ImageSize
) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: size
        }
      }
    });
    return response;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

// --- Vision / Analysis ---

export const analyzeMedia = async (
  prompt: string,
  mimeType: string,
  base64Data: string,
  model: string = 'gemini-3-pro-preview'
) => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data
            }
          },
          { text: prompt }
        ]
      }
    });
    return response;
  } catch (error) {
    console.error("Error analyzing media:", error);
    throw error;
  }
};

// --- Audio Transcription ---

export const transcribeAudio = async (base64Audio: string, mimeType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Audio
            }
          },
          { text: "Transcribe this audio strictly word for word." }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
};

// --- Text to Speech ---

export const generateSpeech = async (text: string) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, // Authoritative yet calm
                    },
                },
            },
        });
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } catch (error) {
        console.error("TTS Error:", error);
        throw error;
    }
}


// --- Live API Helpers ---

// Helper to decode base64
export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to encode ArrayBuffer to base64
export function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function createPcmBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export const connectLiveSession = async (
    callbacks: {
        onopen: () => void;
        onmessage: (msg: LiveServerMessage) => void;
        onclose: (e: CloseEvent) => void;
        onerror: (e: ErrorEvent) => void;
    },
    systemInstruction: string
) => {
    return await ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks,
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } // Gentle voice
            },
            systemInstruction
        }
    });
}