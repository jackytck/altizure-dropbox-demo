parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"4itQ":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.ALTI_CALLBACK=exports.ALTI_KEY=void 0;var e="7MkQf8UggsPaadvrlKALspJWZejZAJOLHn3cnIy";exports.ALTI_KEY=e;var t="https://jackytck.github.io/altizure-dropbox-demo/index.html";exports.ALTI_CALLBACK=t;
},{}],"YaYI":[function(require,module,exports) {
"use strict";function e(e){for(var t="",o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",r=0;r<e;r++)t+=o.charAt(Math.floor(Math.random()*o.length));return t}function t(e,t,o){var r="";if(o){var n=new Date;n.setTime(n.getTime()+24*o*60*60*1e3),r="; expires="+n.toUTCString()}document.cookie=e+"="+t+r+";path=/;secure"}function o(e){var t=("; "+document.cookie).split("; "+e+"=");if(2===t.length)return t.pop().split(";").shift()}function r(e){document.cookie=e+"=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/"}function n(){var e="",t="",o=window.location.hash,r=/access_token=(\w+).*state=(\w+)/g.exec(o);return r&&r[1]&&r[2]&&(e=r[1],t=r[2]),{token:e,state:t}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.randomState=e,exports.setCookie=t,exports.getCookie=o,exports.deleteCookie=r,exports.tokenStateFromHash=n;
},{}],"8v4l":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.onLogout=i,exports.onUpload=a,exports.onSuccess=u,exports.render=s;var e=require("./config"),n=require("./helper"),t="",o=[];function i(){(0,n.deleteCookie)("token"),window.location.href=e.ALTI_CALLBACK}function a(){var e=document.getElementById("pid").value;e?(o.length||alert("No file is selected!"),o.forEach(function(n){c({pid:e,name:n.name,url:n.link})})):alert("Enter pid!")}function c(e){var n=e.pid,o=e.name,i=e.url;r({query:'\n    mutation {\n      uploadImageURL(pid: "'.concat(n,'", url: "').concat(i,'", filename: "').concat(o,'") {\n        id\n      }\n    }\n  '),token:t}).then(function(e){console.log(e.data),d()}),setInterval(d,5e3)}function r(n){var t=n.query,o=n.token,i=new Headers({"Content-Type":"application/json",key:e.ALTI_KEY,altitoken:o}),a=JSON.stringify({query:t}),c=new Request("https://api.altizure.com/graphql",{method:"POST",headers:i,body:a});return fetch(c).then(function(e){return e.json()})}function l(e,n){r({query:"\n  {\n    my {\n      self {\n        name\n      }\n    }\n  }\n  ",token:n}).then(function(n){var t=n.data.my.self.name,o="\n            <h3>Welcome ".concat(t,'!</h3>\n            <p>1. Press Choose from Dropbox</p>\n            <p>2. Enter pid</p>\n            <p>3. Press Upload</p>\n            <input type="text" id="pid" name="pid" placeholder="pid" />\n            <button onclick="onUpload()">Upload</button>\n            <div><div id="file-list" /></div>\n            <div><div id="image-list" /></div>\n            <br/>\n            <br/>\n            <button onclick="onLogout()">Logout</button>\n          ');document.getElementById(e).innerHTML=o})}function d(){var e=document.getElementById("pid").value;r({query:'\n  {\n  \tproject(id: "'.concat(e,'") {\n      allImages {\n        totalCount\n        edges {\n          node {\n            id\n            state\n            name\n            filename\n          }\n        }\n      }\n    }\n  }\n  '),token:t}).then(function(e){var n=e.data.project.allImages.edges.map(function(e){return"<li>".concat(e.node.name,": ").concat(e.node.state,"</li>")});document.getElementById("image-list").innerHTML="<p>Project images:</p><ol>".concat(n,"</ol>")})}function u(e){o=[];for(var n=[],t=0;t<e.length;t++)n.push("<li>".concat(e[t].name,"</li>")),o.push(e[t]);document.getElementById("file-list").innerHTML="<p>Selected files:</p><ol>".concat(n.join(""),"</ol>")}function s(o,i){var a=(0,n.getCookie)("token");if(a)t=a,l(o,a),i();else{var c=(0,n.tokenStateFromHash)(),r=c.token,d=c.state;if(r&&d){d!==(0,n.getCookie)("state")?document.getElementById(o).innerHTML="<h1>Invalid state!</h1>":((0,n.setCookie)("token",r,90),(0,n.deleteCookie)("state"),t=a,window.location="".concat(window.location.origin,"/").concat(window.location.pathname),l(o,r),i())}else{var u=(0,n.randomState)(20);(0,n.setCookie)("state",u);var s="https://api.altizure.com/auth/start?client_id=".concat(e.ALTI_KEY,"&response_type=token&redirect_uri=").concat(e.ALTI_CALLBACK,"&state=").concat(u);document.getElementById(o).innerHTML="\n            <h1>Altizure Dropbox Demo</h1>\n            <button type='reset' onclick=\"location.href='".concat(s,"'\">\n              Login with Altizure account\n            </button>\n          ")}}}
},{"./config":"4itQ","./helper":"YaYI"}],"zqO7":[function(require,module,exports) {
"use strict";function e(e,t){return function(){var o={success:t,linkType:"direct",multiselect:!0,extensions:["images"],folderselect:!1},s=Dropbox.createChooseButton(o);document.getElementById(e).appendChild(s)}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=e;exports.default=t;
},{}],"Focm":[function(require,module,exports) {
var global = arguments[3];
var o=arguments[3],e=require("./altizure"),r=n(require("./dropbox"));function n(o){return o&&o.__esModule?o:{default:o}}o.onUpload=e.onUpload,o.onLogout=e.onLogout,(0,e.render)("altizure-container",(0,r.default)("dropbox-container",e.onSuccess));
},{"./altizure":"8v4l","./dropbox":"zqO7"}]},{},["Focm"], null)
//# sourceMappingURL=https://jackytck.github.io/altizure-dropbox-demo/altizure-dropbox-demo.8958fdcb.map