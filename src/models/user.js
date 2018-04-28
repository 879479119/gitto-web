import { queryProfile, queryRepos } from '../services/user';


export default {

  namespace: 'user',

  state: {
    data: null,
    readme: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *fetchProfile({ payload }, { call, put }) {  // eslint-disable-line
      const res = yield call(queryProfile, payload);
      yield put({ type: 'save', payload: res });
      yield put({ type: 'fetchRepos', payload });
    },
    *fetchRepos({ payload }, { call, put }) {  // eslint-disable-line
      const res = yield call(queryRepos, payload);
      yield put({ type: 'save', payload: {repos: res.data} });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
