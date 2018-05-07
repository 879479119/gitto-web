
module.exports = {
  columns: ['date', 'source', 'load_time', 'splash_jump'],
  transform(origin, columns, params) {
    const { detail: { event: { enterApp: d } } } = origin.client;
    return {
      columns: columns.concat(this.columns),
      params: params.concat([
        d.date,
        d.source,
        d.loadTime,
        d.splashJump,
      ]),
    };
  },
  getStoreInfo() {
    return {
      table: 'raw_event_enter',
    };
  },
};
