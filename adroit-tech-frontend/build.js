import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendDir = __dirname;
const careerDir = path.resolve(frontendDir, '../adroit-tech-career');
const outputDir = path.resolve(frontendDir, 'dist');
const portalOutputDir = path.resolve(outputDir, 'portal');

function build() {
  try {
    console.log('Building main website (adroit-tech-frontend)...');
    execSync('npx vite build', { cwd: frontendDir, stdio: 'inherit', shell: true });

    console.log('Building career portal (adroit-tech-career)...');
    execSync('npm run build', { cwd: careerDir, stdio: 'inherit', shell: true });

    console.log('Nesting career portal build into main website build at /portal...');
    
    // Create portal directory if it doesn't exist
    if (!fs.existsSync(portalOutputDir)) {
      fs.mkdirSync(portalOutputDir, { recursive: true });
    }

    // Copy directory recursively using Node native cpSync
    const srcDist = path.resolve(careerDir, 'dist');
    fs.cpSync(srcDist, portalOutputDir, { recursive: true });

    console.log('Build and merge completed successfully!');
  } catch (error) {
    console.error('Error during build compilation or merging:', error);
    process.exit(1);
  }
}

build();
