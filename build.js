import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = __dirname;
const frontendDir = path.resolve(rootDir, 'adroit-tech-frontend');
const careerDir = path.resolve(rootDir, 'adroit-tech-career');
const outputDir = path.resolve(rootDir, 'dist');
const portalOutputDir = path.resolve(outputDir, 'portal');

function build() {
  try {
    console.log('Building main website (adroit-tech-frontend)...');
    execSync('npm run build', { cwd: frontendDir, stdio: 'inherit', shell: true });

    console.log('Building career portal (adroit-tech-career)...');
    execSync('npm run build', { cwd: careerDir, stdio: 'inherit', shell: true });

    console.log('Cleaning and structuring unified root output directory...');
    
    // Clean old output directory if it exists
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
    fs.mkdirSync(outputDir, { recursive: true });

    // Copy frontend dist to root dist
    const srcFrontendDist = path.resolve(frontendDir, 'dist');
    fs.cpSync(srcFrontendDist, outputDir, { recursive: true });

    // Create portal subdirectory inside root dist
    fs.mkdirSync(portalOutputDir, { recursive: true });

    // Copy career portal dist to root dist/portal
    const srcCareerDist = path.resolve(careerDir, 'dist');
    fs.cpSync(srcCareerDist, portalOutputDir, { recursive: true });

    console.log('Combined build and merge completed successfully!');
  } catch (error) {
    console.error('Error during build compilation or merging:', error);
    process.exit(1);
  }
}

build();
