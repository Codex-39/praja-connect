const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testUpload() {
  try {
    // 1. Login to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com', // Need a valid user
      password: 'password123'
    }).catch(e => {
      // Just register if login fails
      return axios.post('http://localhost:5000/api/auth/register', {
        name: 'Test User',
        email: 'test' + Date.now() + '@example.com',
        password: 'password123',
        mobile: '1234567890',
        address: '123 Test St'
      });
    });

    const token = loginRes.data.token;
    console.log('Got token:', token);

    // 2. Submit complaint with image as base64 string
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
      image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AL+AD//Z'
    };

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

testUpload();
