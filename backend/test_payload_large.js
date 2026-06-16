const axios = require('axios');

async function testLargePayload() {
  try {
    // 1. Login to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'password123'
    }).catch(e => axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User', email: 'test' + Date.now() + '@example.com', password: 'password123', mobile: '1234567890', address: '123 Test St'
    }));
    
    const token = loginRes.data.token;

    // 2. Create a dummy large base64 string (~3MB)
    const largeBase64 = 'data:image/jpeg;base64,' + 'A'.repeat(4000000);

    const payload = {
      citizenName: 'Test JSON',
      mobileNumber: '1234567890',
      colonyName: 'Test Colony',
      streetName: 'Test Street',
      wardNumber: '1',
      issueTitle: 'Test Issue JSON',
      issueDescription: 'Test Description JSON',
      category: 'Potholes',
      priority: 'Low',
      pincode: '123456',
      image: largeBase64
    };

    console.log('Sending payload, size:', JSON.stringify(payload).length);

    const res = await axios.post('http://localhost:5000/api/complaints', payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Success:', res.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testLargePayload();
