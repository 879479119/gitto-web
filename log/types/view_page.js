
module.exports = {
  columns: ['source_url', 'page_url'],
  transform(origin, columns, params) {
    console.info(origin.client)
    const { detail: { view: { pageShow: d } } } = origin.client;
    return {
      columns: columns.concat(this.columns),
      params: params.concat([
        d.sourceUrl,
        d.url,
      ]),
    };
  },
  getStoreInfo() {
    return {
      table: 'raw_view_page',
    };
  },
};
