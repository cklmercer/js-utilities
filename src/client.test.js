const Client = require('./client');

const createSocket = () => ({
  send: jest.fn(),
  readyState: 1
});

const createBus = () => ({
  subscriptions: [],
  emit: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  once: jest.fn(),
});

describe('client', () => {
  it('receives and relays messages', () => {
    const socket = createSocket();
    const bus = createBus();
    const client = Client(socket, bus);
    const data = JSON.stringify({
      type: 'test',
      data: 'a random message',
    });

    client.receive({ data });
    expect(bus.emit).toHaveBeenCalled();
  });

  it('sends messages', () => {
    const socket = createSocket();
    const bus = createBus();
    const client = Client(socket, bus);

    client.send('test', 'a random message');
    expect(socket.send).toHaveBeenCalledWith(JSON.stringify({
      type: 'test',
      data: 'a random message'
    }));
  });

  it('proxies properties from the socket and bus', () => {
    const socket = createSocket();
    const bus = createBus();
    const client = Client(socket, bus);

    expect(client.state).toEqual('OPEN');
    expect(client.emit).toEqual(bus.emit);
    expect(client.off).toEqual(bus.off);
    expect(client.on).toEqual(bus.on);
    expect(client.once).toEqual(bus.once);
    expect(client.subscriptions).toEqual(bus.subscriptions);
  });
});