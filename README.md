# mysql-migrate-cli

Migrations tool for MYSQL db

## Install

```sh
npm i mysql-migrate-cli
```

## Usage

```sh
mysql-migrate-cli [command] [options]

options:
  --table - table name in DB to store migrations. Default is `migrations`
  --config - path to configuration file. Default is `./config.json`
  --path - path to migrations folder. Default is `./migrations`
  --count - count of applied/reverted migrations (only for `up` and 'down' commands)

commands:
  up - apply new migrations. Default command
  down - revert all migrations
  create - create migration file in migrations folder
```

Config format:
```json
{
  "development": {
    "host": "127.0.0.1",
    "user": "devUser",
    "password": "devPassword",
    "database": "testDB"
  },
  "production": {
    "host": "127.0.0.1",
    "user": "prodUser",
    "password": "prodPassword",
    "database": "prodDB"
  }
}
```
By default used `development` config. Please use NODE_ENV to switch config

### Migration file format
```javascript
module.exports = {
  up: 'ALTER TABLE my_cool_table ADD COLUMN super_column TEXT;',
  down: 'ALTER TABLE my_cool_table DROP COLUMN super_column;'
}
```
where `up` and `down` is plain SQL:
- `up` section applies migration
- `down` section revert migration

### In your `package.json`

You may have some scripts in your package.json:

```json
{
  "devDependencies": {
    "mysql-migrate-cli": "latest",
    "cross-env": "latest"
  },
  "scripts": {
    "migrations:dev": "cross-env NODE_ENV=development mysql-migrate-cli up --table migrationsDev",
    "migrations:prod": "cross-env NODE_ENV=production mysql-migrate-cli",
    "migrations:revert:dev": "mysql-migrate-cli down --count 1 --table migrationsDev",
    "migrations:revert:all": "mysql-migrate-cli down --table migrationsDev",
    "migration:create": "mysql-migrate-cli create"
  }
}
```
