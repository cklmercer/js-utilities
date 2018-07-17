module.exports = () => {
  /**
   * Service subscriptions.
   * @type {Array}
   */
  const subscriptions = [];

  /**
   * Emit an event to the listening subscribers.
   * @param {string} type
   * @param {any} data
   */
  const emit = (type, data) => {
    subscriptions
      .filter(subscription => (subscription.type === type))
      .forEach(subscription => {
        subscription.handler(data);

        if (subscription.once) {
          off(subscription);
        }
      });
  };

  /**
   * Remove the given event subscription.
   * @param {object} subscription
   * @param {string} subscription.type 
   * @param {function} subscription.handler 
   */
  const off = ({ type, handler }) => {
    const index = subscriptions.findIndex(subscription => {
      return ((type === subscription.type) && (handler === subscription.handler));
    });

    if (index > -1) {
      subscriptions.splice(index, 1);
    }
  };

  /**
   * Register a new service subscription.
   * @param {object} subscription
   * @param {string} subscription.type 
   * @param {function} subscription.handler 
   */
  const on = ({ type, handler }) => {
    subscriptions.push({
      type,
      handler,
      once: false,
    });
  };

  /**
   * Register a new one-time service subscription.
   * @param {object} subscription
   * @param {string} subscription.type 
   * @param {function} subscription.handler 
   */
  const once = ({ type, handler }) => {
    subscriptions.push({
      type,
      handler,
      once: true,
    });
  };

  return {
    emit,
    off,
    on,
    once,
    subscriptions,
  };
};
