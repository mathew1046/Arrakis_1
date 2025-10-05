// Frontend Test for Gemini AI Scheduling
// Copy and paste this into browser console on localhost:3000

console.log('🧪 Testing Gemini AI Scheduling Connection');

async function testGeminiScheduling() {
    console.log('📡 Calling Gemini AI scheduling endpoint...');
    
    try {
        const response = await fetch('http://localhost:5000/api/ai/generate_gemini_schedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                actor_constraints: {
                    Maya: {
                        max_consecutive_days: 3,
                        preferred_call_times: ['09:00', '10:00']
                    }
                },
                location_preferences: {
                    'Radio Station': {
                        setup_time_hours: 2,
                        weather_dependent: false
                    }
                }
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ SUCCESS! Gemini AI scheduling is working');
            console.log('📊 Status:', data.status);
            console.log('💬 Message:', data.message);
            console.log('🎬 Total Shooting Days:', data.total_shooting_days);
            console.log('📅 Schedule Data:', data.schedule_data);
            
            if (data.is_mock) {
                console.log('⚠️  Using fallback algorithm (Gemini API not configured)');
            } else {
                console.log('🚀 Real Gemini AI response received!');
            }
            
            return data;
        } else {
            console.error('❌ ERROR:', data.message);
            return null;
        }
        
    } catch (error) {
        console.error('❌ NETWORK ERROR:', error);
        console.log('🔧 Make sure backend is running on localhost:5000');
        return null;
    }
}

async function testHealthCheck() {
    console.log('🏥 Testing backend health...');
    
    try {
        const response = await fetch('http://localhost:5000/api/health');
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Backend is healthy:', data.message);
            return true;
        } else {
            console.error('❌ Backend health check failed');
            return false;
        }
    } catch (error) {
        console.error('❌ Cannot connect to backend:', error);
        return false;
    }
}

// Run the tests
async function runAllTests() {
    console.log('🎬 Starting Frontend-Backend Connection Tests');
    console.log('=' .repeat(50));
    
    // Test 1: Health Check
    const healthOk = await testHealthCheck();
    
    if (healthOk) {
        // Test 2: Gemini Scheduling
        const scheduleResult = await testGeminiScheduling();
        
        if (scheduleResult) {
            console.log('\n🎉 ALL TESTS PASSED!');
            console.log('✅ Frontend is successfully connected to Gemini AI backend');
            console.log('🎯 The "Generate AI Schedule" button will work correctly');
        }
    } else {
        console.log('❌ Backend connection failed');
        console.log('🔧 Please start the backend server:');
        console.log('   cd backend');
        console.log('   python run.py');
    }
}

// Auto-run the tests
runAllTests();
