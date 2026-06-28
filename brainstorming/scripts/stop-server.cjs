const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const SESSION_DIR = process.argv[2];

if (!SESSION_DIR) {
  console.log(JSON.stringify({ error: 'Usage: node stop-server.cjs <session_dir>' }));
  process.exit(1);
}

const STATE_DIR = path.join(SESSION_DIR, 'state');
const PID_FILE = path.join(STATE_DIR, 'server.pid');

function killProcess(pid, signal) {
  if (process.platform === 'win32') {
    return new Promise((resolve) => {
      const cmd = signal === 'SIGKILL' ? 'taskkill' : 'taskkill';
      const args = signal === 'SIGKILL' ? ['/F', '/PID', String(pid)] : ['/PID', String(pid)];
      const proc = spawn(cmd, args, { stdio: 'ignore' });
      proc.on('exit', () => resolve());
    });
  } else {
    try {
      process.kill(pid, signal);
    } catch (e) {
    }
  }
}

function isProcessRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return false;
  }
}

if (fs.existsSync(PID_FILE)) {
  const pid = parseInt(fs.readFileSync(PID_FILE, 'utf-8'), 10);

  killProcess(pid, 'SIGTERM');

  let attempts = 0;
  const maxAttempts = 20;
  const checkInterval = setInterval(() => {
    attempts++;
    if (!isProcessRunning(pid)) {
      clearInterval(checkInterval);
      cleanup();
      return;
    }
    if (attempts >= maxAttempts) {
      clearInterval(checkInterval);
      killProcess(pid, 'SIGKILL');
      setTimeout(() => {
        if (isProcessRunning(pid)) {
          console.log(JSON.stringify({ status: 'failed', error: 'process still running' }));
          process.exit(1);
        } else {
          cleanup();
        }
      }, 100);
    }
  }, 100);

  function cleanup() {
    try {
      fs.unlinkSync(PID_FILE);
    } catch (e) {
    }
    try {
      fs.unlinkSync(path.join(STATE_DIR, 'server.log'));
    } catch (e) {
    }

    const tmpDir = require('os').tmpdir();
    if (SESSION_DIR.startsWith(tmpDir)) {
      try {
        fs.rmSync(SESSION_DIR, { recursive: true, force: true });
      } catch (e) {
      }
    }

    console.log(JSON.stringify({ status: 'stopped' }));
    process.exit(0);
  }
} else {
  console.log(JSON.stringify({ status: 'not_running' }));
  process.exit(0);
}