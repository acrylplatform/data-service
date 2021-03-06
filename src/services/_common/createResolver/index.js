const Task = require('folktale/concurrency/task');
const Result = require('folktale/result');

const { compose, chain, map, always, identity, traverse } = require('ramda');
// @hack because of ramda 'tap' not working with null values
// https://github.com/ramda/ramda/issues/2421
// @todo refactor after ramda fix
const tap = require('../../../utils/tap');

const { resultToTask, liftInnerMaybe } = require('../../../utils/fp');

/** chainRT :: (a -> Result b c) -> Task a d -> Task b c */
const chainRT = f =>
  compose(
    chain(resultToTask),
    map(f)
  );

/** createResolver :: Boolean ->
 *    Dependencies -> RuntimeOptions ->
 *    Request -> Task AppError Result */
const createResolver = applyToResult => {
  return ({
    validateInput,
    validateResult,
    transformResult,
    transformInput = identity,
    dbQuery, // db -> Request -> Task AppError (Maybe DbResult)
  }) => ({ db, emitEvent = always(identity) }) => request =>
    compose(
      map(tap(emitEvent('TRANSFORM_RESULT_OK'))),
      map(result => transformResult(result, request)), // Task AppError Result
      map(tap(emitEvent('RESULT_VALIDATION_OK'))),
      chainRT(applyToResult(validateResult)), // Task AppError Maybe DbResult
      map(tap(emitEvent('DB_QUERY_OK'))),
      chain(dbQuery(db)), // Task AppError Maybe DbResult
      map(tap(emitEvent('TRANSFORM_INPUT_OK'))),
      map(transformInput),
      map(tap(emitEvent('INPUT_VALIDATION_OK'))),
      chainRT(validateInput), // Task AppError Request
      Task.of // Task * Request
    )(request);
};

// fn :: x -> Result err y
const applyToGetResult = fn => liftInnerMaybe(Result.of, fn);
const applyToMgetResult = fn =>
  traverse(Result.of, liftInnerMaybe(Result.of, fn));
const applyToSearchResult = fn => traverse(Result.of, fn);

module.exports = {
  // @todo remove
  one: createResolver(applyToGetResult),
  many: createResolver(applyToMgetResult),

  // proper resolver creators
  get: createResolver(applyToGetResult),
  mget: createResolver(applyToMgetResult),
  search: createResolver(applyToSearchResult),
};
