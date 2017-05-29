const fs = require('fs');
const path = require('path');

module.exports = options => {
  const name = `${Date.now()}-migration.js`;
  const data = 'module.exports = {\n  up: ``,\n  down: ``\n};\n';
  const dir = process.cwd();

  if (!fs.existsSync(path.join(dir, options.path))) {
    fs.mkdirSync(path.join(dir, options.path));
  }

  fs.writeFileSync(path.join(dir, options.path, name), data);

  console.log('[MIGRATIONS][created]:', path.join(options.path, name));
};
