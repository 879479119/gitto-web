const fs = require('fs');
const path = require('path');

const { masterConn, slaveConn } = require('./database');
const { queryTypes, querySubTypes, insertLogInfo } = require('./querys');
const typeUtil = require('./types/index.js');

(async () => {
  const types = await queryTypes();
  const subTypes = await querySubTypes();

  const rows = getDataRows();

  const store = Object.create(null);
  rows.map((row) => {
    // console.info(row)

    const { type, subType } = row.client.base;
    const typeName = types.find(t => +t.id === +type).name.toLowerCase();
    const subTypeName = subTypes.find(t => +t.id === +subType).name.toLowerCase();
    if (!store[typeName]) {
      store[typeName] = {};
    }
    if (!store[typeName][subTypeName]) {
      store[typeName][subTypeName] = { columns: [], values: [] };
    }
    const ref = store[typeName][subTypeName];
    const data = typeUtil.event_click(row);

    ref.columns = data.columns;
    ref.values.push(data.params);

    return 0;
  });

  for (const lv1 in store) {
    // noinspection JSUnfilteredForInLoop
    for (const lv2 in store[lv1]) {
      // console.info(store[lv1][lv2])
      // noinspection JSUnfilteredForInLoop
      insertLogInfo(`raw_${lv1}_${lv2}`, store[lv1][lv2].columns, store[lv1][lv2].values);
    }
  }

  // masterConn.disconnect();
  // slaveConn.disconnect();

  return 0;
})();

/**
 * 获取每一行简单格式化后的数据
 * @return {{server: {ip: *|string, date: *|string, request: *|string, code: number, refer: string, agent: string}, client: any}[]}
 */
function getDataRows() {
  const file = fs.readFileSync(path.resolve('../../access.log'), 'utf8');

  const lines = file.split('\n');

  return lines.filter(Boolean).map((line) => {
    try {
      const columns = line.split(' - ');
      const body = JSON.parse(decodeURIComponent(columns[2].match(/GET \/\?logs=(.*) HTTP\//)[1]));
      const obj = {
        ip: columns[0],
        date: columns[1],
        request: columns[2],
        code: +columns[3],
        refer: columns[4].substring(1, columns[4].length - 1),
        agent: columns[5].substring(1, columns[5].length - 1),
      };
      return {
        server: obj,
        client: body,
      };
    } catch (e) {
      // 出现任何不合规的情况都是垃圾日志
      return null;
    }
  }).filter(Boolean);
}
