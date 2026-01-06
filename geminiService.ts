
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, ConstitutionType } from "./types";

export const analyzeFace = async (imageBase64: string): Promise<AIAnalysisResult> => {
  // 直接使用由 Vite 注入的 process.env.API_KEY
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API KEY 未配置，请在 Vercel 环境变量中设置 API_KEY");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `你是一位专业的中医体质辨识专家。请通过这张面部照片，分析用户的皮肤光泽、面色（偏黄、白、红、晦暗）、眼神神采、口唇颜色、是否有油腻感或痘痘等特征。
根据这些视觉特征，从九种中医体质（平和质、气虚质、阳虚质、阴虚质、痰湿质、湿热质、血瘀质、气郁质、特禀质）中选出最匹配的一种。
请给出分析原因和识别到的关键面部特征。请直接返回 JSON 格式结果。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            constitution: {
              type: Type.STRING,
              description: "识别出的中医体质名称"
            },
            confidence: {
              type: Type.NUMBER,
              description: "置信度 (0-1)"
            },
            reasoning: {
              type: Type.STRING,
              description: "分析逻辑描述"
            },
            keyFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "识别出的面部视觉特征列表"
            }
          },
          required: ["constitution", "confidence", "reasoning", "keyFeatures"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI 未返回有效数据");
    
    const result = JSON.parse(text);
    
    const validTypes = Object.values(ConstitutionType);
    const matchedType = validTypes.find(t => result.constitution.includes(t)) || ConstitutionType.PEACEFUL;
    
    return {
      ...result,
      constitution: matchedType
    };
  } catch (error) {
    console.error("AI Analysis failed:", error);
    throw new Error("面部识别分析失败，请稍后重试。");
  }
};
