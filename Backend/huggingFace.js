// englishTeacher.js
const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

// Simple template for the English teacher
const createPrompt = (question) => {
  return `You are an English teacher. Provide a helpful, clear, and concise response.
Question: ${question}
Answer:`;
};

// Main function to interact with the AI
async function getTeacherResponse(question) {
  try {
    const response = await hf.textGeneration({
      model: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B',
      inputs: createPrompt(question),
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
        top_k: 50,
        top_p: 0.95,
        do_sample: true
      }
    });

    // Extract and clean the response
    let answer = response.generated_text || '';
    
    // Remove the prompt from the response
    const promptIndex = answer.indexOf('Answer:');
    if (promptIndex !== -1) {
      answer = answer.substring(promptIndex + 7).trim();
    }

    return answer;
  } catch (error) {
    console.error('AI Error:', error);
    throw new Error('Failed to generate response');
  }
}

module.exports = { getTeacherResponse };