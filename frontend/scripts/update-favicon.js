const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '..');
const sourceLogo = path.join(frontendDir, 'public', 'rx-logo.png');

if (fs.existsSync(sourceLogo)) {
    fs.copyFileSync(sourceLogo, path.join(frontendDir, 'app', 'favicon.ico'));
    fs.copyFileSync(sourceLogo, path.join(frontendDir, 'public', 'favicon.ico'));
    fs.copyFileSync(sourceLogo, path.join(frontendDir, 'public', 'favicon.png'));
    console.log('Favicon updated successfully from rx-logo.png!');
} else {
    console.error('Source rx-logo.png not found at:', sourceLogo);
}
