import { queryProfile, queryReadme } from '../services/repo';


export default {

  namespace: 'repo',

  state: {
    data: null,
    readme: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *fetchProfile({ payload }, { call, put }) {  // eslint-disable-line
      const res = yield call(queryProfile, payload);
      yield put({ type: 'save', payload: res });
      yield put({ type: 'fetchReadme', payload });
    },
    *fetchReadme({ payload }, { call, put }) {  // eslint-disable-line
      const res = yield call(queryReadme, payload);
      yield put({ type: 'save', payload: { readme: res.data } });
    },

  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
