
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
  static getTypeMap(typeName, subTypeName) {
    const typeMap = {
      event: {
        id: 1,
        sub: {
          clickItem: 2,
          searchItem: 1,
        },
      },
      view: {
        id: 3,
        sub: {
          cardShow: 9,
        },
      },
      error: {
        id: 4,
        sub: {
          network: 13,
          image: 17,
          script: 15,
        },
      },
    };

    const type = typeMap[typeName].id;
    const subType = typeMap[typeName].sub[subTypeName];

    return { type, subType };
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
    this.ab = abInfo.tests;
  }

  log = (type, subType, msg) => {
    if (!this.logger) {
      this.logger = window.LogMaster;
    }

    if (!this.base) {
      throw Error('null');
    }

    const post = {
      base: { ...this.base, ...Util.getTypeMap(type, subType) },
      abList: this.ab.map(t => ({
        testId: t.testId,
        paramsId: t.paramsId,
      })),
      detail: {},
    };

    post.detail[type] = {};
    post.detail[type][subType] = msg;

    try {
      const json = JSON.stringify(post);
      this.logger.setLog(json);
    } catch (e) {
      console.error(e);
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
