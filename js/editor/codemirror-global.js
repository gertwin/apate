
// work-around for es6 modules
import CodeMirror from 'codemirror/lib/codemirror';
window.CodeMirror = CodeMirror;
// addons
import 'codemirror/addon/mode/simple';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/match-highlighter';
// modes
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/clojure/clojure';
import 'codemirror/mode/cobol/cobol';
import 'codemirror/mode/coffeescript/coffeescript';
import 'codemirror/mode/commonlisp/commonlisp';
import 'codemirror/mode/css/css';
import 'codemirror/mode/d/d';
import 'codemirror/mode/diff/diff';
import 'codemirror/mode/erlang/erlang';
import 'codemirror/mode/go/go';
import 'codemirror/mode/haskell/haskell';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/livescript/livescript';
import 'codemirror/mode/lua/lua';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/mllike/mllike';
import 'codemirror/mode/pascal/pascal';
import 'codemirror/mode/perl/perl';
import 'codemirror/mode/php/php';
import 'codemirror/mode/python/python';
import 'codemirror/mode/r/r';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/rust/rust';
import 'codemirror/mode/scheme/scheme';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/smalltalk/smalltalk';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/stex/stex';
import 'codemirror/mode/tcl/tcl';
import 'codemirror/mode/vbscript/vbscript';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/xquery/xquery';
import 'codemirror/mode/yaml/yaml';

import 'codemirror/lib/codemirror.css';

// Make CodeMirror available globally so the modes' can register themselves.

// if (!CodeMirror.modeURL) {
//     CodeMirror.modeURL = '../mode/%N/%N.js'
// }

// let loading = {}


// function splitCallback (cont, n) {
//   let countDown = n
//   return function () {
//     if (--countDown === 0) cont()
//   }
// }


// function ensureDeps (mode, cont) {
//     let deps = CodeMirror.modes[mode].dependencies;
//     if (!deps) {
//         return cont();
//     }
//     let missing = [];
//     for (let i = 0; i < deps.length; ++i) {
//         if (!CodeMirror.modes.hasOwnProperty(deps[i])) {
//             missing.push(deps[i]);
//         }
//     }
//     if (!missing.length) {
//         return cont();
//     }
//     let split = splitCallback(cont, missing.length);
//     for (i = 0; i < missing.length; ++i) {
//         CodeMirror.requireMode(missing[i], split);
//     }
// }


// CodeMirror.requireMode = function (mode, cont) {
//     if (typeof mode !== 'string') {
//         mode = mode.name;
//     }
//     if (CodeMirror.modes.hasOwnProperty(mode)) {
//         return ensureDeps(mode, cont);
//     }
//     if (loading.hasOwnProperty(mode)) {
//         return loading[mode].push(cont);
//     }

//     let file = CodeMirror.modeURL.replace(/%N/g, mode);

//     let script = document.createElement('script');
//     script.src = file;
//     let others = document.getElementsByTagName('script')[0];
//     let list = loading[mode] = [cont];

//     CodeMirror.on(script, 'load', function () {
//         ensureDeps(mode, function () {
//             for (let i = 0; i < list.length; ++i) {
//                 list[i]();
//             }
//         });
//     });

//     others.parentNode.insertBefore(script, others);
// }


// CodeMirror.autoLoadMode = function (instance, mode) {
//     if (CodeMirror.modes.hasOwnProperty(mode)) {
//         return
//     }

//     CodeMirror.requireMode(mode, function () {
//         instance.setOption('mode', instance.getOption('mode'));
//     });
// }


export default CodeMirror;
