import { queryProfile, queryRepos } from '../services/user';
import { parse } from 'querystring';
import logger from '../utils/logMaster';


export default {

  namespace: 'common',

  state: {
    app: null,
    version: null,
    platform: null,
    testId: null,
    paramsId: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      const args = parse(window.location.search.substr(1));
      logger.init({
        app: +args.app,
        version: +args.version,
        platform: +args.platform,
      }, {
        testId: args.testId,
        paramsId: args.paramsId,
      });
      dispatch({
        type: 'saveStatus',
        payload: args,
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
