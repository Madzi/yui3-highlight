YUI.add('e2-stream', function (Y) {

    Y.namespace('E2').StringStream = Y.Base.create('e2-string-stream', Y.Base, [], {
        skipBlank: function () {
            var ch = this.peek();
            while (/\s/.test(ch)) {
                ch = this.read();
                ch = this.peek();
            }
        },

        readLine: function () {
            var line = '',
                ch = this.peek();

            if (!this.eot()) {

                while (ch && ch !== '\n') {
                    ch = this.read();
                    line += ch;
                    ch = this.peek();
                }

                return line;
            }
            return null;
        },

        readWord: function () {
            var word = '',
                ch = this.peek();

            while (/[a-zA-Z_]/.test(ch)) {
                ch = this.read();
                word += ch;
                ch = this.peek();
            }
            return word;
        },

        read: function () {
            var pos = this.getPos(),
                ch = this.peek();

            if (ch) {
                pos += 1;
                this.setPos(pos);
            }
            return ch;
        },

        peek: function () {
            var pos = this.getPos(),
                buf = this.getBuf();

            if (buf && buf.length > pos) {
                return buf.charAt(pos);
            }
            return null;
        },

        back: function (n) {
            var pos = this.getPos();

            pos -= n;
            this.setPos(pos < 0 ? 0 : pos);
        },

        newLine: function () {
            var pos = this.getPos();

            return (pos === 0) || this.peek() === '\n';
        },

        eot: function () {
            var buf = this.getBuf(),
                pos = this.getPos();

            return !(buf && buf.length > pos);
        },

        getBuf: function () {
            return this.get('buf');
        },

        setBuf: function (buf) {
            return this.set('buf', buf);
        },

        getPos: function () {
            return this.get('pos');
        },

        setPos: function (pos) {
            return this.set('pos', pos);
        }
    }, {
        ATTRS: {
            buf: {
                value: null,
                validator: Y.Lang.isString
            },
            pos: {
                value: 0,
                validator: Y.Lang.isNumber
            }
        }
    });

}, '1.0', {
    requires: [
        'base'
    ]
});