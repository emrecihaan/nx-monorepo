const { execSync } = require('child_process');

try {
  // Execute webpack-cli directly, ignoring any extra args like --no-verbose
  execSync('npx webpack-cli serve --node-env=development --port=4217', { 
    stdio: 'inherit',
    cwd: __dirname
  });
} catch (e) {
  process.exit(1);
}
