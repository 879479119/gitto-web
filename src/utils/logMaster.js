
class Util {
  static getDOMPath(target) {
    let node = target;
    let path = '';
    while (node instanceof window.Node) {
      if (!node.tagName) break;
      const nth = Util.getNth(node, node.parentNode);
      path += `/${node.tagName}:${nth}`;
      node = node.parentNode;
    }
    return path.toUpperCase();
  }
  static getNth(target, parent) {
    if (parent && target) {
      for (let i = 0; i < parent.childNodes.length; i++) {
        if (parent.childNodes[i] === target) {
          return i;
        }
      }
    }
    return -1;
  }
}


class Base {
  type = null
  subType = null
  app = null
  platform = null
  version = null
  versionHash = null
  sessionId = null
  name = null
  clientTime = null
  url = null

  constructor(init) {
    this.app = init.app;
    this.platform = init.platform;
    this.version = init.version;
    this.sessionId = init.sessionId;
    this.name = init.name;
  }

  getVersionHash() {
    const hash = window.VERSION;
    // for (const s of window.document.scripts) {
    //   if (s.src.indexOf('index' !== -1)) {
    //     hash = s.src.match(/index\.(\w|\d)*\./)[1];
    //   }
    // }
    this.versionHash = hash;
  }

  setType(type, subType) {
    this.type = type;
    this.subType = subType;
  }

  setURL(url) {
    this.url = url;
    this.clientTime = Date.now();
  }
}


class JSLogMaster {
  constructor() {
    this.logger = window.LogMaster;
    this.base = null;
    this.ab = null;
  }

  init(baseInfo, abInfo) {
    this.base = new Base(baseInfo);
    this.base.getVersionHash();
    this.ab = {
      testId: abInfo.testId,
      paramsId: abInfo.paramsId,
    };
  }

  log = (type, subType, msg) => {
    if (!this.logger) {
      this.logger = window.LogMaster;
    }

    if (!this.base) {
      throw Error('埋点信息获取失败');
    }

    const post = {
      base: this.base,
      ab: this.ab,
    }

    post.detail[type][subType] = msg

    try {
      const json = JSON.stringify(post);
      this.logger.setLog(json);
    } catch (e) {
      console.info('error');
    }
  }

  trackClick = (event) => {
    const post = {
      type: event.currentTarget.tagName,
      id: event.currentTarget.getAttribute('id') || null,
      origin: 1, // webview
      originId: null,
      x: event.clientX,
      y: event.clientY,
      path: Util.getDOMPath(event.currentTarget),
    };
    console.info(post);
    this.log('event', 'clickItem', post);
  }

  trackSearch = (event) => {
    this.log('event', 'searchItem', { text: event.target.value });
  }

  trackCardShow = (event) => {
    this.log('view', 'cardShow', { url: window.location.href, cardId: event.id });
  }

  trackNetworkError = (error) => {
    this.log('error', 'network', error);
  }

  trackScriptError = (error) => {
    this.log('error', 'script', error);
  }

  trackImageError = (error) => {
    this.log('error', 'image', error);
  }
}

export default new JSLogMaster();
