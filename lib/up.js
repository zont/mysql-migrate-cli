const fs = require('fs');
const path = require('path');
const db = require('./db');


module.exports = async options => {
  try {
    const connection = db(options.config);
    const dir = process.cwd();

    await connection.query(`CREATE TABLE IF NOT EXISTS ${options.table} (file varchar(255) NOT NULL UNIQUE)`);

    const appliedMigrations = (await connection.query(`SELECT file FROM ${options.table};`))
      .map(row => row.file);

    const migrations = fs
      .readdirSync(options.path)
      .filter(migration => !appliedMigrations.includes(migration))
      .sort();

    if (migrations.length === 0) {
      console.log('[MIGRATIONS]: no new migrations found.');
    } else {
      if (options.count) {
        migrations.length = options.count;
      }

      for (const migration of migrations) {
        const file = require.main.require(path.join(dir, options.path, migration));

        await connection.query(`
          INSERT INTO ${options.table} (file) VALUES ('${migration}');
          ${file.up}
        `);

        console.log('[MIGRATIONS][applied]:', migration);
      };
    }

    connection.end();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
