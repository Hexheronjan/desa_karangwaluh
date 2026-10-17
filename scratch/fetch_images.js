const https = require('https');
const fs = require('fs');
const path = require('path');

const searchUrl = 'https://www.google.com/search?q=Balai+Desa+Karangwaluh+Ponorogo&tbm=isch&udm=2';

https.get(searchUrl, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  }
}, (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    // Look for encrypted-tbn0.gstatic.com
    const matches = html.match(/https:\/\/encrypted-tbn0\.gstatic\.com\/images\?q=tbn:[a-zA-Z0-9_\-]+/g) || [];
    const unique = [...new Set(matches)];
    console.log('Unique thumbnail URLs found:', unique.length);

    // Also look for full resolution images if any
    const imgUrls = html.match(/https:\/\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi) || [];
    console.log('Direct image URLs found:', imgUrls.length);

    // Download first 6 images to public/images/desa/
    const outDir = path.join(__dirname, '..', 'public', 'images', 'desa');
    let count = 0;
    unique.slice(0, 8).forEach((url, i) => {
      const dest = path.join(outDir, `desa-foto-${i + 1}.jpg`);
      https.get(url, (imgRes) => {
        const fileStream = fs.createWriteStream(dest);
        imgRes.pipe(fileStream);
        fileStream.on('finish', () => {
          console.log(`Saved: desa-foto-${i + 1}.jpg`);
        });
      });
    });
  });
});
