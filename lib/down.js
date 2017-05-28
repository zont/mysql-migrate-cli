const path = require('path');
const db = require('./db');


module.exports = async options => {
  try {
    const connection = db(options.config);
    const dir = process.cwd();

    await connection.query(`CREATE TABLE IF NOT EXISTS ${options.table} (file varchar(255) NOT NULL UNIQUE)`);

    const appliedMigrations = (await connection.query(`SELECT file FROM ${options.table};`))
      .map(row => row.file)
      .reverse();

    if (appliedMigrations.length === 0) {
      console.log('[MIGRATIONS]: no migrations found.');
    } else {
      if (options.count) {
        appliedMigrations.length = options.count;
      }

      for (const migration of appliedMigrations) {
        const file = require.main.require(path.join(dir, options.path, migration));

        await connection.query(`
          DELETE FROM ${options.table} WHERE file = '${migration}';
          ${file.down}
        `);

        console.log('[MIGRATIONS][reverted]:', migration);
      };
    }

    connection.end();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
