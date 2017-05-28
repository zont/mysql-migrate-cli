const path = require('path');
const mysql = require('mysql');


module.exports = configPath => {
  const dir = process.cwd();
  const config = require.main.require(path.join(dir, configPath))[process.env.NODE_ENV || 'development'];
  const connection = mysql.createConnection(Object.assign({multipleStatements: true}, config));

  const query = query => new Promise((resolve, reject) => {
    connection.beginTransaction(error => {
      if (error) {
        reject(error);
      } else {
        connection.query(query, (error, result) => {
          if (error) {
            connection.rollback(() => reject(error));
          } else {
            connection.commit(error => {
              if (error) {
                connection.rollback(() => reject(error));
              } else {
                resolve(result);
              }
            });
          }
        });
      }
    });
  });

  return {
    query,
    end () {
      connection.end();
    }
  };
};
