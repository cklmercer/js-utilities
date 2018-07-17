module.exports = (store = {}) => {
  if (typeof store !== 'object') {
    throw 'store initialized with non-object state.';
  }

  const logs = [];
  const computations = {};
  const mutations = {};
  const state = store;

  /**
   * Commit a mutation of the given type with the given data.
   * @param {string} type 
   * @param {any} data 
   */
  const commit = (type, data) => {
    const update = mutations[type](state, data);
    Object.keys(update).forEach(key => state[key] = update[key]);

    logs.push({
      type,
      data,
    });
  };

  /**
   * Register or evaluate a computed property.
   * @param {string} type 
   * @param {function} fn
   * @return {any}
   */
  const compute = (type, fn) => {
    if (typeof fn !== 'function') {
      return computations[type](state);
    }

    computations[type] = fn;
  };

  /**
   * Get the store state.
   * @return {object}
   */
  const get = () => state;

  /**
   * Get the store commit history.
   * @return {array}
   */
  const history = () => logs;

  /**
   * Register a new mutation.
   * @param {sting} type 
   * @param {function} fn 
   */
  const mutation = (type, fn) => {
    mutations[type] = fn;
  };

  return {
    commit,
    compute,
    get,
    history,
    mutation,
  };
};
