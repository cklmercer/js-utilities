const Store = require('./store');

describe('store', () => {
  it('accepts an object to use as initial state.', () => {
    const store = Store({ message: 'hello world' });
    const { message } = store.get();
    expect(message).toEqual('hello world');
  });

  it('is initialized with an empty object by default', () => {
    const store = Store();
    const state = store.get();
    expect(typeof state).toEqual('object');
    expect(Object.keys(state)).toHaveLength(0);
  });

  it('throws an error if initialized with a non-object', () => {
    const nonObjectInitialization = () => Store('not an object');
    expect(nonObjectInitialization).toThrow();
  });

  it('registers and evalulates computed properties', () => {
    const store = Store({
      quantity: 5,
      cost: 1000,
    });

    store.compute('total', ({ cost, quantity }) => (cost * quantity));
    const total = store.compute('total');
    expect(total).toEqual(5000);
  });

  it('it registers, commits and logs mutations', () => {
    const store = Store({ count: 0 });

    store.mutation('increment', ({ count }) => ({ count: (count + 1) }));
    store.mutation('incrementBy', ({ count }, amount) => ({ count: (count + amount) }));
    store.commit('increment');
    store.commit('increment');
    store.commit('incrementBy', 3);

    const { count } = store.get();
    expect(count).toEqual(5);

    const logs = store.history();
    expect(logs).toHaveLength(3);
    expect(logs[0].type).toEqual('increment');
    expect(logs[0].data).toEqual(undefined);
    expect(logs[2].type).toEqual('incrementBy');
    expect(logs[2].data).toEqual(3);
  });
});