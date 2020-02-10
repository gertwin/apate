import APATE from './apate';

APATE.namespace('APATE.CONST');

APATE.CONST = (function fn() {
    /**
     * @type {Object.<string, Object>}
     */
    const SETTINGS = {
        'fontsize': {'default': 14, 'type': 'number', 'widget': 'number'},
        'linenumbers': {'default': true, 'type': 'boolean', 'widget': 'checkbox'},
        'sidebaropen': {'default': false, 'type': 'boolean', 'widget': null},
        'sidebarwidth': {'default': 220, 'type': 'integer', 'widget': null},
        'bottombaropen': {'default': false, 'type': 'boolean', 'widget': null},
        'bottombarheight': {'default': 220, 'type': 'integer', 'widget': null},
        'smartindent': {'default': true, 'type': 'boolean', 'widget': 'checkbox'},
        'spacestab': {'default': true, 'type': 'boolean', 'widget': 'checkbox'},
        'tabsize': {'default': 4, 'type': 'integer', 'widget': 'number'},
        'theme': {'default': 'default', 'type': 'string', 'widget': 'radio'},
        'wraplines': {'default': true, 'type': 'boolean', 'widget': 'checkbox'}
    };

    const EXTENSION_TO_MODE = {
        'bash': 'shell',
        'coffee': 'coffeescript',
        'c': 'clike',
        'c++': 'clike',
        'cc': 'clike',
        'cs': 'clike',
        'css': 'css',
        'cpp': 'clike',
        'cxx': 'clike',
        'diff': 'diff',
        'gemspec': 'ruby',
        'go': 'go',
        'h': 'clike',
        'hh': 'clike',
        'hpp': 'clike',
        'htm': 'htmlmixed',
        'html': 'htmlmixed',
        'java': 'clike',
        'js': 'javascript',
        'json': 'yaml',
        'latex': 'stex',
        'less': 'text/x-less',
        'ltx': 'stex',
        'lua': 'lua',
        'markdown': 'markdown',
        'md': 'markdown',
        'ml': 'ocaml',
        'mli': 'ocaml',
        'patch': 'diff',
        'pgsql': 'sql',
        'pl': 'perl',
        'pm': 'perl',
        'php': 'php',
        'phtml': 'php',
        'py': 'python',
        'rb': 'ruby',
        'rdf': 'xml',
        'rs': 'rust',
        'rss': 'xml',
        'ru': 'ruby',
        'scm': 'scheme',
        'sh': 'shell',
        'sql': 'sql',
        'svg': 'xml',
        'tex': 'stex',
        'xhtml': 'htmlmixed',
        'xml': 'xml',
        'xq': 'xquery',
        'yaml': 'yaml'
    };

    const DIRECTION = {
        horizontal: 1,
        vertical: 2,
    };

    // public API
    return {
        SETTINGS,
        EXTENSION_TO_MODE,
        DIRECTION,
    };
}());

export default APATE.CONST;
