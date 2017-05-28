const fs = require('fs');
const path = require('path');


module.exports = options => {
  const name = `${Date.now()}-migration.js`;
  const data = 'module.exports = {\n  up: ``,\n  down: ``\n};\n';

  if (!fs.existsSync(options.path)) {
    fs.mkdirSync(options.path);
  }

  fs.writeFileSync(path.join(options.path, name), data);

  console.log('[MIGRATIONS][created]:', path.join(options.path, name));
};
