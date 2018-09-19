const { Transaction } = require('../../../../types');

const { compose, map } = require('ramda');

const txOrNull = maybeTx =>
  maybeTx.matchWith({
    Just: ({ value }) => Transaction(value),
    Nothing: () => null,
  });

/** transformResults :: Maybe RawTxInfo -> Transaction | null */
const transformResults = transformTxInfo =>
  compose(
    txOrNull,
    map(transformTxInfo)
  );

module.exports = transformResults;