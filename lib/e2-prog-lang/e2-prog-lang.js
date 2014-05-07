YUI.add('e2-prog-lang', function (Y) {

    var TYPE = {
            ATOM        : 'atom',
            ATTRIBUTE   : 'attribute',
            COMMENT     : 'comment',
            DEFAULT     : 'default',
            DEFINITION  : 'definition',
            DELIMITER   : 'delimiter',
            ERROR       : 'error',
            KEYWORD     : 'keyword',
            LINK        : 'link',
            NUMBER      : 'number',
            PROPERTY    : 'property',
            STRING      : 'string',
            VARIABLE    : 'variable',
            TAG         : 'tag'
        };

    Y.namespace('E2').ProgLanguage = Y.Base.create('e2-prog-lang', Y.Model, [], {
        startState: function () {
        },

        getToken: function (stream, state) {
        },

        getName: function () {
            return this.get('name');
        },

        getAliases: function () {
            return this.get('aliases');
        }
    }, {
        TYPE: TYPE,

        ATTRS: {
            name: {
                value: null,
                validator: Y.Lang.isString,
                readOnly: true
            },
            aliases: {
                value: [],
                validator: Y.Lang.isArray,
                readOnly: true
            }
        }
    });


    Y.namespace('E2').ProgLanguages = Y.Base.create('e2-prog-langs', Y.ModelList, [], {
        model: Y.E2.ProgLanguage,

        find: function (name) {
            var result = null;

            this.each(function (lang) {
                if (lang.getName() == name || lang.getAliases().indexOf(name) >= 0) {
                    result = lang;
                }
            });

            return result;
        }
    });

    Y.namespace('E2.ProgLang').Plain = Y.Base.create('e2-prog-lang-plain', Y.E2.ProgLanguage, [], {
        getToken: function (stream) {
            var line = stream.readLine();

            if (line) {
                return {
                    type: Y.E2.ProgLanguage.TYPE.DEFAULT,
                    text: line
                }
            }
            return null;
        }
    }, {
        ATTRS: {
            name: {
                value: 'plain'
            },

            aliases: {
                value: ['plain']
            }
        }
    });

    Y.namespace('E2.ProgLang').Diff = Y.Base.create('e2-prog-lang-diff', Y.E2.ProgLanguage, [], {
        getToken: function (stream) {
            var result = {},
                first,
                line = stream.readLine();

            if (line) {
                result.text = line;
                first = line.charAt(0);
                if (first === '@') {
                    result.type = Y.E2.ProgLanguage.TYPE.KEYWORD;
                } else if (first === '+') {
                    result.type = Y.E2.ProgLanguage.TYPE.VARIABLE;
                } else if (first === '-') {
                    result.type = Y.E2.ProgLanguage.TYPE.DEFINITION;
                } else {
                    result.type = Y.E2.ProgLanguage.TYPE.DEFAULT;
                }
                return result;
            }
            return null;
        }
    }, {
        ATTRS: {
            name: {
                value: 'diff'
            },

            aliases: {
                value: ['diff', 'patch']
            }
        }
    });

    Y.namespace('E2.ProgLang').All = new Y.E2.ProgLanguages();

    Y.E2.ProgLang.All.add(new Y.E2.ProgLang.Plain());
    Y.E2.ProgLang.All.add(new Y.E2.ProgLang.Diff());

}, '1.0', {
    requires: [
        'model',
        'model-list',
        'e2-stream'
    ]
});
