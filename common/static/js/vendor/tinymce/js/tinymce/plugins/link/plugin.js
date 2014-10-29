tinymce.PluginManager.add("link", function(e) {
    function t(t) {
        return function() {
            var n = e.settings.link_list;
            "string" == typeof n ? tinymce.util.XHR.send({
                url: n,
                success: function(e) {
                    t(tinymce.util.JSON.parse(e))
                }
            }) : t(n)
        }
    }

    function n(t) {
        function n(e) {
            var t = f.find("#text");
            (!t.value() || e.lastControl && t.value() == e.lastControl.text()) && t.value(e.control.text()), f.find("#href").value(e.control.value())
        }

        function l() {
            var n = [{
                text: "None",
                value: ""
            }];
            return tinymce.each(t, function(t) {
                n.push({
                    text: t.text || t.title,
                    value: e.convertURL(t.value || t.url, "href"),
                    menu: t.menu
                })
            }), n
        }

        function i(t) {
            var n = [{
                text: "None",
                value: ""
            }];
            return tinymce.each(e.settings.rel_list, function(e) {
                n.push({
                    text: e.text || e.title,
                    value: e.value,
                    selected: t === e.value
                })
            }), n
        }

        function r(t) {
            var n = [];
            return e.settings.target_list || (n.push({
                text: "None",
                value: ""
            }), n.push({
                text: "New window",
                value: "_blank"
            })), tinymce.each(e.settings.target_list, function(e) {
                n.push({
                    text: e.text || e.title,
                    value: e.value,
                    selected: t === e.value
                })
            }), n
        }

        function a(t) {
            var l = [];
            return tinymce.each(e.dom.select("a:not([href])"), function(e) {
                var n = e.name || e.id;
                n && l.push({
                    text: n,
                    value: "#" + n,
                    selected: -1 != t.indexOf("#" + n)
                })
            }), l.length ? (l.unshift({
                text: "None",
                value: ""
            }), {
                name: "anchor",
                type: "listbox",
                label: "Anchors",
                values: l,
                onselect: n
            }) : void 0
        }

        function o() {
            h && h.value(e.convertURL(this.value(), "href")), !c && 0 === x.text.length && k && this.parent().parent().find("#text")[0].value(this.value())
        }
        var u, s, c, f, d, h, v, g, x = {},
            m = e.selection,
            p = e.dom;
        u = m.getNode(), s = p.getParent(u, "a[href]");
        var k = !0;
        if (/</.test(m.getContent())) k = !1;
        else if (s) {
            var y, b = s.childNodes;
            if (0 === b.length) k = !1;
            else
                for (y = b.length - 1; y >= 0; y--)
                    if (3 != b[y].nodeType) {
                        k = !1;
                        break
                    }
        }
        x.text = c = s ? s.innerText || s.textContent : m.getContent({
            format: "text"
        }), x.href = s ? p.getAttrib(s, "href") : "", x.target = s ? p.getAttrib(s, "target") : e.settings.default_link_target || "", x.rel = s ? p.getAttrib(s, "rel") : "", e.fire('EditLink', x), k && (d = {
            name: "text",
            type: "textbox",
            size: 40,
            label: "Text to display",
            onchange: function() {
                x.text = this.value()
            }
        }), t && (h = {
            type: "listbox",
            label: "Link list",
            values: l(),
            onselect: n,
            value: e.convertURL(x.href, "href"),
            onPostRender: function() {
                h = this
            }
        }), e.settings.target_list !== !1 && (g = {
            name: "target",
            type: "listbox",
            label: "Target",
            values: r(x.target)
        }), e.settings.rel_list && (v = {
            name: "rel",
            type: "listbox",
            label: "Rel",
            values: i(x.rel)
        }), f = e.windowManager.open({
            title: "Insert link",
            data: x,
            body: [{
                    name: "href",
                    type: "filepicker",
                    filetype: "file",
                    size: 40,
                    autofocus: !0,
                    label: "Url",
                    onchange: o,
                    onkeyup: o
                },
                d, a(x.href), h, v, g
            ],
            onSubmit: function(t) {
                function n(t, n) {
                    var l = e.selection.getRng();
                    window.setTimeout(function() {
                        e.windowManager.confirm(t, function(t) {
                            e.selection.setRng(l), n(t)
                        })
                    }, 0)
                }

                function l() {
                    s ? (e.focus(), k && i.text != c && (s.innerText = i.text), p.setAttribs(s, {
                        href: r,
                        target: i.target ? i.target : null,
                        rel: i.rel ? i.rel : null
                    }), m.select(s), e.undoManager.add()) : k ? e.insertContent(p.createHTML("a", {
                        href: r,
                        target: i.target ? i.target : null,
                        rel: i.rel ? i.rel : null
                    }, p.encode(i.text))) : e.execCommand("mceInsertLink", !1, {
                        href: r,
                        target: i.target,
                        rel: i.rel ? i.rel : null
                    })
                }
                var i = t.data;
                e.fire('SaveLink', i);
                var r = i.href;
                /* HEBS - Change the email address detection, which mistakenly detected Split asset keys as email addresses.
                         Instead, if the link has a "@" sign *and* a colon, do not consider it an email address. */
                return r ? r.indexOf("@") > 0 && -1 == r.indexOf("//") && -1 == r.indexOf(":") ? void n("The URL you entered seems to be an email address. Do you want to add the required mailto: prefix?", function(e) {
                    e && (r = "mailto:" + r), l()
                }) : /^\s*www\./i.test(r) ? void n("The URL you entered seems to be an external link. Do you want to add the required http:// prefix?", function(e) {
                    e && (r = "http://" + r), l()
                }) : void l() : void e.execCommand("unlink")
            }
        })
    }
    e.addButton("link", {
        icon: "link",
        tooltip: "Insert/edit link",
        shortcut: "Ctrl+K",
        onclick: t(n),
        stateSelector: "a[href]"
    }), e.addButton("unlink", {
        icon: "unlink",
        tooltip: "Remove link",
        cmd: "unlink",
        stateSelector: "a[href]"
    }), e.addShortcut("Ctrl+K", "", t(n)), this.showDialog = n, e.addMenuItem("link", {
        icon: "link",
        text: "Insert link",
        shortcut: "Ctrl+K",
        onclick: t(n),
        stateSelector: "a[href]",
        context: "insert",
        prependToContext: !0
    })
});
