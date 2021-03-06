const { propEq } = require('ramda');

const { Transaction } = require('../../../types');

const getByIdPreset = require('../../presets/pg/getById');
const mgetByIdsPreset = require('../../presets/pg/mgetByIds');
const { inputGet } = require('../../presets/pg/getById/inputSchema');
const { inputMget } = require('../../presets/pg/mgetByIds/inputSchema');
const searchWithPaginationPreset = require('../../presets/pg/searchWithPagination');

const transformTxInfo = require('./transformTxInfo');

const sql = require('./sql');

const { result, inputSearch } = require('./schema');

module.exports = ({ drivers: { pg }, emitEvent }) => {
  return {
    get: getByIdPreset({
      name: 'transactions.massTransfer.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema: result,
      resultTypeFactory: Transaction,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    mget: mgetByIdsPreset({
      name: 'transactions.massTransfer.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      inputSchema: inputMget,
      resultTypeFactory: Transaction,
      resultSchema: result,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    search: searchWithPaginationPreset({
      name: 'transactions.massTransfer.search',
      sql: sql.search,
      inputSchema: inputSearch,
      resultSchema: result,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),
  };
};
