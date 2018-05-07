
module.exports = {
  columns: ['time', 'page_url', 'start_time', 'end_time'],
  transform(origin, columns, params) {
    const { detail: { span: { view: d } } } = origin.client;
    return {
      columns: columns.concat(this.columns),
      params: params.concat([
        d.time,
        d.url,
        d.startTime,
        d.endTime,
      ]),
    };
  },
  getStoreInfo() {
    return {
      table: 'raw_span_view',
    };
  },
};
