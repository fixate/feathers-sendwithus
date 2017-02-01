export default {
  sendRequest() {
    return {
      template: 'fake-template',
      recipient: { address: 'recipient@fake.com' },
      sender: { address: 'sender@fake.com' },
    };
  },

  batchSendRequest(count = 1) {
    return Array.apply([], { length: count }).map(this.sendRequest);
  },
};
