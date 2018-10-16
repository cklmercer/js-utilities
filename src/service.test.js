const Service = require('./service');

const client = {
  send: () => {},
};

describe('service', () => {
  it('registers a service', () => {
    const service = Service(client, {
      name: 'user',
    });

    expect(service.name).toEqual('user');
    expect(typeof service.create).toEqual('function');
    expect(typeof service.list).toEqual('function');
    expect(typeof service.remove).toEqual('function');
    expect(typeof service.update).toEqual('function');
    expect(typeof service.view).toEqual('function');
  });

  it('throws an error if you try to register a service without providing a name', () => {
    const fn = () => Service(client);
    expect(fn).toThrow('Attempting to register service without providing a name option.');
  });

  it('throws an error if you provide a non-array "methods" option.', () => {
    const fn = () => Service(client, {
      name: 'test-service',
      methods: 'definitely not an array',
    });

    expect(fn).toThrow('Non-array "methods" option provided for service "test-service".');
  });

  it('only registers the specified methods if a "methods" option is provided.', () => {
    const service = Service(client, {
      name: 'test-service',
      methods: [
        'create',
        'list',
      ],
    });

    expect(typeof service.create).toEqual('function');
    expect(typeof service.list).toEqual('function');
    expect(typeof service.remove).toEqual('undefined');
    expect(typeof service.update).toEqual('undefined');
    expect(typeof service.view).toEqual('undefined');
  });
});
