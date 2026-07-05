const fs = require('fs');

async function testUpload() {
  try {
    fs.writeFileSync('test-image.txt', 'dummy image content');
    
    const formData = new FormData();
    const file = new Blob(['dummy image content'], { type: 'text/plain' });
    // In Node.js, we can just fetch. But we need to use Node's fetch with FormData.
    formData.append('image', file, 'test-image.txt');
    formData.append('altText', 'test');
    formData.append('folder', 'library');

    const res = await fetch('http://localhost:3000/api/media', {
      method: 'POST',
      body: formData
    });
    
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (err) {
    console.error('Error:', err);
  }
}

testUpload();
