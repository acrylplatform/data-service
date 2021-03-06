const checkEnv = require('check-env');

const { memoizeWith, always } = require('ramda');

const loadConfig = () => {
  // assert all necessary env vars are set
  checkEnv(['PGHOST', 'PGDATABASE', 'PGUSER', 'PGPASSWORD']);

  return {
    postgresHost: process.env.PGHOST,
    postgresPort: parseInt(process.env.PGPORT) || 5432,
    postgresDatabase: process.env.PGDATABASE,
    postgresUser: process.env.PGUSER,
    postgresPassword: process.env.PGPASSWORD,
    postgresPoolSize: parseInt(process.env.PGPOOLSIZE) || 20,

    logLevel: process.env.LOG_LEVEL || 'info',

    candlesUpdateInterval: process.env.CANDLES_UPDATE_INTERVAL || 2500,
    candlesUpdateTimeout: process.env.CANDLES_UPDATE_TIMEOUT || 20000,
    candlesTruncateTable: process.env.RECALCULATE_ALL_CANDLES_ON_START || true,
    candlesTableName: process.env.CANDLES_TABLE_NAME || 'candles',
  };
};

module.exports = memoizeWith(always('config'), loadConfig);
