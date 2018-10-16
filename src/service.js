module.exports = (client, options) => {
  if (!options || typeof options.name !== 'string') {
    throw new Error('Attempting to register service without providing a name option.');
  }

  if (options.methods && !Array.isArray(options.methods)) {
    throw new Error(`Non-array "methods" option provided for service "${options.name}".`);
  }

  /**
   * Human readable service name.
   * @type {string}
   */
  const name = options.name;

  /**
   * Create a function to call the service.
   * @param {string} name
   * @param {string} action
   * @return {function}
   */
  const call = (name, action) => data => client.send(`${name}.${action}`, data);

  /**
   * Default service methods.
   * @type {array}
   */
  const methods = [
    'create',
    'list',
    'remove',
    'update',
    'view',
  ];

  /**
   * Barebones service.
   * @type {object}
   */
  const service = {
    name: options.name,
  };

  // Register service methods.
  methods
    .filter(method => !options.methods || options.methods.includes(method))
    .forEach(method => {
      service[method] = call(name, method);
    });

  return service;
};
