import { queryProfile, queryRepos } from '../services/user';
import { parse } from 'querystring';
import logger from '../utils/logMaster';


export default {

  namespace: 'common',

  state: {
    app: null,
    version: null,
    platform: null,
    tests: [],
    params: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      const args = parse(window.location.search.substr(1));
      // 包含多次测试的信息
      const tests = JSON.parse(args.testArray).detail;
      const baseInfo = {
        app: +args.app,
        version: +args.version,
        platform: +args.platform,
      };
      logger.init(baseInfo, { tests });
      const params = tests.reduce((prev, cur) => ({ ...prev, ...JSON.parse(cur.params) }), {});
      dispatch({
        type: 'saveStatus',
        payload: {
          ...baseInfo, tests, params,
        },
      });
    },
  },

  effects: {
  },

  reducers: {
    saveStatus(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
