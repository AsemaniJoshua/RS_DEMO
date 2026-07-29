const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const iconsDir = path.join(publicDir, 'icons');
const sourceLogo = path.join(publicDir, 'rx-logo.png');

if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

if (fs.existsSync(sourceLogo)) {
    fs.copyFileSync(sourceLogo, path.join(iconsDir, 'icon-192x192.png'));
    fs.copyFileSync(sourceLogo, path.join(iconsDir, 'icon-512x512.png'));
    fs.copyFileSync(sourceLogo, path.join(publicDir, 'apple-touch-icon.png'));
    console.log('PWA icons copied successfully from rx-logo.png!');
} else {
    console.error('Source rx-logo.png not found');
}
