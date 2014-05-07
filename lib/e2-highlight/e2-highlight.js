YUI.add('e2-highlight', function (Y) {

    var STYLES = {
            'default'    : 'background: #272822; color: #f8f8f2;',
            'keyword'    : 'color: #f92672;',
            'atom'       : 'color: #ae81ff;',
            'number'     : 'color: #ae81ff;',
            'string'     : 'color: #e6db74;',
            'property'   : 'color: #a6e22e;',
            'attribute'  : 'color: #a6e22e;',
            'variable'   : 'color: #a6e22e;',
            'definition' : 'color: #fd971f;',
            'delimiter'  : 'color: #f8f8f2;',
            'tag'        : 'color: #f92672;',
            'link'       : 'color: #ae81ff;',
            'error'      : 'background: #f92672; color: #f8f8f0;',
            'comment'    : 'color: #75715e;'
        };

    Y.namespace('E2').Highlight = Y.Base.create('e2-highlight', Y.Base, [], {
        applyStyles: function (name, node) {
            var styles = this.getStyles(),
                style = styles[name] || styles.default;

            node.set('style', style);
        },

        process: function (node) {
            var ch,
                state,
                token,
                tokenNode,
                lineNode = null,
                holdNode = Y.Node.create(this.getHoldNode()),
                stream = new Y.E2.StringStream({ buf: node.getHTML() }),
                lang = this.findLang(node.get('lang') || 'plain');

            this.applyStyles('default', holdNode);

            state = lang.startState();

            while (!stream.eot()) {
                if (stream.newLine() || Y.Lang.isNull(lineNode)) {
                    if (lineNode && lineNode.get('parent') !== holdNode) {
                        holdNode.appendChild(lineNode);
                    }
                    lineNode = Y.Node.create(this.getLineNode());
                    ch = stream.read();
                }

                token = lang.getToken(stream, state);

                if (token) {
                    tokenNode = Y.Node.create(this.getTokenNode());
                    tokenNode.set('text', token.text);
                    this.applyStyles(token.type, tokenNode);
                    lineNode.appendChild(tokenNode);
                }
            }

            if (lineNode && lineNode.get('text').length > 0) {
                holdNode.appendChild(lineNode);
            }

            return holdNode;
        },

        findLang: function (tag) {
            var langs = this.getLanguages(),
                lang = langs.find(tag);

            return lang || langs.find('plain');
        },

        getHoldNode: function () {
            return this.get('holdNode');
        },

        getLineNode: function () {
            return this.get('lineNode');
        },

        getTokenNode: function () {
            return this.get('tokenNode');
        },

        getStyles: function () {
            return this.get('styles');
        },

        getLanguages: function () {
            return this.get('languages');
        },
    }, {
        ATTRS: {
            holdNode: {
                value: '<ol></ol>',
                validator: Y.Lang.isString,
                readOnly: true
            },
            lineNode: {
                value: '<li></li>',
                validator: Y.Lang.isString,
                readOnly: true
            },
            tokenNode: {
                value: '<span></span>',
                validator: Y.Lang.isString,
                readOnly: true
            },
            styles: {
                value: STYLES,
                validator: Y.Lang.isObject,
                readOnly: true
            },
            languages: {
                value: Y.E2.ProgLang.All,
                validator: function (val) {
                    return val instanceof Y.E2.ProgLanguages;
                }
            }
        }
    });

}, '1.0', {
    requires: [
        'node',
        'e2-stream',
        'e2-prog-lang'
    ]
});
