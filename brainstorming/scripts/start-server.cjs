const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const SCRIPT_DIR = __dirname;

let PROJECT_DIR = '';
let FOREGROUND = false;
let FORCE_BACKGROUND = false;
let BIND_HOST = '127.0.0.1';
let URL_HOST = '';

for (let i = 2; i < process.argv.length; i++) {
  switch (process.argv[i]) {
    case '--project-dir':
      PROJECT_DIR = process.argv[++i];
      break;
    case '--host':
      BIND_HOST = process.argv[++i];
      break;
    case '--url-host':
      URL_HOST = process.argv[++i];
      break;
    case '--foreground':
    case '--no-daemon':
      FOREGROUND = true;
      break;
    case '--background':
    case '--daemon':
      FORCE_BACKGROUND = true;
      break;
    default:
      console.log(JSON.stringify({ error: 'Unknown argument: ' + process.argv[i] }));
      process.exit(1);
  }
}

if (!URL_HOST) {
  URL_HOST = (BIND_HOST === '127.0.0.1' || BIND_HOST === 'localhost') ? 'localhost' : BIND_HOST;
}

if (!FOREGROUND && !FORCE_BACKGROUND) {
  if (process.env.CODEX_CI) {
    FOREGROUND = true;
  }
  const isWindows = process.platform === 'win32';
  if (isWindows) {
    FOREGROUND = true;
  }
}

const SESSION_ID = process.pid + '-' + Date.now();
const SESSION_DIR = PROJECT_DIR
  ? path.join(PROJECT_DIR, '.superpowers', 'brainstorm', SESSION_ID)
  : path.join(require('os').tmpdir(), 'brainstorm-' + SESSION_ID);
const STATE_DIR = path.join(SESSION_DIR, 'state');
const PID_FILE = path.join(STATE_DIR, 'server.pid');
const LOG_FILE = path.join(STATE_DIR, 'server.log');

try {
  fs.mkdirSync(path.join(SESSION_DIR, 'content'), { recursive: true });
  fs.mkdirSync(STATE_DIR, { recursive: true });
} catch (e) {
  console.log(JSON.stringify({ error: 'Failed to create session directories: ' + e.message }));
  process.exit(1);
}

if (fs.existsSync(PID_FILE)) {
  try {
    const oldPid = parseInt(fs.readFileSync(PID_FILE, 'utf-8'), 10);
    process.kill(oldPid, 0);
    process.kill(oldPid, 'SIGTERM');
  } catch (e) {
  }
  fs.unlinkSync(PID_FILE);
}

let OWNER_PID = null;
if (process.platform !== 'win32') {
  try {
    const result = spawnSync('ps', ['-o', 'ppid=', '-p', process.ppid]);
    OWNER_PID = parseInt(result.stdout.toString().trim(), 10);
    if (!OWNER_PID || OWNER_PID === 1) {
      OWNER_PID = process.ppid;
    }
  } catch (e) {
    OWNER_PID = process.ppid;
  }
}

const env = {
  ...process.env,
  BRAINSTORM_DIR: SESSION_DIR,
  BRAINSTORM_HOST: BIND_HOST,
  BRAINSTORM_URL_HOST: URL_HOST
};
if (OWNER_PID) {
  env.BRAINSTORM_OWNER_PID = String(OWNER_PID);
}

if (FOREGROUND) {
  fs.writeFileSync(PID_FILE, String(process.pid));
  const server = spawn('node', [path.join(SCRIPT_DIR, 'server.cjs')], { env, stdio: 'inherit' });
  server.on('exit', (code) => process.exit(code || 0));
} else {
  const server = spawn('node', [path.join(SCRIPT_DIR, 'server.cjs')], {
    env,
    stdio: ['ignore', fs.openSync(LOG_FILE, 'w'), fs.openSync(LOG_FILE, 'w')],
    detached: true
  });
  server.unref();
  fs.writeFileSync(PID_FILE, String(server.pid));

  let attempts = 0;
  const maxAttempts = 50;
  const interval = setInterval(() => {
    attempts++;
    try {
      const logContent = fs.readFileSync(LOG_FILE, 'utf-8');
      const match = logContent.match(/"server-started"/);
      if (match) {
        clearInterval(interval);
        let alive = true;
        let checkAttempts = 0;
        const aliveCheck = setInterval(() => {
          checkAttempts++;
          try {
            process.kill(server.pid, 0);
          } catch (e) {
            alive = false;
          }
          if (checkAttempts >= 20 || !alive) {
            clearInterval(aliveCheck);
            if (!alive) {
              console.log(JSON.stringify({
                error: 'Server started but was killed. Retry with: node ' +
                  path.join(SCRIPT_DIR, 'start-server.cjs') +
                  (PROJECT_DIR ? ' --project-dir ' + PROJECT_DIR : '') +
                  ' --host ' + BIND_HOST + ' --url-host ' + URL_HOST + ' --foreground'
              }));
              process.exit(1);
            } else {
              const lines = logContent.split('\n');
              for (const line of lines) {
                if (line.includes('server-started')) {
                  console.log(line);
                  break;
                }
              }
              process.exit(0);
            }
          }
        }, 100);
      }
    } catch (e) {
    }
    if (attempts >= maxAttempts) {
      clearInterval(interval);
      console.log(JSON.stringify({ error: 'Server failed to start within 5 seconds' }));
      process.exit(1);
    }
  }, 100);
}