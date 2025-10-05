// Debug utility for API calls
export const debugApiCall = async (url: string, options: RequestInit = {}) => {
  console.log('🔍 Debug API Call:', url);
  console.log('🔍 Options:', options);
  
  try {
    const response = await fetch(url, options);
    console.log('🔍 Response Status:', response.status);
    console.log('🔍 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('🔍 Response Data:', data);
    
    return { response, data };
  } catch (error) {
    console.error('🔍 API Call Error:', error);
    throw error;
  }
};

// Test the Gemini endpoint directly
export const testGeminiEndpoint = async () => {
  const url = 'http://localhost:5000/api/ai/generate_gemini_schedule';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      actor_constraints: {
        Maya: {
          max_consecutive_days: 3
        }
      }
    })
  };
  
  return await debugApiCall(url, options);
};
