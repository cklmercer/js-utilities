const Bus = require('./bus');

describe('bus', () => {
  it('registers event subscribers', () => {
    const bus = Bus();

    expect(bus.subscriptions).toHaveLength(0);

    const fn = jest.fn();

    bus.on({
      type: 'test',
      handler: fn,
    });

    expect(bus.subscriptions).toHaveLength(1);

    const { type, handler, once } = bus.subscriptions[0];

    expect(type).toEqual('test');
    expect(handler).toEqual(fn);
    expect(once).toEqual(false);
  });

  it('emits events and triggers event subscribers', () => {
    const bus = Bus();
    const fn = jest.fn();

    bus.on({
      type: 'test',
      handler: fn,
    });

    bus.emit('test');
    bus.emit('test');

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('registers one-off event subscribers', () => {
    const bus = Bus();
    const fn = jest.fn();

    bus.once({
      type: 'test',
      handler: fn,
    });

    bus.emit('test');
    bus.emit('test');

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('removes event subscribers', () => {
    const bus = Bus();
    const fn = jest.fn();

    const sub1 = {
      type: 'test',
      handler: fn,
    };

    const sub2 = {
      type: 'test2',
      handler: fn,
    };

    bus.on(sub1);
    bus.on(sub2);

    expect(bus.subscriptions).toHaveLength(2);

    bus.off({
      type: 'never-registered',
      handler: () => {},
    });

    expect(bus.subscriptions).toHaveLength(2);

    bus.off(sub2);

    expect(bus.subscriptions).toHaveLength(1);

    bus.off(sub1);
    
    expect(bus.subscriptions).toHaveLength(0);
  });
});