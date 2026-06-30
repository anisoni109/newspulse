import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  magenta: '\x1b[35m'
};

const processes = [];

function startProcess(name, command, args, cwd, color) {
  console.log(`${colors.magenta}[Runner] Starting ${name}${cwd ? ` in ${cwd}` : ''}...${colors.reset}`);
  
  const proc = spawn(command, args, { cwd, shell: true });
  processes.push({ name, proc });

  proc.stdout.on('data', (data) => {
    const text = data.toString().trim();
    if (text) {
      text.split('\n').forEach(line => {
        console.log(`${color}[${name}]${colors.reset} ${line}`);
      });
    }
  });

  proc.stderr.on('data', (data) => {
    const text = data.toString().trim();
    if (text) {
      text.split('\n').forEach(line => {
        console.error(`${colors.red}[${name} Error]${colors.reset} ${line}`);
      });
    }
  });

  proc.on('close', (code) => {
    console.log(`${colors.magenta}[Runner] ${name} exited with code ${code}${colors.reset}`);
    cleanupAndExit();
  });

  proc.on('error', (err) => {
    console.error(`${colors.red}[Runner] Failed to start ${name}: ${err.message}${colors.reset}`);
  });
}

function cleanupAndExit() {
  console.log(`${colors.magenta}[Runner] Shutting down all services...${colors.reset}`);
  processes.forEach(({ name, proc }) => {
    if (proc.pid) {
      try {
        console.log(`Killing ${name} (PID: ${proc.pid})`);
        proc.kill('SIGINT');
      } catch (e) {}
    }
  });
  process.exit();
}

process.on('SIGINT', cleanupAndExit);
process.on('SIGTERM', cleanupAndExit);

// 1. Start NewsPulse Server (Port 3000) — Backend API & DB
startProcess(
  'NewsPulse Server',
  'node',
  ['server.js'],
  path.join(__dirname, 'server'),
  colors.green
);

// 2. Start NewsPulse Mobile Feed App (Port 5173 / Vite) — Main frontend
startProcess(
  'NewsPulse App',
  'npx',
  ['vite'],
  __dirname,
  colors.blue
);

// 3. Start MonitorDashboard (Port 3002 / Vite) — Admin interface from its own repo
startProcess(
  'MonitorDashboard',
  'npx',
  ['vite'],
  'C:/Users/aniso/MonitorDashboard',
  colors.yellow
);