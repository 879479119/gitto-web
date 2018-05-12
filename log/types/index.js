const moment = require('moment');
const eventClick = require('./event_click');
const spanView = require('./span_view');
const viewPage = require('./view_page');
const eventEnter = require('./event_enter');
const eventSearch = require('./event_search');

const columns = ['session_id', 'name', 'app', 'platform', 'version', 'client_time', 'url', 'ab_test', 'ab_params', 'ip', 'server_time', 'agent'];

function getBaseColumns(origin) {
  const { client: c, server: s } = origin;
  // console.info(moment(s.date, 'DD/MMM/YYYY:HH:mm:ss').toDate())
  return [
    c.base.sessionId,
    c.base.name,
    c.base.app,
    c.base.platform,
    c.base.version,
    c.base.clientTime,
    c.base.url,
    c.abList.length ? ['', ...c.abList, ''].map(t => t.testId).join() : null,
    c.abList.length ? ['', ...c.abList, ''].map(t => t.paramId).join() : null,
    s.ip,
    moment(s.date, 'DD/MMM/YYYY:HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
    s.agent,
  ];
}


const ret = {
  event_click(origin) {
    return eventClick.transform(origin, columns, getBaseColumns(origin));
  },
  span_view(origin) {
    return spanView.transform(origin, columns, getBaseColumns(origin));
  },
  view_page(origin) {
    return viewPage.transform(origin, columns, getBaseColumns(origin));
  },
  event_enter(origin) {
    return eventEnter.transform(origin, columns, getBaseColumns(origin));
  },
  event_search(origin) {
    return eventSearch.transform(origin, columns, getBaseColumns(origin));
  },
};

module.exports = ret;
