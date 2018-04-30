
module.exports = {
  columns: ['type', 'click_id', 'origin', 'origin_id', 'x', 'y', 'path'],
  transform(origin, columns, params) {
    const { detail: { event: { clickItem: d } } } = origin.client;
    return {
      columns: columns.concat(this.columns),
      params: params.concat([
        d.type,
        d.id,
        d.origin,
        d.origin_id,
        d.x,
        d.y,
        d.path,
      ]),
    };
  },
  getStoreInfo() {
    return {
      table: 'raw_event_click',
    };
  },
};
