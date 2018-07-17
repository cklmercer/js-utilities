module.exports = (socket, bus) => {
  /**
   * Handle a message by parsing it and forwarding it through the bus.
   * @param {object} message
   * @param {string} data
   * @param {object} meta
   */
  const receive = ({ data, ...meta }) => {
    const event = JSON.parse(data);
    bus.emit(event.type, {
      data: event.data,
      meta,
    });
  };

  /**
   * Send a message to the server.
   * @param {string} type 
   * @param {any} data 
   */
  const send = (type, data) => {
    const payload = JSON.stringify({
      type,
      data,
    });

    socket.send(payload);
  };

  /**
   * Get the current state of the socket.
   * @return {string}
   */
  const state = () => {
    const map = [
      'CONNECTING',
      'OPEN',
      'CLOSING',
      'CLOSED',
    ];

    return map[socket.readyState];
  };

  try {
    socket.addEventListener('message', receive);
  } catch (e) {
    socket.onmessage = receive;
  }

  const client = {
    emit: bus.emit,
    off: bus.off,
    on: bus.on,
    once: bus.once,
    receive,
    send,
    socket,
    state,
    subscriptions: bus.subscriptions,
  };

  Object.defineProperty(client, 'state', { get: state });

  return client;
};
