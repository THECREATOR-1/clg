import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Crisp Crisis & Emergency shield SVG
const standardSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef4444"/>
      <stop offset="50%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#991b1b"/>
    </linearGradient>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#ef4444" flood-opacity="0.5"/>
    </filter>
  </defs>
  
  <!-- Rounded Background -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  
  <!-- Outer glowing shield contour -->
  <path d="M 256 56 C 360 84 420 120 420 228 C 420 336 330 412 256 456 C 182 412 92 336 92 228 C 92 120 152 84 256 56 Z" 
        fill="none" stroke="rgba(239,68,68,0.3)" stroke-width="12"/>

  <!-- Shield Body -->
  <path d="M 256 76 C 348 102 398 136 398 232 C 398 326 318 394 256 432 C 194 394 114 326 114 232 C 114 136 164 102 256 76 Z" 
        fill="url(#shieldGrad)" filter="url(#glow)"/>

  <!-- Pulse / Cross Emergency Emblem -->
  <!-- Cross Center -->
  <path d="M 230 160 H 282 V 226 H 348 V 278 H 282 V 344 H 230 V 278 H 164 V 226 H 230 Z" 
        fill="#ffffff" rx="12"/>
        
  <!-- Heartbeat / Radar line in golden glow -->
  <path d="M 180 252 L 220 252 L 238 214 L 260 294 L 278 236 L 292 252 L 332 252" 
        fill="none" stroke="url(#glowGrad)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Beacon Pulse circles -->
  <circle cx="256" cy="252" r="14" fill="#ffffff"/>
  <circle cx="256" cy="252" r="6" fill="#ef4444"/>
</svg>
`;

// Maskable version with 20% safe zone padding
const maskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="shieldGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef4444"/>
      <stop offset="50%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#991b1b"/>
    </linearGradient>
    <linearGradient id="glowGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
  </defs>
  
  <!-- Full Bleed Background for Safe Zone -->
  <rect width="512" height="512" fill="url(#bgGradM)"/>
  
  <g transform="translate(64, 64) scale(0.75)">
    <!-- Shield Body with safe margin -->
    <path d="M 256 76 C 348 102 398 136 398 232 C 398 326 318 394 256 432 C 194 394 114 326 114 232 C 114 136 164 102 256 76 Z" 
          fill="url(#shieldGradM)"/>

    <path d="M 230 160 H 282 V 226 H 348 V 278 H 282 V 344 H 230 V 278 H 164 V 226 H 230 Z" 
          fill="#ffffff"/>
          
    <path d="M 180 252 L 220 252 L 238 214 L 260 294 L 278 236 L 292 252 L 332 252" 
          fill="none" stroke="url(#glowGradM)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>

    <circle cx="256" cy="252" r="14" fill="#ffffff"/>
    <circle cx="256" cy="252" r="6" fill="#ef4444"/>
  </g>
</svg>
`;

async function buildIcons() {
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg.trim());

  await sharp(Buffer.from(standardSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  await sharp(Buffer.from(standardSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  await sharp(Buffer.from(standardSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  await sharp(Buffer.from(standardSvg))
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));

  console.log('Successfully generated all PWA icons!');
}

buildIcons().catch(err => {
  console.error(err);
  process.exit(1);
});
