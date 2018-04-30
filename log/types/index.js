const moment = require('moment');
const eventClick = require('./event_click');

const columns = ['session_id', 'name', 'app', 'platform', 'version', 'client_time', 'url', 'ab_test', 'ab_params', 'ip', 'server_time', 'agent'];

function getBaseColumns(origin) {
  const { client: c, server: s } = origin;
  // console.info(moment(s.date, 'DD/MMM/YYYY:HH:mm:ss').toDate())
  return [
    c.sessionId,
    c.name,
    c.base.app,
    c.base.platform,
    c.base.version,
    c.base.clientTime,
    c.base.url,
    c.abList.map(t => t.testId).join(),
    c.abList.map(t => t.paramsId).join(),
    s.ip,
    moment(s.date, 'DD/MMM/YYYY:HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
    s.agent,
  ];
}


const ret = {
  event_click(origin) {
    return eventClick.transform(origin, columns, getBaseColumns(origin));
  },
};

module.exports = ret;
