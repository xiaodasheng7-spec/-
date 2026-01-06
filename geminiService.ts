
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, ConstitutionType } from "./types";

export const analyzeFace = async (imageBase64: string): Promise<AIAnalysisResult> => {
  // 从系统注入的变量中读取密码
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "") {
    throw new Error("检测到密码（API_KEY）未生效。请检查 Vercel 后台环境变量设置并点击 Redeploy。");
  }

  // 每次调用时初始化 AI 引擎
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `你是一位专业的中医体质辨识专家。请通过这张面部照片，分析用户的皮肤光泽、面色（偏黄、白、红、晦暗）、眼神神采、口唇颜色、是否有油腻感或痘痘等特征。
根据这些视觉特征，从九种中医体质（平和质、气虚质、阳虚质、阴虚质、痰湿质、湿热质、血瘀质、气郁质、特禀质）中选出最匹配的一种。
请给出分析原因和识别到的关键面部特征。请直接返回 JSON 格式结果。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // 使用速度更快的 Flash 模型
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
            constitution: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            keyFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["constitution", "confidence", "reasoning", "keyFeatures"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI 思考得太累了，没给出答案，请换个角度重拍。");
    
    const result = JSON.parse(text);
    const validTypes = Object.values(ConstitutionType);
    const matchedType = validTypes.find(t => result.constitution.includes(t)) || ConstitutionType.PEACEFUL;
    
    return {
      ...result,
      constitution: matchedType
    };
  } catch (error: any) {
    console.error("AI识别详情:", error);
    throw new Error(error.message || "面部识别失败，请检查网络或稍后再试。");
  }
};
