const path = require('path');
const mysql = require('mysql');


module.exports = configPath => {
  const dir = process.cwd();
  const config = require.main.require(path.join(dir, configPath))[process.env.NODE_ENV || 'development'];
  const connection = mysql.createConnection(Object.assign({multipleStatements: true}, config));

  const transaction = query => new Promise((resolve, reject) => {
    query = `
      DROP PROCEDURE IF EXISTS sp_fail;

      CREATE PROCEDURE sp_fail()
      BEGIN
        DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
        START TRANSACTION;
        ${query};
        COMMIT;
      END;

      CALL sp_fail();

      DROP PROCEDURE sp_fail;
    `.replace(/;\n*\s*;|;\r*\n*\s*;/gm, ';');

    connection.query(query, (error, result) => {
      if (error) {
        connection.query('ROLLBACK;', (err, result) => {
          reject(err || error);
        });
      } else {
        connection.query('COMMIT;', (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      }
    });
  });

  return {
    transaction,
    query (query) {
      return new Promise((resolve, reject) => {
        connection.query(query, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    },
    end () {
      connection.end();
    }
  };
};
