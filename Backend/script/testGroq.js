import { generateAIText } from '../config/GroqSetup.js';

const testGroq = async () => {
  try {
    console.log('🧪 Testing Groq Setup...\n');

    // Test 1: Basic text generation
    console.log('📝 Test 1: Text Generation');
    const response1 = await generateAIText('What is Node.js in one sentence?');
    console.log('✅ Response:', response1);
    console.log('\n---\n');

    // Test 2: Structured response
    console.log('📝 Test 2: Structured Response');
    const response2 = await generateAIText(
      'Name 3 popular JavaScript frameworks in a comma-separated list. No extra explanation.'
    );
    console.log('✅ Response:', response2);
    console.log('\n---\n');

    console.log('✨ All Groq tests complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testGroq();
