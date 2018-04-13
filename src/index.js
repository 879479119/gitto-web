import dva from 'dva';
import { browserHistory } from 'dva/router';
import 'antd-mobile/dist/antd-mobile.css';
import './index.css';

// 1. Initialize
const app = dva({
  history: browserHistory,
});
// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/repo'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');