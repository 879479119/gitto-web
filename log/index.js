const fs = require('fs');
const path = require('path');

const { masterConn, slaveConn } = require('./database');
const { queryTypes, querySubTypes, insertLogInfo } = require('./querys');
const typeUtil = require('./types/index.js');

try {
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
      console.info(`${typeName}_${subTypeName}`);
      if (!typeUtil[`${typeName}_${subTypeName}`]) {
        return 0;
      }
      const data = typeUtil[`${typeName}_${subTypeName}`](row);

      ref.columns = data.columns;
      ref.values.push(data.params);

      return 0;
    });


    for (const lv1 in store) {
      // noinspection JSUnfilteredForInLoop
      for (const lv2 in store[lv1]) {
        // console.info(store[lv1][lv2])
        // noinspection JSUnfilteredForInLoop
        await insertLogInfo(`raw_${lv1}_${lv2}`, store[lv1][lv2].columns, store[lv1][lv2].values);
      }
    }

    // masterConn.disconnect();
    // slaveConn.disconnect();
    process.exit(0);

    return 0;
  })().catch((e) => {
    console.info(e);

    process.exit(1);
  });
} catch (e) {
  console.info(e);
}


function getDataRows() {
  const file = fs.readFileSync(path.resolve('../../access.log'), 'utf8');

  const lines = file.split('\n');

  return lines.filter(Boolean).map((line) => {
    try {
      const columns = line.split(' - ');
      console.info(decodeURIComponent(columns[2].match(/GET \/utm.gif\?logs=(.*) HTTP\/1\.1/)[1]));
      const body = JSON.parse(decodeURIComponent(columns[2].match(/GET \/utm.gif\?logs=(.*) HTTP\/1\.1/)[1]));
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
      console.info(e);
      // 出现任何不合规的情况都是垃圾日志
      return null;
    }
  }).filter(Boolean);
}
