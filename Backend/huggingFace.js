const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

// تهيئة Hugging Face API
const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

// دالة إنشاء الموجه لتحفيز الذكاء الاصطناعي على تقديم إجابة مباشرة
const createPrompt = (question) => {
  return `
You are ZombozoAI, an interactive and fun English teacher. Answer the question in a clear, engaging way without unnecessary introductions.
---
Question: ${question}
Response:`;
};

// تنظيف الرد من أي عبارات تعريفية أو مكررة
const cleanResponse = (responseText) => {
  if (!responseText) return "Hmm, I couldn't generate a response this time. Try again! 😊";

  // إزالة أي مقدمة غير مرغوبة
  responseText = responseText.replace(/I'm .*?ZombozoAI.*?\./g, '').trim();
  responseText = responseText.replace(/<\/think>/g, '').trim();

  // البحث عن بداية الإجابة الفعلية
  const promptIndex = responseText.indexOf('Response:');
  if (promptIndex !== -1) {
    responseText = responseText.substring(promptIndex + 9).trim();
  }

  // إزالة أي تكرار غريب
  const sentences = responseText.split('. ');
  responseText = sentences.filter((sentence, index) => sentences.indexOf(sentence) === index).join('. ');

  return responseText || "That’s a tricky one! Could you rephrase your question? 😃";
};

// الوظيفة الرئيسية للحصول على استجابة المعلم ZombozoAI
async function getTeacherResponse(question) {
  try {
    const response = await hf.textGeneration({
      model: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B',
      inputs: createPrompt(question),
      parameters: {
        max_new_tokens: 200,
        temperature: 0.5, // تقليل العشوائية لمنع التكرار
        repetition_penalty: 1.2, // تقليل التكرار في الإجابات
        top_k: 40,
        top_p: 0.9,
        do_sample: true
      }
    });

    return cleanResponse(response.generated_text);
  } catch (error) {
    console.error('AI Error:', error);
    return "Oops! Something went wrong. Try asking me again. 🤖";
  }
}

module.exports = { getTeacherResponse };