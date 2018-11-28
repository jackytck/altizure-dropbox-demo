// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"config.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ALTI_CALLBACK = exports.ALTI_KEY = void 0;
var ALTI_KEY = '7MkQf8UggsPaadvrlKALspJWZejZAJOLHn3cnIy';
exports.ALTI_KEY = ALTI_KEY;
var ALTI_CALLBACK = 'https://jackytck.github.io/altizure-dropbox-demo/index.html';
exports.ALTI_CALLBACK = ALTI_CALLBACK;
},{}],"helper.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomState = randomState;
exports.setCookie = setCookie;
exports.getCookie = getCookie;
exports.deleteCookie = deleteCookie;
exports.tokenStateFromHash = tokenStateFromHash;

function randomState(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

function setCookie(name, value, days) {
  var expires = '';

  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }

  document.cookie = name + '=' + value + expires + ';path=/;secure';
}

function getCookie(name) {
  var value = '; ' + document.cookie;
  var parts = value.split('; ' + name + '=');

  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
}

function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
}

function tokenStateFromHash() {
  var token = '';
  var state = '';
  var hash = window.location.hash;
  var re = /access_token=(\w+).*state=(\w+)/g;
  var mat = re.exec(hash);

  if (mat && mat[1] && mat[2]) {
    token = mat[1];
    state = mat[2];
  }

  return {
    token: token,
    state: state
  };
}
},{}],"altizure.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onLogout = onLogout;
exports.onUpload = onUpload;
exports.onSuccess = onSuccess;
exports.render = render;

var _config = require("./config");

var _helper = require("./helper");

var ALTI_TOKEN = '';
var selectedFiles = [];

function onLogout() {
  (0, _helper.deleteCookie)('token');
  window.location.href = _config.ALTI_CALLBACK;
}

function onUpload() {
  var pid = document.getElementById('pid').value;

  if (!pid) {
    alert('Enter pid!');
    return;
  }

  if (!selectedFiles.length) {
    alert('No file is selected!');
  }

  selectedFiles.forEach(function (f) {
    uploadSingle({
      pid: pid,
      name: f.name,
      url: f.link
    });
  });
}

function uploadSingle(_ref) {
  var pid = _ref.pid,
      name = _ref.name,
      url = _ref.url;
  var query = "\n    mutation {\n      uploadImageURL(pid: \"".concat(pid, "\", url: \"").concat(url, "\", filename: \"").concat(name, "\") {\n        id\n      }\n    }\n  ");
  gql({
    query: query,
    token: ALTI_TOKEN
  }).then(function (res) {
    console.log(res.data);
    updateImageList();
  });
  setInterval(updateImageList, 5000);
}

function gql(_ref2) {
  var query = _ref2.query,
      token = _ref2.token;
  var headers = new Headers({
    'Content-Type': 'application/json',
    'key': _config.ALTI_KEY,
    'altitoken': token
  });
  var body = JSON.stringify({
    query: query
  });
  var init = {
    method: 'POST',
    headers: headers,
    body: body
  };
  var request = new Request('https://api.altizure.com/graphql', init);
  return fetch(request).then(function (response) {
    return response.json();
  });
}

function renderUpload(divId, token) {
  var query = "\n  {\n    my {\n      self {\n        name\n      }\n    }\n  }\n  ";
  gql({
    query: query,
    token: token
  }).then(function (res) {
    var user = res.data.my.self.name;
    var html = "\n            <h3>Welcome ".concat(user, "!</h3>\n            <p>1. Press Choose from Dropbox</p>\n            <p>2. Enter pid</p>\n            <p>3. Press Upload</p>\n            <input type=\"text\" id=\"pid\" name=\"pid\" placeholder=\"pid\" />\n            <button onclick=\"onUpload()\">Upload</button>\n            <div><div id=\"file-list\" /></div>\n            <div><div id=\"image-list\" /></div>\n            <br/>\n            <br/>\n            <button onclick=\"onLogout()\">Logout</button>\n          ");
    document.getElementById(divId).innerHTML = html;
  });
}

function updateImageList() {
  var pid = document.getElementById('pid').value;
  var query = "\n  {\n  \tproject(id: \"".concat(pid, "\") {\n      allImages {\n        totalCount\n        edges {\n          node {\n            id\n            state\n            name\n            filename\n          }\n        }\n      }\n    }\n  }\n  ");
  gql({
    query: query,
    token: ALTI_TOKEN
  }).then(function (res) {
    var imgs = res.data.project.allImages.edges.map(function (x) {
      return "<li>".concat(x.node.name, ": ").concat(x.node.state, "</li>");
    });
    document.getElementById('image-list').innerHTML = "<p>Project images:</p><ol>".concat(imgs, "</ol>");
  });
}

function onSuccess(files) {
  selectedFiles = [];
  var fileNames = [];

  for (var i = 0; i < files.length; i++) {
    fileNames.push("<li>".concat(files[i].name, "</li>"));
    selectedFiles.push(files[i]);
  }

  document.getElementById('file-list').innerHTML = "<p>Selected files:</p><ol>".concat(fileNames.join(''), "</ol>");
}

function render(divId, setupDropbox) {
  var tokenCookie = (0, _helper.getCookie)('token');

  if (!tokenCookie) {
    // not login
    var _tokenStateFromHash = (0, _helper.tokenStateFromHash)(),
        token = _tokenStateFromHash.token,
        state = _tokenStateFromHash.state;

    if (token && state) {
      // callback
      var prevState = (0, _helper.getCookie)('state');

      if (state !== prevState) {
        document.getElementById(divId).innerHTML = '<h1>Invalid state!</h1>';
      } else {
        (0, _helper.setCookie)('token', token, 90);
        (0, _helper.deleteCookie)('state');
        ALTI_TOKEN = tokenCookie;
        window.location = "".concat(window.location.origin, "/").concat(window.location.pathname);
        renderUpload(divId, token);
        setupDropbox();
      }
    } else {
      // render auth button
      var _state = (0, _helper.randomState)(20);

      (0, _helper.setCookie)('state', _state);
      var authUrl = "https://api.altizure.com/auth/start?client_id=".concat(_config.ALTI_KEY, "&response_type=token&redirect_uri=").concat(_config.ALTI_CALLBACK, "&state=").concat(_state);
      document.getElementById(divId).innerHTML = "\n            <h1>Altizure Dropbox Demo</h1>\n            <button type='reset' onclick=\"location.href='".concat(authUrl, "'\">\n              Login with Altizure account\n            </button>\n          ");
    }
  } else {
    ALTI_TOKEN = tokenCookie;
    renderUpload(divId, tokenCookie);
    setupDropbox();
  }
}
},{"./config":"config.js","./helper":"helper.js"}],"dropbox.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* global Dropbox */
function setupDropbox(divId, onSuccess) {
  return function () {
    var options = {
      success: onSuccess,
      linkType: 'direct',
      multiselect: true,
      extensions: ['images'],
      folderselect: false
    };
    var button = Dropbox.createChooseButton(options);
    document.getElementById(divId).appendChild(button);
  };
}

var _default = setupDropbox;
exports.default = _default;
},{}],"index.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

var _altizure = require("./altizure");

var _dropbox = _interopRequireDefault(require("./dropbox"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.onUpload = _altizure.onUpload;
global.onLogout = _altizure.onLogout;
(0, _altizure.render)('altizure-container', (0, _dropbox.default)('dropbox-container', _altizure.onSuccess));
},{"./altizure":"altizure.js","./dropbox":"dropbox.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61880" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/altizure-dropbox-demo.e31bb0bc.map