require('dotenv').config();
const jwt = require('jsonwebtoken');

const token = jwt.sign({ userId: 'dummy-id', email: 'hari@roomio.app' }, process.env.JWT_SECRET, { expiresIn: '1h' });
console.log('Token:', token);

const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const mimeType = "image/png";

async function testLiveApi() {
  const url = "https://fairflat-backend.onrender.com/api/bot/scan";
  console.log('Sending request to', url);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ base64Image, mimeType })
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch(e) {
    console.error('Fetch error:', e.message);
  }
}
testLiveApi();
