
module.exports = {
  columns: ['type', 'text'],
  transform(origin, columns, params) {
    const { detail: { event: { searchItem: d } } } = origin.client;
    return {
      columns: columns.concat(this.columns),
      params: params.concat([
        d.type,
        d.text,
      ]),
    };
  },
  getStoreInfo() {
    return {
      table: 'raw_event_search',
    };
  },
};
