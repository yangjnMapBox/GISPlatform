!
function(e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
    else if ("function" == typeof define && define.amd) define([], e);
    else {
        var t;
        t = "undefined" != typeof window ? window: "undefined" != typeof global ? global: "undefined" != typeof self ? self: this,
        t.MapboxGeocoder = e()
    }
} (function() {
    var e;
    return function() {
        function e(t, n, r) {
            function i(o, a) {
                if (!n[o]) {
                    if (!t[o]) {
                        var u = "function" == typeof require && require;
                        if (!a && u) return u(o, !0);
                        if (s) return s(o, !0);
                        var l = new Error("Cannot find module '" + o + "'");
                        throw l.code = "MODULE_NOT_FOUND",
                        l
                    }
                    var c = n[o] = {
                        exports: {}
                    };
                    t[o][0].call(c.exports,
                    function(e) {
                        return i(t[o][1][e] || e)
                    },
                    c, c.exports, e, t, n, r)
                }
                return n[o].exports
            }
            for (var s = "function" == typeof require && require,
            o = 0; o < r.length; o++) i(r[o]);
            return i
        }
        return e
    } ()({
        1 : [function(e, t, n) {
            "use strict";
            function r(e) {
                this.origin = e.origin || "https://api.mapbox.com",
                this.endpoint = "events/v2",
                this.access_token = e.accessToken,
                this.version = "0.2.0",
                this.sessionID = this.generateSessionID(),
                this.userAgent = this.getUserAgent(),
                this.options = e,
                this.send = this.send.bind(this),
                this.countries = e.countries ? e.countries.split(",") : null,
                this.types = e.types ? e.types.split(",") : null,
                this.bbox = e.bbox ? e.bbox: null,
                this.language = e.language ? e.language.split(",") : null,
                this.limit = e.limit ? +e.limit: null,
                this.locale = navigator.language || null,
                this.enableEventLogging = this.shouldEnableLogging(e),
                this.eventQueue = new Array,
                this.flushInterval = e.flushInterval || 1e3,
                this.maxQueueSize = e.maxQueueSize || 100,
                this.timer = this.flushInterval ? setTimeout(this.flush.bind(this), this.flushInterval) : null,
                this.lastSentInput = "",
                this.lastSentIndex = 0
            }
            var i = e("nanoid");
            r.prototype = {
                select: function(e, t) {
                    var n = this.getSelectedIndex(e, t),
                    r = this.getEventPayload("search.select", t);
                    if (r.resultIndex = n, r.resultPlaceName = e.place_name, r.resultId = e.id, (n !== this.lastSentIndex || r.queryString !== this.lastSentInput) && -1 != n && (this.lastSentIndex = n, this.lastSentInput = r.queryString, r.queryString)) return this.push(r)
                },
                start: function(e) {
                    var t = this.getEventPayload("search.start", e);
                    if (t.queryString) return this.push(t)
                },
                keyevent: function(e, t) {
                    if (e.key && !e.metaKey && -1 === [9, 27, 37, 39, 13, 38, 40].indexOf(e.keyCode)) {
                        var n = this.getEventPayload("search.keystroke", t);
                        if (n.lastAction = e.key, n.queryString) return this.push(n)
                    }
                },
                send: function(e, t) {
                    if (this.enableEventLogging) {
                        var n = this.getRequestOptions(e);
                        this.request(n,
                        function(e) {
                            return e ? this.handleError(e, t) : t ? t() : void 0
                        }.bind(this))
                    } else if (t) return t()
                },
                getRequestOptions: function(e) {
                    return Array.isArray(e) || (e = [e]),
                    {
                        method: "POST",
                        host: this.origin,
                        path: this.endpoint + "?access_token=" + this.access_token,
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(e)
                    }
                },
                getEventPayload: function(e, t) {
                    var n;
                    n = t.options.proximity ? [t.options.proximity.longitude, t.options.proximity.latitude] : null;
                    var r = t._map ? t._map.getZoom() : null,
                    i = {
                        event: e,
                        created: +new Date,
                        sessionIdentifier: this.sessionID,
                        country: this.countries,
                        userAgent: this.userAgent,
                        language: this.language,
                        bbox: this.bbox,
                        types: this.types,
                        endpoint: "mapbox.places",
                        proximity: n,
                        limit: t.options.limit,
                        mapZoom: r,
                        keyboardLocale: this.locale
                    };
                    return "search.select" === e ? i.queryString = t.inputString: "search.select" != e && t._inputEl ? i.queryString = t._inputEl.value: i.queryString = t.inputString,
                    i
                },
                request: function(e, t) {
                    var n = new XMLHttpRequest;
                    n.onreadystatechange = function() {
                        if (4 == this.readyState) return t(204 == this.status ? null: this.statusText)
                    },
                    n.open(e.method, e.host + "/" + e.path, !0);
                    for (var r in e.headers) {
                        var i = e.headers[r];
                        n.setRequestHeader(r, i)
                    }
                    n.send(e.body)
                },
                handleError: function(e, t) {
                    if (t) return t(e)
                },
                generateSessionID: function() {
                    return i()
                },
                getUserAgent: function() {
                    return "mapbox-gl-geocoder." + this.version + "." + navigator.userAgent
                },
                getSelectedIndex: function(e, t) {
                    if (t._typeahead) {
                        var n = t._typeahead.data,
                        r = e.id;
                        return n.map(function(e) {
                            return e.id
                        }).indexOf(r)
                    }
                },
                shouldEnableLogging: function(e) {
                    return ! 1 !== e.enableEventLogging && ((!e.origin || -1 != e.origin.indexOf("api.mapbox.com")) && (!e.localGeocoder && !e.filter))
                },
                flush: function() {
                    this.eventQueue.length > 0 && (this.send(this.eventQueue), this.eventQueue = new Array),
                    this.timer && clearTimeout(this.timer),
                    this.flushInterval && (this.timer = setTimeout(this.flush.bind(this), this.flushInterval))
                },
                push: function(e, t) {
                    this.eventQueue.push(e),
                    (this.eventQueue.length >= this.maxQueueSize || t) && this.flush()
                },
                remove: function() {
                    this.flush()
                }
            },
            t.exports = r
        },
        {
            nanoid: 30
        }],
        2 : [function(e, t, n) {
            t.exports = {
                fr: {
                    name: "France",
                    bbox: [[ - 4.59235, 41.380007], [9.560016, 51.148506]]
                },
                us: {
                    name: "United States",
                    bbox: [[ - 171.791111, 18.91619], [ - 66.96466, 71.357764]]
                },
                ru: {
                    name: "Russia",
                    bbox: [[19.66064, 41.151416], [190.10042, 81.2504]]
                },
                ca: {
                    name: "Canada",
                    bbox: [[ - 140.99778, 41.675105], [ - 52.648099, 83.23324]]
                }
            }
        },
        {}],
        3 : [function(e, t, n) {
            "use strict";
            function r(e) {
                this._eventEmitter = new a,
                this.options = o({},
                this.options, e),
                this.inputString = "",
                this.fresh = !0,
                this.lastSelected = null
            }
            var i = e("suggestions"),
            s = e("lodash.debounce"),
            o = e("xtend"),
            a = e("events").EventEmitter,
            u = e("./exceptions"),
            l = e("@mapbox/mapbox-sdk"),
            c = e("@mapbox/mapbox-sdk/services/geocoding"),
            h = e("./events"),
            p = e("./localization"),
            f = e("subtag");
            r.prototype = {
                options: {
                    zoom: 16,
                    flyTo: !0,
                    trackProximity: !0,
                    minLength: 2,
                    reverseGeocode: !1,
                    limit: 5,
                    origin: "https://api.mapbox.com",
                    enableEventLogging: !0,
                    marker: !0,
                    mapboxgl: null,
                    collapsed: !1,
                    clearAndBlurOnEsc: !1,
                    clearOnBlur: !1,
                    getItemValue: function(e) {
                        return e.place_name
                    },
                    render: function(e) {
                        var t = e.place_name.split(",");
                        return '<div class="mapboxgl-ctrl-geocoder--suggestion"><div class="mapboxgl-ctrl-geocoder--suggestion-title">' + t[0] + '</div><div class="mapboxgl-ctrl-geocoder--suggestion-address">' + t.splice(1, t.length).join(",") + "</div></div>"
                    }
                },
                onAdd: function(e) {
                    this._map = e,
                    this.setLanguage(),
                    this.geocoderService = c(l({
                        accessToken: this.options.accessToken,
                        origin: this.options.origin
                    })),
                    this.eventManager = new h(this.options),
                    this._onChange = this._onChange.bind(this),
                    this._onKeyDown = this._onKeyDown.bind(this),
                    this._onBlur = this._onBlur.bind(this),
                    this._showButton = this._showButton.bind(this),
                    this._hideButton = this._hideButton.bind(this),
                    this._onQueryResult = this._onQueryResult.bind(this),
                    this.clear = this.clear.bind(this),
                    this._updateProximity = this._updateProximity.bind(this),
                    this._collapse = this._collapse.bind(this),
                    this._unCollapse = this._unCollapse.bind(this),
                    this._clear = this._clear.bind(this),
                    this._clearOnBlur = this._clearOnBlur.bind(this);
                    var t = this.container = document.createElement("div");
                    t.className = "mapboxgl-ctrl-geocoder mapboxgl-ctrl";
                    var n = this.createIcon("search", '<path d="M7.4 2.5c-2.7 0-4.9 2.2-4.9 4.9s2.2 4.9 4.9 4.9c1 0 1.8-.2 2.5-.8l3.7 3.7c.2.2.4.3.8.3.7 0 1.1-.4 1.1-1.1 0-.3-.1-.5-.3-.8L11.4 10c.4-.8.8-1.6.8-2.5.1-2.8-2.1-5-4.8-5zm0 1.6c1.8 0 3.2 1.4 3.2 3.2s-1.4 3.2-3.2 3.2-3.3-1.3-3.3-3.1 1.4-3.3 3.3-3.3z"/>');
                    this._inputEl = document.createElement("input"),
                    this._inputEl.type = "text",
                    this._inputEl.className = "mapboxgl-ctrl-geocoder--input",
                    this.setPlaceholder(),
                    this.options.collapsed && (this._collapse(), this.container.addEventListener("mouseenter", this._unCollapse), this.container.addEventListener("mouseleave", this._collapse), this._inputEl.addEventListener("focus", this._unCollapse)),
                    (this.options.collapsed || this.options.clearOnBlur) && this._inputEl.addEventListener("blur", this._onBlur),
                    this._inputEl.addEventListener("keydown", s(this._onKeyDown, 200)),
                    this._inputEl.addEventListener("change", this._onChange),
                    this.container.addEventListener("mouseenter", this._showButton),
                    this.container.addEventListener("mouseleave", this._hideButton),
                    this._inputEl.addEventListener("keyup",
                    function(e) {
                        this.eventManager.keyevent(e, this)
                    }.bind(this));
                    var r = document.createElement("div");
                    r.classList.add("mapboxgl-ctrl-geocoder--pin-right"),
                    this._clearEl = document.createElement("button"),
                    this._clearEl.setAttribute("aria-label", "Clear"),
                    this._clearEl.addEventListener("click", this.clear),
                    this._clearEl.className = "mapboxgl-ctrl-geocoder--button";
                    var o = this.createIcon("close", '<path d="M3.8 2.5c-.6 0-1.3.7-1.3 1.3 0 .3.2.7.5.8L7.2 9 3 13.2c-.3.3-.5.7-.5 1 0 .6.7 1.3 1.3 1.3.3 0 .7-.2 1-.5L9 10.8l4.2 4.2c.2.3.7.3 1 .3.6 0 1.3-.7 1.3-1.3 0-.3-.2-.7-.3-1l-4.4-4L15 4.6c.3-.2.5-.5.5-.8 0-.7-.7-1.3-1.3-1.3-.3 0-.7.2-1 .3L9 7.1 4.8 2.8c-.3-.1-.7-.3-1-.3z"/>');
                    return this._clearEl.appendChild(o),
                    this._loadingEl = this.createIcon("loading", '<path fill="#333" d="M4.4 4.4l.8.8c2.1-2.1 5.5-2.1 7.6 0l.8-.8c-2.5-2.5-6.7-2.5-9.2 0z"/><path opacity=".1" d="M12.8 12.9c-2.1 2.1-5.5 2.1-7.6 0-2.1-2.1-2.1-5.5 0-7.7l-.8-.8c-2.5 2.5-2.5 6.7 0 9.2s6.6 2.5 9.2 0 2.5-6.6 0-9.2l-.8.8c2.2 2.1 2.2 5.6 0 7.7z"/>'),
                    r.appendChild(this._clearEl),
                    r.appendChild(this._loadingEl),
                    t.appendChild(n),
                    t.appendChild(this._inputEl),
                    t.appendChild(r),
                    this._typeahead = new i(this._inputEl, [], {
                        filter: !1,
                        minLength: this.options.minLength,
                        limit: this.options.limit
                    }),
                    this.setRenderFunction(this.options.render),
                    this._typeahead.getItemValue = this.options.getItemValue,
                    this.options.trackProximity && (this._updateProximity(), this._map.on("moveend", this._updateProximity)),
                    this.mapMarker = null,
                    this._handleMarker = this._handleMarker.bind(this),
                    this._mapboxgl = this.options.mapboxgl,
                    !this._mapboxgl && this.options.marker && (console.error("No mapboxgl detected in options. Map markers are disabled. Please set options.mapboxgl."), this.options.marker = !1),
                    t
                },
                createIcon: function(e, t) {
                    var n = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    return n.setAttribute("class", "mapboxgl-ctrl-geocoder--icon mapboxgl-ctrl-geocoder--icon-" + e),
                    n.setAttribute("viewBox", "0 0 18 18"),
                    n.setAttribute("xml:space", "preserve"),
                    n.setAttribute("width", 18),
                    n.setAttribute("height", 18),
                    n.innerHTML = t,
                    n
                },
                onRemove: function() {
                    return this.container.parentNode.removeChild(this.container),
                    this.options.trackProximity && this._map.off("moveend", this._updateProximity),
                    this._removeMarker(),
                    this._map = null,
                    this
                },
                _onKeyDown: function(e) {
                    if (27 === e.keyCode && this.options.clearAndBlurOnEsc) return this._clear(e),
                    this._inputEl.blur();
                    var t = e.target && e.target.shadowRoot ? e.target.shadowRoot.activeElement: e.target;
                    if (! (t ? t.value: "")) return this.fresh = !0,
                    9 !== e.keyCode && this.clear(e),
                    this._clearEl.style.display = "none";
                    e.metaKey || -1 !== [9, 27, 37, 39, 13, 38, 40].indexOf(e.keyCode) || t.value.length >= this.options.minLength && this._geocode(t.value)
                },
                _showButton: function() {
                    this._typeahead.selected && (this._clearEl.style.display = "block")
                },
                _hideButton: function() {
                    this._typeahead.selected && (this._clearEl.style.display = "none")
                },
                _onBlur: function(e) {
                    this.options.clearOnBlur && this._clearOnBlur(e),
                    this.options.collapsed && this._collapse()
                },
                _onChange: function() {
                    var e = this._typeahead.selected;
                    if (e && e.id !== this.lastSelected) {
                        if (this._clearEl.style.display = "none", this.options.flyTo) {
                            var t;
                            if (e.properties && !u[e.properties.short_code] && e.bbox) {
                                var n = e.bbox;
                                t = o({},
                                this.options.flyTo),
                                this._map.fitBounds([[n[0], n[1]], [n[2], n[3]]], t)
                            } else if (e.properties && u[e.properties.short_code]) t = o({},
                            this.options.flyTo),
                            this._map.fitBounds(u[e.properties.short_code].bbox, t);
                            else {
                                var r = {
                                    zoom: this.options.zoom
                                };
                                t = o({},
                                r, this.options.flyTo),
                                t.center = e.center,
                                this._map.flyTo(t)
                            }
                        }
                        this.options.marker && this._mapboxgl && this._handleMarker(e),
                        this._inputEl.focus(),
                        this._inputEl.scrollLeft = 0,
                        this._inputEl.setSelectionRange(0, 0),
                        this._eventEmitter.emit("result", {
                            result: e
                        }),
                        this.eventManager.select(e, this),
                        this.lastSelected = e.id
                    }
                },
                _geocode: function(e) {
                    this._loadingEl.style.display = "block",
                    this._eventEmitter.emit("loading", {
                        query: e
                    }),
                    this.inputString = e;
                    var t, n = ["bbox", "limit", "proximity", "countries", "types", "language", "reverseMode", "mode"],
                    r = this,
                    i = n.reduce(function(e, t) {
                        return r.options[t] && (["countries", "types", "language"].indexOf(t) > -1 ? e[t] = r.options[t].split(/[\s,]+/) : e[t] = r.options[t], "proximity" === t && r.options[t] && r.options[t].longitude && r.options[t].latitude && (e[t] = [r.options[t].longitude, r.options[t].latitude])),
                        e
                    },
                    {});
                    if (this.options.reverseGeocode && /(-?\d+\.?\d*)[, ]+(-?\d+\.?\d*)[ ]*$/.test(e)) {
                        var s = e.split(/[\s(,)?]+/).map(function(e) {
                            return parseFloat(e, 10)
                        }).reverse();
                        i.types && i.types[0],
                        i = o(i, {
                            query: s,
                            limit: 1
                        }),
                        t = this.geocoderService.reverseGeocode(i).send()
                    } else i = o(i, {
                        query: e
                    }),
                    t = this.geocoderService.forwardGeocode(i).send();
                    var a = [];
                    return this.options.localGeocoder && ((a = this.options.localGeocoder(e)) || (a = [])),
                    t.then(function(e) {
                        this._loadingEl.style.display = "none";
                        var t = {};
                        "200" == e.statusCode && (t = e.body),
                        t.config = i,
                        this.fresh && (this.eventManager.start(this), this.fresh = !1),
                        t.features = t.features ? a.concat(t.features) : a,
                        this.options.filter && t.features.length && (t.features = t.features.filter(this.options.filter)),
                        t.features.length ? (this._clearEl.style.display = "block", this._eventEmitter.emit("results", t), this._typeahead.update(t.features)) : (this._clearEl.style.display = "none", this._typeahead.selected = null, this._renderNoResults(), this._eventEmitter.emit("results", t))
                    }.bind(this)),
                    t.
                    catch(function(e) {
                        this._loadingEl.style.display = "none",
                        a.length && this.options.localGeocoder ? (this._clearEl.style.display = "block", this._typeahead.update(a)) : (this._clearEl.style.display = "none", this._typeahead.selected = null, this._renderError()),
                        this._eventEmitter.emit("results", {
                            features: a
                        }),
                        this._eventEmitter.emit("error", {
                            error: e
                        })
                    }.bind(this)),
                    t
                },
                _clear: function(e) {
                    e && e.preventDefault(),
                    this._inputEl.value = "",
                    this._typeahead.selected = null,
                    this._typeahead.clear(),
                    this._onChange(),
                    this._clearEl.style.display = "none",
                    this._removeMarker(),
                    this.lastSelected = null,
                    this._eventEmitter.emit("clear"),
                    this.fresh = !0
                },
                clear: function(e) {
                    this._clear(e),
                    this._inputEl.focus()
                },
                _clearOnBlur: function(e) {
                    var t = this;
                    e.relatedTarget && t._clear(e)
                },
                _onQueryResult: function(e) {
                    var t = e.body;
                    if (t.features.length) {
                        var n = t.features[0];
                        this._typeahead.selected = n,
                        this._inputEl.value = n.place_name,
                        this._onChange()
                    }
                },
                _updateProximity: function() {
                    if (this._map.getZoom() > 9) {
                        var e = this._map.getCenter().wrap();
                        this.setProximity({
                            longitude: e.lng,
                            latitude: e.lat
                        })
                    } else this.setProximity(null)
                },
                _collapse: function() {
                    this._inputEl.value || this._inputEl === document.activeElement || this.container.classList.add("mapboxgl-ctrl-geocoder--collapsed")
                },
                _unCollapse: function() {
                    this.container.classList.remove("mapboxgl-ctrl-geocoder--collapsed")
                },
                query: function(e) {
                    return this._geocode(e).then(this._onQueryResult),
                    this
                },
                _renderError: function() {
                    this._renderMessage("<div class='mapbox-gl-geocoder--error'>There was an error reaching the server</div>")
                },
                _renderNoResults: function() {
                    this._renderMessage("<div class='mapbox-gl-geocoder--error mapbox-gl-geocoder--no-results'>No results found</div>")
                },
                _renderMessage: function(e) {
                    this._typeahead.update([]),
                    this._typeahead.selected = null,
                    this._typeahead.clear(),
                    this._typeahead.renderError(e)
                },
                _getPlaceholderText: function() {
                    if (this.options.placeholder) return this.options.placeholder;
                    if (this.options.language) {
                        var e = this.options.language.split(",")[0],
                        t = f.language(e),
                        n = p.placeholder[t];
                        if (n) return n
                    }
                    return "Search"
                },
                setInput: function(e) {
                    return this._inputEl.value = e,
                    this._typeahead.selected = null,
                    this._typeahead.clear(),
                    this._onChange(),
                    this
                },
                setProximity: function(e) {
                    return this.options.proximity = e,
                    this
                },
                getProximity: function() {
                    return this.options.proximity
                },
                setRenderFunction: function(e) {
                    return e && "function" == typeof e && (this._typeahead.render = e),
                    this
                },
                getRenderFunction: function() {
                    return this._typeahead.render
                },
                setLanguage: function(e) {
                    var t = navigator.language || navigator.userLanguage || navigator.browserLanguage;
                    return this.options.language = e || this.options.language || t,
                    this
                },
                getLanguage: function() {
                    return this.options.language
                },
                getZoom: function() {
                    return this.options.zoom
                },
                setZoom: function(e) {
                    return this.options.zoom = e,
                    this
                },
                getFlyTo: function() {
                    return this.options.flyTo
                },
                setFlyTo: function(e) {
                    return this.options.flyTo = e,
                    this
                },
                getPlaceholder: function() {
                    return this.options.placeholder
                },
                setPlaceholder: function(e) {
                    return this.placeholder = e || this._getPlaceholderText(),
                    this._inputEl.placeholder = this.placeholder,
                    this
                },
                getBbox: function() {
                    return this.options.bbox
                },
                setBbox: function(e) {
                    return this.options.bbox = e,
                    this
                },
                getCountries: function() {
                    return this.options.countries
                },
                setCountries: function(e) {
                    return this.options.countries = e,
                    this
                },
                getTypes: function() {
                    return this.options.types
                },
                setTypes: function(e) {
                    return this.options.types = e,
                    this
                },
                getMinLength: function() {
                    return this.options.minLength
                },
                setMinLength: function(e) {
                    return this.options.minLength = e,
                    this._typeahead && (this._typeahead.minLength = e),
                    this
                },
                getLimit: function() {
                    return this.options.limit
                },
                setLimit: function(e) {
                    return this.options.limit = e,
                    this._typeahead && (this._typeahead.options.limit = e),
                    this
                },
                getFilter: function() {
                    return this.options.filter
                },
                setFilter: function(e) {
                    return this.options.filter = e,
                    this
                },
                _handleMarker: function(e) {
                    this._removeMarker();
                    var t = {
                        color: "#4668F2"
                    },
                    n = o({},
                    t, this.options.marker);
                    return this.mapMarker = new this._mapboxgl.Marker(n),
                    this.mapMarker.setLngLat(e.center).addTo(this._map),
                    this
                },
                _removeMarker: function() {
                    this.mapMarker && (this.mapMarker.remove(), this.mapMarker = null)
                },
                on: function(e, t) {
                    return this._eventEmitter.on(e, t),
                    this
                },
                off: function(e, t) {
                    return this._eventEmitter.removeListener(e, t),
                    this.eventManager.remove(),
                    this
                }
            },
            t.exports = r
        },
        {
            "./events": 1,
            "./exceptions": 2,
            "./localization": 4,
            "@mapbox/mapbox-sdk": 6,
            "@mapbox/mapbox-sdk/services/geocoding": 17,
            events: 25,
            "lodash.debounce": 29,
            subtag: 32,
            suggestions: 33,
            xtend: 36
        }],
        4 : [function(e, t, n) {
            "use strict";
            var r = {
                de: "Suche",
                it: "Ricerca",
                en: "Search",
                nl: "Zoeken",
                fr: "Chercher",
                ca: "Cerca",
                he: "לחפש",
                ja: "サーチ",
                lv: "Meklēt",
                pt: "Procurar",
                sr: "Претрага",
                zh: "搜索",
                cs: "Vyhledávání",
                hu: "Keresés",
                ka: "ძიება",
                nb: "Søke",
                sk: "Vyhľadávanie",
                th: "ค้นหา",
                fi: "Hae",
                is: "Leita",
                ko: "수색",
                pl: "Szukaj",
                sl: "Iskanje"
            };
            t.exports = {
                placeholder: r
            }
        },
        {}],
        5 : [function(e, t, n) {
            "use strict";
            function r(e) {
                var t = Array.isArray(e),
                n = function(n) {
                    return t ? e[n] : e
                };
                return function(r) {
                    var s = i(v.plainArray, r);
                    if (s) return s;
                    if (t && r.length !== e.length) return "an array with " + e.length + " items";
                    for (var o = 0; o < r.length; o++) if (s = i(n(o), r[o])) return [o].concat(s)
                }
            }
            function i(e, t) {
                if (null != t || e.hasOwnProperty("__required")) {
                    var n = e(t);
                    return n ? Array.isArray(n) ? n: [n] : void 0
                }
            }
            function s(e, t) {
                var n = e.length,
                r = e[n - 1],
                i = e.slice(0, n - 1);
                return 0 === i.length && (i = [d]),
                t = f(t, {
                    path: i
                }),
                "function" == typeof r ? r(t) : l(t, a(r))
            }
            function o(e) {
                return e.length < 2 ? e[0] : 2 === e.length ? e.join(" or ") : e.slice(0, -1).join(", ") + ", or " + e.slice( - 1)
            }
            function a(e) {
                return "must be " + u(e) + "."
            }
            function u(e) {
                return /^an? /.test(e) ? e: /^[aeiou]/i.test(e) ? "an " + e: /^[a-z]/i.test(e) ? "a " + e: e
            }
            function l(e, t) {
                var n = c(e.path),
                r = e.path.join(".") + " " + t;
                return (n ? "Item at position ": "") + r
            }
            function c(e) {
                return "number" == typeof e[e.length - 1] || "number" == typeof e[0]
            }
            function h(e) {
                return Object.keys(e || {}).map(function(t) {
                    return {
                        key: t,
                        value: e[t]
                    }
                })
            }
            var p = e("is-plain-obj"),
            f = e("xtend"),
            d = "value",
            v = {};
            v.assert = function(e, t) {
                return t = t || {},
                function(n) {
                    var r = i(e, n);
                    if (r) {
                        var o = s(r, t);
                        throw t.apiName && (o = t.apiName + ": " + o),
                        new Error(o)
                    }
                }
            },
            v.shape = function(e) {
                var t = h(e);
                return function(e) {
                    var n = i(v.plainObject, e);
                    if (n) return n;
                    for (var r, o, a = [], u = 0; u < t.length; u++) r = t[u].key,
                    o = t[u].value,
                    (n = i(o, e[r])) && a.push([r].concat(n));
                    return a.length < 2 ? a[0] : function(e) {
                        a = a.map(function(t) {
                            return "- " + t[0] + ": " + s(t, e).split("\n").join("\n  ")
                        });
                        var t = e.path.join(".");
                        return "The following properties" + (t === d ? "": " of " + t) + " have invalid values:\n  " + a.join("\n  ")
                    }
                }
            },
            v.strictShape = function(e) {
                var t = v.shape(e);
                return function(n) {
                    var r = t(n);
                    if (r) return r;
                    var i = Object.keys(n).reduce(function(t, n) {
                        return void 0 === e[n] && t.push(n),
                        t
                    },
                    []);
                    return 0 !== i.length ?
                    function() {
                        return "The following keys are invalid: " + i.join(", ")
                    }: void 0
                }
            },
            v.arrayOf = function(e) {
                return r(e)
            },
            v.tuple = function() {
                return r(Array.isArray(arguments[0]) ? arguments[0] : Array.prototype.slice.call(arguments))
            },
            v.required = function(e) {
                function t(t) {
                    return null == t ?
                    function(e) {
                        return l(e, c(e.path) ? "cannot be undefined/null.": "is required.")
                    }: e.apply(this, arguments)
                }
                return t.__required = !0,
                t
            },
            v.oneOfType = function() {
                var e = Array.isArray(arguments[0]) ? arguments[0] : Array.prototype.slice.call(arguments);
                return function(t) {
                    var n = e.map(function(e) {
                        return i(e, t)
                    }).filter(Boolean);
                    if (n.length === e.length) return n.every(function(e) {
                        return 1 === e.length && "string" == typeof e[0]
                    }) ? o(n.map(function(e) {
                        return e[0]
                    })) : n.reduce(function(e, t) {
                        return t.length > e.length ? t: e
                    })
                }
            },
            v.equal = function(e) {
                return function(t) {
                    if (t !== e) return JSON.stringify(e)
                }
            },
            v.oneOf = function() {
                var e = Array.isArray(arguments[0]) ? arguments[0] : Array.prototype.slice.call(arguments),
                t = e.map(function(e) {
                    return v.equal(e)
                });
                return v.oneOfType.apply(this, t)
            },
            v.range = function(e) {
                var t = e[0],
                n = e[1];
                return function(e) {
                    if (i(v.number, e) || e < t || e > n) return "number between " + t + " & " + n + " (inclusive)"
                }
            },
            v.any = function() {},
            v.boolean = function(e) {
                if ("boolean" != typeof e) return "boolean"
            },
            v.number = function(e) {
                if ("number" != typeof e) return "number"
            },
            v.plainArray = function(e) {
                if (!Array.isArray(e)) return "array"
            },
            v.plainObject = function(e) {
                if (!p(e)) return "object"
            },
            v.string = function(e) {
                if ("string" != typeof e) return "string"
            },
            v.func = function(e) {
                if ("function" != typeof e) return "function"
            },
            v.validate = i,
            v.processMessage = s,
            t.exports = v
        },
        {
            "is-plain-obj": 28,
            xtend: 36
        }],
        6 : [function(e, t, n) {
            "use strict";
            var r = e("./lib/client");
            t.exports = r
        },
        {
            "./lib/client": 7
        }],
        7 : [function(e, t, n) {
            "use strict";
            function r(e) {
                o.call(this, e)
            }
            function i(e) {
                return new r(e)
            }
            var s = e("./browser-layer"),
            o = e("../classes/mapi-client");
            r.prototype = Object.create(o.prototype),
            r.prototype.constructor = r,
            r.prototype.sendRequest = s.browserSend,
            r.prototype.abortRequest = s.browserAbort,
            t.exports = i
        },
        {
            "../classes/mapi-client": 9,
            "./browser-layer": 8
        }],
        8 : [function(e, t, n) {
            "use strict";
            function r(e) {
                var t = f[e.id];
                t && (t.abort(), delete f[e.id])
            }
            function i(e, t) {
                return new l(e, {
                    body: t.response,
                    headers: p(t.getAllResponseHeaders()),
                    statusCode: t.status
                })
            }
            function s(e) {
                var t = e.total,
                n = e.loaded;
                return {
                    total: t,
                    transferred: n,
                    percent: 100 * n / t
                }
            }
            function o(e, t) {
                return new Promise(function(n, r) {
                    t.onprogress = function(t) {
                        e.emitter.emit(h.EVENT_PROGRESS_DOWNLOAD, s(t))
                    };
                    var i = e.file;
                    i && (t.upload.onprogress = function(t) {
                        e.emitter.emit(h.EVENT_PROGRESS_UPLOAD, s(t))
                    }),
                    t.onerror = function(e) {
                        r(e)
                    },
                    t.onabort = function() {
                        var t = new c({
                            request: e,
                            type: h.ERROR_REQUEST_ABORTED
                        });
                        r(t)
                    },
                    t.onload = function() {
                        if (delete f[e.id], t.status < 200 || t.status >= 400) {
                            var i = new c({
                                request: e,
                                body: t.response,
                                statusCode: t.status
                            });
                            return void r(i)
                        }
                        n(t)
                    };
                    var o = e.body;
                    "string" == typeof o ? t.send(o) : o ? t.send(JSON.stringify(o)) : i ? t.send(i) : t.send(),
                    f[e.id] = t
                }).then(function(t) {
                    return i(e, t)
                })
            }
            function a(e, t) {
                var n = e.url(t),
                r = new window.XMLHttpRequest;
                return r.open(e.method, n),
                Object.keys(e.headers).forEach(function(t) {
                    r.setRequestHeader(t, e.headers[t])
                }),
                r
            }
            function u(e) {
                return Promise.resolve().then(function() {
                    var t = a(e, e.client.accessToken);
                    return o(e, t)
                })
            }
            var l = e("../classes/mapi-response"),
            c = e("../classes/mapi-error"),
            h = e("../constants"),
            p = e("../helpers/parse-headers"),
            f = {};
            t.exports = {
                browserAbort: r,
                sendRequestXhr: o,
                browserSend: u,
                createRequestXhr: a
            }
        },
        {
            "../classes/mapi-error": 10,
            "../classes/mapi-response": 12,
            "../constants": 13,
            "../helpers/parse-headers": 14
        }],
        9 : [function(e, t, n) {
            "use strict";
            function r(e) {
                if (!e || !e.accessToken) throw new Error("Cannot create a client without an access token");
                i(e.accessToken),
                this.accessToken = e.accessToken,
                this.origin = e.origin || o.API_ORIGIN
            }
            var i = e("@mapbox/parse-mapbox-token"),
            s = e("./mapi-request"),
            o = e("../constants");
            r.prototype.createRequest = function(e) {
                return new s(this, e)
            },
            t.exports = r
        },
        {
            "../constants": 13,
            "./mapi-request": 11,
            "@mapbox/parse-mapbox-token": 23
        }],
        10 : [function(e, t, n) {
            "use strict";
            function r(e) {
                var t, n = e.type || i.ERROR_HTTP;
                if (e.body) try {
                    t = JSON.parse(e.body)
                } catch(n) {
                    t = e.body
                } else t = null;
                var r = e.message || null;
                r || ("string" == typeof t ? r = t: t && "string" == typeof t.message ? r = t.message: n === i.ERROR_REQUEST_ABORTED && (r = "Request aborted")),
                this.message = r,
                this.type = n,
                this.statusCode = e.statusCode || null,
                this.request = e.request,
                this.body = t
            }
            var i = e("../constants");
            t.exports = r
        },
        {
            "../constants": 13
        }],
        11 : [function(e, t, n) {
            "use strict";
            function r(e, t) {
                if (!e) throw new Error("MapiRequest requires a client");
                if (!t || !t.path || !t.method) throw new Error("MapiRequest requires an options object with path and method properties");
                var n = {};
                t.body && (n["content-type"] = "application/json");
                var r = s(n, t.headers),
                i = Object.keys(r).reduce(function(e, t) {
                    return e[t.toLowerCase()] = r[t],
                    e
                },
                {});
                this.id = l++,
                this._options = t,
                this.emitter = new o,
                this.client = e,
                this.response = null,
                this.error = null,
                this.sent = !1,
                this.aborted = !1,
                this.path = t.path,
                this.method = t.method,
                this.origin = t.origin || e.origin,
                this.query = t.query || {},
                this.params = t.params || {},
                this.body = t.body || null,
                this.file = t.file || null,
                this.headers = i
            }
            var i = e("@mapbox/parse-mapbox-token"),
            s = e("xtend"),
            o = e("eventemitter3"),
            a = e("../helpers/url-utils"),
            u = e("../constants"),
            l = 1;
            r.prototype.url = function(e) {
                var t = a.prependOrigin(this.path, this.origin);
                t = a.appendQueryObject(t, this.query);
                var n = this.params;
                if (e) {
                    t = a.appendQueryParam(t, "access_token", e);
                    var r = i(e).user;
                    n = s({
                        ownerId: r
                    },
                    n)
                }
                return t = a.interpolateRouteParams(t, n),
                t
            },
            r.prototype.send = function() {
                var e = this;
                if (e.sent) throw new Error("This request has already been sent. Check the response and error properties. Create a new request with clone().");
                return e.sent = !0,
                e.client.sendRequest(e).then(function(t) {
                    return e.response = t,
                    e.emitter.emit(u.EVENT_RESPONSE, t),
                    t
                },
                function(t) {
                    throw e.error = t,
                    e.emitter.emit(u.EVENT_ERROR, t),
                    t
                })
            },
            r.prototype.abort = function() {
                this._nextPageRequest && (this._nextPageRequest.abort(), delete this._nextPageRequest),
                this.response || this.error || this.aborted || (this.aborted = !0, this.client.abortRequest(this))
            },
            r.prototype.eachPage = function(e) {
                function t(t) {
                    function n() {
                        delete i._nextPageRequest;
                        var e = t.nextPage();
                        e && (i._nextPageRequest = e, r(e))
                    }
                    e(null, t, n)
                }
                function n(t) {
                    e(t, null,
                    function() {})
                }
                function r(e) {
                    e.send().then(t, n)
                }
                var i = this;
                r(this)
            },
            r.prototype.clone = function() {
                return this._extend()
            },
            r.prototype._extend = function(e) {
                var t = s(this._options, e);
                return new r(this.client, t)
            },
            t.exports = r
        },
        {
            "../constants": 13,
            "../helpers/url-utils": 16,
            "@mapbox/parse-mapbox-token": 23,
            eventemitter3: 26,
            xtend: 36
        }],
        12 : [function(e, t, n) {
            "use strict";
            function r(e, t) {
                this.request = e,
                this.headers = t.headers,
                this.rawBody = t.body,
                this.statusCode = t.statusCode;
                try {
                    this.body = JSON.parse(t.body || "{}")
                } catch(e) {
                    this.body = t.body
                }
                this.links = i(this.headers.link)
            }
            var i = e("../helpers/parse-link-header");
            r.prototype.hasNextPage = function() {
                return !! this.links.next
            },
            r.prototype.nextPage = function() {
                return this.hasNextPage() ? this.request._extend({
                    path: this.links.next.url
                }) : null
            },
            t.exports = r
        },
        {
            "../helpers/parse-link-header": 15
        }],
        13 : [function(e, t, n) {
            "use strict";
            t.exports = {
                API_ORIGIN: "https://api.mapbox.com",
                EVENT_PROGRESS_DOWNLOAD: "downloadProgress",
                EVENT_PROGRESS_UPLOAD: "uploadProgress",
                EVENT_ERROR: "error",
                EVENT_RESPONSE: "response",
                ERROR_HTTP: "HttpError",
                ERROR_REQUEST_ABORTED: "RequestAbortedError"
            }
        },
        {}],
        14 : [function(e, t, n) {
            "use strict";
            function r(e) {
                var t = e.indexOf(":");
                return {
                    name: e.substring(0, t).trim().toLowerCase(),
                    value: e.substring(t + 1).trim()
                }
            }
            function i(e) {
                var t = {};
                return e ? (e.trim().split(/[\r|\n]+/).forEach(function(e) {
                    var n = r(e);
                    t[n.name] = n.value
                }), t) : t
            }
            t.exports = i
        },
        {}],
        15 : [function(e, t, n) {
            "use strict";
            function r(e) {
                var t = e.match(/\s*(.+)\s*=\s*"?([^"]+)"?/);
                return t ? {
                    key: t[1],
                    value: t[2]
                }: null
            }
            function i(e) {
                var t = e.match(/<?([^>]*)>(.*)/);
                if (!t) return null;
                var n = t[1],
                i = t[2].split(";"),
                s = null,
                o = i.reduce(function(e, t) {
                    var n = r(t);
                    return n ? "rel" === n.key ? (s || (s = n.value), e) : (e[n.key] = n.value, e) : e
                },
                {});
                return s ? {
                    url: n,
                    rel: s,
                    params: o
                }: null
            }
            function s(e) {
                return e ? e.split(/,\s*</).reduce(function(e, t) {
                    var n = i(t);
                    return n ? (n.rel.split(/\s+/).forEach(function(t) {
                        e[t] || (e[t] = {
                            url: n.url,
                            params: n.params
                        })
                    }), e) : e
                },
                {}) : {}
            }
            t.exports = s
        },
        {}],
        16 : [function(e, t, n) {
            "use strict";
            function r(e) {
                return e.map(encodeURIComponent).join(",")
            }
            function i(e) {
                return Array.isArray(e) ? r(e) : encodeURIComponent(String(e))
            }
            function s(e, t, n) {
                if (!1 === n || null === n) return e;
                var r = /\?/.test(e) ? "&": "?",
                s = encodeURIComponent(t);
                return void 0 !== n && "" !== n && !0 !== n && (s += "=" + i(n)),
                "" + e + r + s
            }
            function o(e, t) {
                if (!t) return e;
                var n = e;
                return Object.keys(t).forEach(function(e) {
                    var r = t[e];
                    void 0 !== r && (Array.isArray(r) && (r = r.filter(function(e) {
                        return !! e
                    }).join(",")), n = s(n, e, r))
                }),
                n
            }
            function a(e, t) {
                if (!t) return e;
                if ("http" === e.slice(0, 4)) return e;
                var n = "/" === e[0] ? "": "/";
                return "" + t.replace(/\/$/, "") + n + e
            }
            function u(e, t) {
                return t ? e.replace(/\/:([a-zA-Z0-9]+)/g,
                function(e, n) {
                    var r = t[n];
                    if (void 0 === r) throw new Error("Unspecified route parameter " + n);
                    return "/" + i(r)
                }) : e
            }
            t.exports = {
                appendQueryObject: o,
                appendQueryParam: s,
                prependOrigin: a,
                interpolateRouteParams: u
            }
        },
        {}],
        17 : [function(e, t, n) {
            "use strict";
            var r = e("xtend"),
            i = e("./service-helpers/validator"),
            s = e("./service-helpers/pick"),
            o = e("./service-helpers/stringify-booleans"),
            a = e("./service-helpers/create-service-factory"),
            u = {},
            l = ["country", "region", "postcode", "district", "place", "locality", "neighborhood", "address", "poi", "poi.landmark"];
            u.forwardGeocode = function(e) {
                i.assertShape({
                    query: i.required(i.string),
                    mode: i.oneOf("mapbox.places", "mapbox.places-permanent"),
                    countries: i.arrayOf(i.string),
                    proximity: i.coordinates,
                    types: i.arrayOf(i.oneOf(l)),
                    autocomplete: i.boolean,
                    bbox: i.arrayOf(i.number),
                    limit: i.number,
                    language: i.arrayOf(i.string)
                })(e),
                e.mode = e.mode || "mapbox.places";
                var t = o(r({
                    country: e.countries
                },
                s(e, ["proximity", "types", "autocomplete", "bbox", "limit", "language"])));
                return this.client.createRequest({
                    method: "GET",
                    path: "/geocoding/v5/:mode/:query.json",
                    params: s(e, ["mode", "query"]),
                    query: t,
                    headers: {
                        abc: "124"
                    }
                })
            },
            u.reverseGeocode = function(e) {
                i.assertShape({
                    query: i.required(i.coordinates),
                    mode: i.oneOf("mapbox.places", "mapbox.places-permanent"),
                    countries: i.arrayOf(i.string),
                    types: i.arrayOf(i.oneOf(l)),
                    bbox: i.arrayOf(i.number),
                    limit: i.number,
                    language: i.arrayOf(i.string),
                    reverseMode: i.oneOf("distance", "score")
                })(e),
                e.mode = e.mode || "mapbox.places";
                var t = o(r({
                    country: e.countries
                },
                s(e, ["country", "types", "bbox", "limit", "language", "reverseMode"])));
                return this.client.createRequest({
                    method: "GET",
                    path: "/geocoding/v5/:mode/:query.json",
                    params: s(e, ["mode", "query"]),
                    query: t
                })
            },
            t.exports = a(u)
        },
        {
            "./service-helpers/create-service-factory": 18,
            "./service-helpers/pick": 20,
            "./service-helpers/stringify-booleans": 21,
            "./service-helpers/validator": 22,
            xtend: 36
        }],
        18 : [function(e, t, n) {
            "use strict";
            function r(e) {
                return function(t) {
                    var n;
                    n = i.prototype.isPrototypeOf(t) ? t: s(t);
                    var r = Object.create(e);
                    return r.client = n,
                    r
                }
            }
            var i = e("../../lib/classes/mapi-client"),
            s = e("../../lib/client");
            t.exports = r
        },
        {
            "../../lib/classes/mapi-client": 9,
            "../../lib/client": 7
        }],
        19 : [function(e, t, n) {
            "use strict";
            function r(e, t) {
                return Object.keys(e).reduce(function(n, r) {
                    return n[r] = t(r, e[r]),
                    n
                },
                {})
            }
            t.exports = r
        },
        {}],
        20 : [function(e, t, n) {
            "use strict";
            function r(e, t) {
                var n = function(e, n) {
                    return - 1 !== t.indexOf(e) && void 0 !== n
                };
                return "function" == typeof t && (n = t),
                Object.keys(e).filter(function(t) {
                    return n(t, e[t])
                }).reduce(function(t, n) {
                    return t[n] = e[n],
                    t
                },
                {})
            }
            t.exports = r
        },
        {}],
        21 : [function(e, t, n) {
            "use strict";
            function r(e) {
                return i(e,
                function(e, t) {
                    return "boolean" == typeof t ? JSON.stringify(t) : t
                })
            }
            var i = e("./object-map");
            t.exports = r
        },
        {
            "./object-map": 19
        }],
        22 : [function(e, t, n) { (function(n) {
                "use strict";
                function r(e) {
                    if ("undefined" != typeof window) {
                        if (e instanceof n.Blob || e instanceof n.ArrayBuffer) return;
                        return "Blob or ArrayBuffer"
                    }
                    if ("string" != typeof e && void 0 === e.pipe) return "Filename or Readable stream"
                }
                function i(e, t) {
                    return u.assert(u.strictShape(e), t)
                }
                function s(e) {
                    if ("boolean" == typeof e) return "date";
                    try {
                        var t = new Date(e);
                        if (t.getTime && isNaN(t.getTime())) return "date"
                    } catch(e) {
                        return "date"
                    }
                }
                function o(e) {
                    return u.tuple(u.number, u.number)(e)
                }
                var a = e("xtend"),
                u = e("@mapbox/fusspot");
                t.exports = a(u, {
                    file: r,
                    date: s,
                    coordinates: o,
                    assertShape: i
                })
            }).call(this, "undefined" != typeof global ? global: "undefined" != typeof self ? self: "undefined" != typeof window ? window: {})
        },
        {
            "@mapbox/fusspot": 5,
            xtend: 36
        }],
        23 : [function(e, t, n) {
            "use strict";
            function r(e) {
                if (a[e]) return a[e];
                var t = e.split("."),
                n = t[0],
                r = t[1];
                if (!r) throw new Error("Invalid token");
                var o = i(r),
                u = {
                    usage: n,
                    user: o.u
                };
                return s(o, "a") && (u.authorization = o.a),
                s(o, "exp") && (u.expires = 1e3 * o.exp),
                s(o, "iat") && (u.created = 1e3 * o.iat),
                s(o, "scopes") && (u.scopes = o.scopes),
                s(o, "client") && (u.client = o.client),
                s(o, "ll") && (u.lastLogin = o.ll),
                s(o, "iu") && (u.impersonator = o.iu),
                a[e] = u,
                u
            }
            function i(e) {
                try {
                    return JSON.parse(o.decode(e))
                } catch(e) {
                    throw new Error("Invalid token")
                }
            }
            function s(e, t) {
                return Object.prototype.hasOwnProperty.call(e, t)
            }
            var o = e("base-64"),
            a = {};
            t.exports = r
        },
        {
            "base-64": 24
        }],
        24 : [function(t, n, r) { (function(t) { !
                function(i) {
                    var s = "object" == typeof r && r,
                    o = "object" == typeof n && n && n.exports == s && n,
                    a = "object" == typeof t && t;
                    a.global !== a && a.window !== a || (i = a);
                    var u = function(e) {
                        this.message = e
                    };
                    u.prototype = new Error,
                    u.prototype.name = "InvalidCharacterError";
                    var l = function(e) {
                        throw new u(e)
                    },
                    c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                    h = /[\t\n\f\r ]/g,
                    p = function(e) {
                        e = String(e).replace(h, "");
                        var t = e.length;
                        t % 4 == 0 && (e = e.replace(/==?$/, ""), t = e.length),
                        (t % 4 == 1 || /[^+a-zA-Z0-9\/]/.test(e)) && l("Invalid character: the string to be decoded is not correctly encoded.");
                        for (var n, r, i = 0,
                        s = "",
                        o = -1; ++o < t;) r = c.indexOf(e.charAt(o)),
                        n = i % 4 ? 64 * n + r: r,
                        i++%4 && (s += String.fromCharCode(255 & n >> ( - 2 * i & 6)));
                        return s
                    },
                    f = function(e) {
                        e = String(e),
                        /[^\0-\xFF]/.test(e) && l("The string to be encoded contains characters outside of the Latin1 range.");
                        for (var t, n, r, i, s = e.length % 3,
                        o = "",
                        a = -1,
                        u = e.length - s; ++a < u;) t = e.charCodeAt(a) << 16,
                        n = e.charCodeAt(++a) << 8,
                        r = e.charCodeAt(++a),
                        i = t + n + r,
                        o += c.charAt(i >> 18 & 63) + c.charAt(i >> 12 & 63) + c.charAt(i >> 6 & 63) + c.charAt(63 & i);
                        return 2 == s ? (t = e.charCodeAt(a) << 8, n = e.charCodeAt(++a), i = t + n, o += c.charAt(i >> 10) + c.charAt(i >> 4 & 63) + c.charAt(i << 2 & 63) + "=") : 1 == s && (i = e.charCodeAt(a), o += c.charAt(i >> 2) + c.charAt(i << 4 & 63) + "=="),
                        o
                    },
                    d = {
                        encode: f,
                        decode: p,
                        version: "0.1.0"
                    };
                    if ("function" == typeof e && "object" == typeof e.amd && e.amd) e(function() {
                        return d
                    });
                    else if (s && !s.nodeType) if (o) o.exports = d;
                    else for (var v in d) d.hasOwnProperty(v) && (s[v] = d[v]);
                    else i.base64 = d
                } (this)
            }).call(this, "undefined" != typeof global ? global: "undefined" != typeof self ? self: "undefined" != typeof window ? window: {})
        },
        {}],
        25 : [function(e, t, n) {
            function r() {
                this._events && Object.prototype.hasOwnProperty.call(this, "_events") || (this._events = x(null), this._eventsCount = 0),
                this._maxListeners = this._maxListeners || void 0
            }
            function i(e) {
                return void 0 === e._maxListeners ? r.defaultMaxListeners: e._maxListeners
            }
            function s(e, t, n) {
                if (t) e.call(n);
                else for (var r = e.length,
                i = y(e, r), s = 0; s < r; ++s) i[s].call(n)
            }
            function o(e, t, n, r) {
                if (t) e.call(n, r);
                else for (var i = e.length,
                s = y(e, i), o = 0; o < i; ++o) s[o].call(n, r)
            }
            function a(e, t, n, r, i) {
                if (t) e.call(n, r, i);
                else for (var s = e.length,
                o = y(e, s), a = 0; a < s; ++a) o[a].call(n, r, i)
            }
            function u(e, t, n, r, i, s) {
                if (t) e.call(n, r, i, s);
                else for (var o = e.length,
                a = y(e, o), u = 0; u < o; ++u) a[u].call(n, r, i, s)
            }
            function l(e, t, n, r) {
                if (t) e.apply(n, r);
                else for (var i = e.length,
                s = y(e, i), o = 0; o < i; ++o) s[o].apply(n, r)
            }
            function c(e, t, n, r) {
                var s, o, a;
                if ("function" != typeof n) throw new TypeError('"listener" argument must be a function');
                if (o = e._events, o ? (o.newListener && (e.emit("newListener", t, n.listener ? n.listener: n), o = e._events), a = o[t]) : (o = e._events = x(null), e._eventsCount = 0), a) {
                    if ("function" == typeof a ? a = o[t] = r ? [n, a] : [a, n] : r ? a.unshift(n) : a.push(n), !a.warned && (s = i(e)) && s > 0 && a.length > s) {
                        a.warned = !0;
                        var u = new Error("Possible EventEmitter memory leak detected. " + a.length + ' "' + String(t) + '" listeners added. Use emitter.setMaxListeners() to increase limit.');
                        u.name = "MaxListenersExceededWarning",
                        u.emitter = e,
                        u.type = t,
                        u.count = a.length,
                        "object" == typeof console && console.warn && console.warn("%s: %s", u.name, u.message)
                    }
                } else a = o[t] = n,
                ++e._eventsCount;
                return e
            }
            function h() {
                if (!this.fired) switch (this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length) {
                case 0:
                    return this.listener.call(this.target);
                case 1:
                    return this.listener.call(this.target, arguments[0]);
                case 2:
                    return this.listener.call(this.target, arguments[0], arguments[1]);
                case 3:
                    return this.listener.call(this.target, arguments[0], arguments[1], arguments[2]);
                default:
                    for (var e = new Array(arguments.length), t = 0; t < e.length; ++t) e[t] = arguments[t];
                    this.listener.apply(this.target, e)
                }
            }
            function p(e, t, n) {
                var r = {
                    fired: !1,
                    wrapFn: void 0,
                    target: e,
                    type: t,
                    listener: n
                },
                i = E.call(h, r);
                return i.listener = n,
                r.wrapFn = i,
                i
            }
            function f(e, t, n) {
                var r = e._events;
                if (!r) return [];
                var i = r[t];
                return i ? "function" == typeof i ? n ? [i.listener || i] : [i] : n ? m(i) : y(i, i.length) : []
            }
            function d(e) {
                var t = this._events;
                if (t) {
                    var n = t[e];
                    if ("function" == typeof n) return 1;
                    if (n) return n.length
                }
                return 0
            }
            function v(e, t) {
                for (var n = t,
                r = n + 1,
                i = e.length; r < i; n += 1, r += 1) e[n] = e[r];
                e.pop()
            }
            function y(e, t) {
                for (var n = new Array(t), r = 0; r < t; ++r) n[r] = e[r];
                return n
            }
            function m(e) {
                for (var t = new Array(e.length), n = 0; n < t.length; ++n) t[n] = e[n].listener || e[n];
                return t
            }
            function g(e) {
                var t = function() {};
                return t.prototype = e,
                new t
            }
            function b(e) {
                var t = [];
                for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && t.push(n);
                return n
            }
            function _(e) {
                var t = this;
                return function() {
                    return t.apply(e, arguments)
                }
            }
            var x = Object.create || g,
            w = Object.keys || b,
            E = Function.prototype.bind || _;
            t.exports = r,
            r.EventEmitter = r,
            r.prototype._events = void 0,
            r.prototype._maxListeners = void 0;
            var O, L = 10;
            try {
                var k = {};
                Object.defineProperty && Object.defineProperty(k, "x", {
                    value: 0
                }),
                O = 0 === k.x
            } catch(e) {
                O = !1
            }
            O ? Object.defineProperty(r, "defaultMaxListeners", {
                enumerable: !0,
                get: function() {
                    return L
                },
                set: function(e) {
                    if ("number" != typeof e || e < 0 || e !== e) throw new TypeError('"defaultMaxListeners" must be a positive number');
                    L = e
                }
            }) : r.defaultMaxListeners = L,
            r.prototype.setMaxListeners = function(e) {
                if ("number" != typeof e || e < 0 || isNaN(e)) throw new TypeError('"n" argument must be a positive number');
                return this._maxListeners = e,
                this
            },
            r.prototype.getMaxListeners = function() {
                return i(this)
            },
            r.prototype.emit = function(e) {
                var t, n, r, i, c, h, p = "error" === e;
                if (h = this._events) p = p && null == h.error;
                else if (!p) return ! 1;
                if (p) {
                    if (arguments.length > 1 && (t = arguments[1]), t instanceof Error) throw t;
                    var f = new Error('Unhandled "error" event. (' + t + ")");
                    throw f.context = t,
                    f
                }
                if (! (n = h[e])) return ! 1;
                var d = "function" == typeof n;
                switch (r = arguments.length) {
                case 1:
                    s(n, d, this);
                    break;
                case 2:
                    o(n, d, this, arguments[1]);
                    break;
                case 3:
                    a(n, d, this, arguments[1], arguments[2]);
                    break;
                case 4:
                    u(n, d, this, arguments[1], arguments[2], arguments[3]);
                    break;
                default:
                    for (i = new Array(r - 1), c = 1; c < r; c++) i[c - 1] = arguments[c];
                    l(n, d, this, i)
                }
                return ! 0
            },
            r.prototype.addListener = function(e, t) {
                return c(this, e, t, !1)
            },
            r.prototype.on = r.prototype.addListener,
            r.prototype.prependListener = function(e, t) {
                return c(this, e, t, !0)
            },
            r.prototype.once = function(e, t) {
                if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
                return this.on(e, p(this, e, t)),
                this
            },
            r.prototype.prependOnceListener = function(e, t) {
                if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
                return this.prependListener(e, p(this, e, t)),
                this
            },
            r.prototype.removeListener = function(e, t) {
                var n, r, i, s, o;
                if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
                if (! (r = this._events)) return this;
                if (! (n = r[e])) return this;
                if (n === t || n.listener === t) 0 == --this._eventsCount ? this._events = x(null) : (delete r[e], r.removeListener && this.emit("removeListener", e, n.listener || t));
                else if ("function" != typeof n) {
                    for (i = -1, s = n.length - 1; s >= 0; s--) if (n[s] === t || n[s].listener === t) {
                        o = n[s].listener,
                        i = s;
                        break
                    }
                    if (i < 0) return this;
                    0 === i ? n.shift() : v(n, i),
                    1 === n.length && (r[e] = n[0]),
                    r.removeListener && this.emit("removeListener", e, o || t)
                }
                return this
            },
            r.prototype.removeAllListeners = function(e) {
                var t, n, r;
                if (! (n = this._events)) return this;
                if (!n.removeListener) return 0 === arguments.length ? (this._events = x(null), this._eventsCount = 0) : n[e] && (0 == --this._eventsCount ? this._events = x(null) : delete n[e]),
                this;
                if (0 === arguments.length) {
                    var i, s = w(n);
                    for (r = 0; r < s.length; ++r)"removeListener" !== (i = s[r]) && this.removeAllListeners(i);
                    return this.removeAllListeners("removeListener"),
                    this._events = x(null),
                    this._eventsCount = 0,
                    this
                }
                if ("function" == typeof(t = n[e])) this.removeListener(e, t);
                else if (t) for (r = t.length - 1; r >= 0; r--) this.removeListener(e, t[r]);
                return this
            },
            r.prototype.listeners = function(e) {
                return f(this, e, !0)
            },
            r.prototype.rawListeners = function(e) {
                return f(this, e, !1)
            },
            r.listenerCount = function(e, t) {
                return "function" == typeof e.listenerCount ? e.listenerCount(t) : d.call(e, t)
            },
            r.prototype.listenerCount = d,
            r.prototype.eventNames = function() {
                return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : []
            }
        },
        {}],
        26 : [function(e, t, n) {
            "use strict";
            function r() {}
            function i(e, t, n) {
                this.fn = e,
                this.context = t,
                this.once = n || !1
            }
            function s(e, t, n, r, s) {
                if ("function" != typeof n) throw new TypeError("The listener must be a function");
                var o = new i(n, r || e, s),
                a = l ? l + t: t;
                return e._events[a] ? e._events[a].fn ? e._events[a] = [e._events[a], o] : e._events[a].push(o) : (e._events[a] = o, e._eventsCount++),
                e
            }
            function o(e, t) {
                0 == --e._eventsCount ? e._events = new r: delete e._events[t]
            }
            function a() {
                this._events = new r,
                this._eventsCount = 0
            }
            var u = Object.prototype.hasOwnProperty,
            l = "~";
            Object.create && (r.prototype = Object.create(null), (new r).__proto__ || (l = !1)),
            a.prototype.eventNames = function() {
                var e, t, n = [];
                if (0 === this._eventsCount) return n;
                for (t in e = this._events) u.call(e, t) && n.push(l ? t.slice(1) : t);
                return Object.getOwnPropertySymbols ? n.concat(Object.getOwnPropertySymbols(e)) : n
            },
            a.prototype.listeners = function(e) {
                var t = l ? l + e: e,
                n = this._events[t];
                if (!n) return [];
                if (n.fn) return [n.fn];
                for (var r = 0,
                i = n.length,
                s = new Array(i); r < i; r++) s[r] = n[r].fn;
                return s
            },
            a.prototype.listenerCount = function(e) {
                var t = l ? l + e: e,
                n = this._events[t];
                return n ? n.fn ? 1 : n.length: 0
            },
            a.prototype.emit = function(e, t, n, r, i, s) {
                var o = l ? l + e: e;
                if (!this._events[o]) return ! 1;
                var a, u, c = this._events[o],
                h = arguments.length;
                if (c.fn) {
                    switch (c.once && this.removeListener(e, c.fn, void 0, !0), h) {
                    case 1:
                        return c.fn.call(c.context),
                        !0;
                    case 2:
                        return c.fn.call(c.context, t),
                        !0;
                    case 3:
                        return c.fn.call(c.context, t, n),
                        !0;
                    case 4:
                        return c.fn.call(c.context, t, n, r),
                        !0;
                    case 5:
                        return c.fn.call(c.context, t, n, r, i),
                        !0;
                    case 6:
                        return c.fn.call(c.context, t, n, r, i, s),
                        !0
                    }
                    for (u = 1, a = new Array(h - 1); u < h; u++) a[u - 1] = arguments[u];
                    c.fn.apply(c.context, a)
                } else {
                    var p, f = c.length;
                    for (u = 0; u < f; u++) switch (c[u].once && this.removeListener(e, c[u].fn, void 0, !0), h) {
                    case 1:
                        c[u].fn.call(c[u].context);
                        break;
                    case 2:
                        c[u].fn.call(c[u].context, t);
                        break;
                    case 3:
                        c[u].fn.call(c[u].context, t, n);
                        break;
                    case 4:
                        c[u].fn.call(c[u].context, t, n, r);
                        break;
                    default:
                        if (!a) for (p = 1, a = new Array(h - 1); p < h; p++) a[p - 1] = arguments[p];
                        c[u].fn.apply(c[u].context, a)
                    }
                }
                return ! 0
            },
            a.prototype.on = function(e, t, n) {
                return s(this, e, t, n, !1)
            },
            a.prototype.once = function(e, t, n) {
                return s(this, e, t, n, !0)
            },
            a.prototype.removeListener = function(e, t, n, r) {
                var i = l ? l + e: e;
                if (!this._events[i]) return this;
                if (!t) return o(this, i),
                this;
                var s = this._events[i];
                if (s.fn) s.fn !== t || r && !s.once || n && s.context !== n || o(this, i);
                else {
                    for (var a = 0,
                    u = [], c = s.length; a < c; a++)(s[a].fn !== t || r && !s[a].once || n && s[a].context !== n) && u.push(s[a]);
                    u.length ? this._events[i] = 1 === u.length ? u[0] : u: o(this, i)
                }
                return this
            },
            a.prototype.removeAllListeners = function(e) {
                var t;
                return e ? (t = l ? l + e: e, this._events[t] && o(this, t)) : (this._events = new r, this._eventsCount = 0),
                this
            },
            a.prototype.off = a.prototype.removeListener,
            a.prototype.addListener = a.prototype.on,
            a.prefixed = l,
            a.EventEmitter = a,
            void 0 !== t && (t.exports = a)
        },
        {}],
        27 : [function(e, t, n) { !
            function() {
                var e = this,
                r = {};
                void 0 !== n ? t.exports = r: e.fuzzy = r,
                r.simpleFilter = function(e, t) {
                    return t.filter(function(t) {
                        return r.test(e, t)
                    })
                },
                r.test = function(e, t) {
                    return null !== r.match(e, t)
                },
                r.match = function(e, t, n) {
                    n = n || {};
                    var r, i = 0,
                    s = [],
                    o = t.length,
                    a = 0,
                    u = 0,
                    l = n.pre || "",
                    c = n.post || "",
                    h = n.caseSensitive && t || t.toLowerCase();
                    e = n.caseSensitive && e || e.toLowerCase();
                    for (var p = 0; p < o; p++) r = t[p],
                    h[p] === e[i] ? (r = l + r + c, i += 1, u += 1 + u) : u = 0,
                    a += u,
                    s[s.length] = r;
                    return i === e.length ? (a = h === e ? 1 / 0 : a, {
                        rendered: s.join(""),
                        score: a
                    }) : null
                },
                r.filter = function(e, t, n) {
                    return t && 0 !== t.length ? "string" != typeof e ? t: (n = n || {},
                    t.reduce(function(t, i, s, o) {
                        var a = i;
                        n.extract && (a = n.extract(i));
                        var u = r.match(e, a, n);
                        return null != u && (t[t.length] = {
                            string: u.rendered,
                            score: u.score,
                            index: s,
                            original: i
                        }),
                        t
                    },
                    []).sort(function(e, t) {
                        var n = t.score - e.score;
                        return n || e.index - t.index
                    })) : []
                }
            } ()
        },
        {}],
        28 : [function(e, t, n) {
            "use strict";
            var r = Object.prototype.toString;
            t.exports = function(e) {
                var t;
                return "[object Object]" === r.call(e) && (null === (t = Object.getPrototypeOf(e)) || t === Object.getPrototypeOf({}))
            }
        },
        {}],
        29 : [function(e, t, n) { (function(e) {
                function n(e, t, n) {
                    function i(t) {
                        var n = v,
                        r = y;
                        return v = y = void 0,
                        O = t,
                        g = e.apply(r, n)
                    }
                    function s(e) {
                        return O = e,
                        b = setTimeout(c, t),
                        L ? i(e) : g
                    }
                    function u(e) {
                        var n = e - E,
                        r = e - O,
                        i = t - n;
                        return k ? x(i, m - r) : i
                    }
                    function l(e) {
                        var n = e - E,
                        r = e - O;
                        return void 0 === E || n >= t || n < 0 || k && r >= m
                    }
                    function c() {
                        var e = w();
                        if (l(e)) return h(e);
                        b = setTimeout(c, u(e))
                    }
                    function h(e) {
                        return b = void 0,
                        T && v ? i(e) : (v = y = void 0, g)
                    }
                    function p() {
                        void 0 !== b && clearTimeout(b),
                        O = 0,
                        v = E = y = b = void 0
                    }
                    function f() {
                        return void 0 === b ? g: h(w())
                    }
                    function d() {
                        var e = w(),
                        n = l(e);
                        if (v = arguments, y = this, E = e, n) {
                            if (void 0 === b) return s(E);
                            if (k) return b = setTimeout(c, t),
                            i(E)
                        }
                        return void 0 === b && (b = setTimeout(c, t)),
                        g
                    }
                    var v, y, m, g, b, E, O = 0,
                    L = !1,
                    k = !1,
                    T = !0;
                    if ("function" != typeof e) throw new TypeError(a);
                    return t = o(t) || 0,
                    r(n) && (L = !!n.leading, k = "maxWait" in n, m = k ? _(o(n.maxWait) || 0, t) : m, T = "trailing" in n ? !!n.trailing: T),
                    d.cancel = p,
                    d.flush = f,
                    d
                }
                function r(e) {
                    var t = typeof e;
                    return !! e && ("object" == t || "function" == t)
                }
                function i(e) {
                    return !! e && "object" == typeof e
                }
                function s(e) {
                    return "symbol" == typeof e || i(e) && b.call(e) == l
                }
                function o(e) {
                    if ("number" == typeof e) return e;
                    if (s(e)) return u;
                    if (r(e)) {
                        var t = "function" == typeof e.valueOf ? e.valueOf() : e;
                        e = r(t) ? t + "": t
                    }
                    if ("string" != typeof e) return 0 === e ? e: +e;
                    e = e.replace(c, "");
                    var n = p.test(e);
                    return n || f.test(e) ? d(e.slice(2), n ? 2 : 8) : h.test(e) ? u: +e
                }
                var a = "Expected a function",
                u = NaN,
                l = "[object Symbol]",
                c = /^\s+|\s+$/g,
                h = /^[-+]0x[0-9a-f]+$/i,
                p = /^0b[01]+$/i,
                f = /^0o[0-7]+$/i,
                d = parseInt,
                v = "object" == typeof e && e && e.Object === Object && e,
                y = "object" == typeof self && self && self.Object === Object && self,
                m = v || y || Function("return this")(),
                g = Object.prototype,
                b = g.toString,
                _ = Math.max,
                x = Math.min,
                w = function() {
                    return m.Date.now()
                };
                t.exports = n
            }).call(this, "undefined" != typeof global ? global: "undefined" != typeof self ? self: "undefined" != typeof window ? window: {})
        },
        {}],
        30 : [function(e, t, n) { (function(e) {
                if ("production" !== e.env.NODE_ENV && ("undefined" == typeof self || !self.crypto && !self.msCrypto)) throw new Error("Your browser does not have secure random generator. If you don’t need unpredictable IDs, you can use nanoid/non-secure.");
                var n = self.crypto || self.msCrypto;
                t.exports = function(e) {
                    e = e || 21;
                    for (var t = "",
                    r = n.getRandomValues(new Uint8Array(e)); 0 < e--;) t += "Uint8ArdomValuesObj012345679BCDEFGHIJKLMNPQRSTWXYZ_cfghkpqvwxyz-" [63 & r[e]];
                    return t
                }
            }).call(this, e("_process"))
        },
        {
            _process: 31
        }],
        31 : [function(e, t, n) {
            function r() {
                throw new Error("setTimeout has not been defined")
            }
            function i() {
                throw new Error("clearTimeout has not been defined")
            }
            function s(e) {
                if (h === setTimeout) return setTimeout(e, 0);
                if ((h === r || !h) && setTimeout) return h = setTimeout,
                setTimeout(e, 0);
                try {
                    return h(e, 0)
                } catch(t) {
                    try {
                        return h.call(null, e, 0)
                    } catch(t) {
                        return h.call(this, e, 0)
                    }
                }
            }
            function o(e) {
                if (p === clearTimeout) return clearTimeout(e);
                if ((p === i || !p) && clearTimeout) return p = clearTimeout,
                clearTimeout(e);
                try {
                    return p(e)
                } catch(t) {
                    try {
                        return p.call(null, e)
                    } catch(t) {
                        return p.call(this, e)
                    }
                }
            }
            function a() {
                y && d && (y = !1, d.length ? v = d.concat(v) : m = -1, v.length && u())
            }
            function u() {
                if (!y) {
                    var e = s(a);
                    y = !0;
                    for (var t = v.length; t;) {
                        for (d = v, v = []; ++m < t;) d && d[m].run();
                        m = -1,
                        t = v.length
                    }
                    d = null,
                    y = !1,
                    o(e)
                }
            }
            function l(e, t) {
                this.fun = e,
                this.array = t
            }
            function c() {}
            var h, p, f = t.exports = {}; !
            function() {
                try {
                    h = "function" == typeof setTimeout ? setTimeout: r
                } catch(e) {
                    h = r
                }
                try {
                    p = "function" == typeof clearTimeout ? clearTimeout: i
                } catch(e) {
                    p = i
                }
            } ();
            var d, v = [],
            y = !1,
            m = -1;
            f.nextTick = function(e) {
                var t = new Array(arguments.length - 1);
                if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
                v.push(new l(e, t)),
                1 !== v.length || y || s(u)
            },
            l.prototype.run = function() {
                this.fun.apply(null, this.array)
            },
            f.title = "browser",
            f.browser = !0,
            f.env = {},
            f.argv = [],
            f.version = "",
            f.versions = {},
            f.on = c,
            f.addListener = c,
            f.once = c,
            f.off = c,
            f.removeListener = c,
            f.removeAllListeners = c,
            f.emit = c,
            f.prependListener = c,
            f.prependOnceListener = c,
            f.listeners = function(e) {
                return []
            },
            f.binding = function(e) {
                throw new Error("process.binding is not supported")
            },
            f.cwd = function() {
                return "/"
            },
            f.chdir = function(e) {
                throw new Error("process.chdir is not supported")
            },
            f.umask = function() {
                return 0
            }
        },
        {}],
        32 : [function(e, t, n) { !
            function(e, n, r) {
                void 0 !== t && t.exports ? t.exports = r() : e.subtag = r()
            } (this, 0,
            function() {
                function e(e) {
                    return e.match(o) || []
                }
                function t(t) {
                    return e(t).filter(function(e, t) {
                        return e && t
                    })
                }
                function n(t) {
                    return t = e(t),
                    {
                        language: t[1] || s,
                        extlang: t[2] || s,
                        script: t[3] || s,
                        region: t[4] || s
                    }
                }
                function r(e, t, n) {
                    Object.defineProperty(e, t, {
                        value: n,
                        enumerable: !0
                    })
                }
                function i(t, i, o) {
                    function a(n) {
                        return e(n)[t] || s
                    }
                    r(a, "pattern", i),
                    r(n, o, a)
                }
                var s = "",
                o = /^([a-zA-Z]{2,3})(?:[_-]+([a-zA-Z]{3})(?=$|[_-]+))?(?:[_-]+([a-zA-Z]{4})(?=$|[_-]+))?(?:[_-]+([a-zA-Z]{2}|[0-9]{3})(?=$|[_-]+))?/;
                return i(1, /^[a-zA-Z]{2,3}$/, "language"),
                i(2, /^[a-zA-Z]{3}$/, "extlang"),
                i(3, /^[a-zA-Z]{4}$/, "script"),
                i(4, /^[a-zA-Z]{2}$|^[0-9]{3}$/, "region"),
                r(n, "split", t),
                n
            })
        },
        {}],
        33 : [function(e, t, n) {
            "use strict";
            var r = e("./src/suggestions");
            window.Suggestions = t.exports = r
        },
        {
            "./src/suggestions": 35
        }],
        34 : [function(e, t, n) {
            "Use strict";
            var r = function(e) {
                return this.component = e,
                this.items = [],
                this.active = 0,
                this.wrapper = document.createElement("div"),
                this.wrapper.className = "suggestions-wrapper",
                this.element = document.createElement("ul"),
                this.element.className = "suggestions",
                this.wrapper.appendChild(this.element),
                this.selectingListItem = !1,
                e.el.parentNode.insertBefore(this.wrapper, e.el.nextSibling),
                this
            };
            r.prototype.show = function() {
                this.element.style.display = "block"
            },
            r.prototype.hide = function() {
                this.element.style.display = "none"
            },
            r.prototype.add = function(e) {
                this.items.push(e)
            },
            r.prototype.clear = function() {
                this.items = [],
                this.active = 0
            },
            r.prototype.isEmpty = function() {
                return ! this.items.length
            },
            r.prototype.isVisible = function() {
                return "block" === this.element.style.display
            },
            r.prototype.draw = function() {
                if (this.element.innerHTML = "", 0 === this.items.length) return void this.hide();
                for (var e = 0; e < this.items.length; e++) this.drawItem(this.items[e], this.active === e);
                this.show()
            },
            r.prototype.drawItem = function(e, t) {
                var n = document.createElement("li"),
                r = document.createElement("a");
                t && (n.className += " active"),
                r.innerHTML = e.string,
                n.appendChild(r),
                this.element.appendChild(n),
                n.addEventListener("mousedown",
                function() {
                    this.selectingListItem = !0
                }.bind(this)),
                n.addEventListener("mouseup",
                function() {
                    this.handleMouseUp.call(this, e)
                }.bind(this))
            },
            r.prototype.handleMouseUp = function(e) {
                this.selectingListItem = !1,
                this.component.value(e.original),
                this.clear(),
                this.draw()
            },
            r.prototype.move = function(e) {
                this.active = e,
                this.draw()
            },
            r.prototype.previous = function() {
                this.move(0 === this.active ? this.items.length - 1 : this.active - 1)
            },
            r.prototype.next = function() {
                this.move(this.active === this.items.length - 1 ? 0 : this.active + 1)
            },
            r.prototype.drawError = function(e) {
                var t = document.createElement("li");
                t.innerHTML = e,
                this.element.appendChild(t),
                this.show()
            },
            t.exports = r
        },
        {}],
        35 : [function(e, t, n) {
            "use strict";
            var r = e("xtend"),
            i = e("fuzzy"),
            s = e("./list"),
            o = function(e, t, n) {
                return n = n || {},
                this.options = r({
                    minLength: 2,
                    limit: 5,
                    filter: !0
                },
                n),
                this.el = e,
                this.data = t || [],
                this.list = new s(this),
                this.query = "",
                this.selected = null,
                this.list.draw(),
                this.el.addEventListener("keyup",
                function(e) {
                    this.handleKeyUp(e.keyCode)
                }.bind(this), !1),
                this.el.addEventListener("keydown",
                function(e) {
                    this.handleKeyDown(e)
                }.bind(this)),
                this.el.addEventListener("focus",
                function() {
                    this.handleFocus()
                }.bind(this)),
                this.el.addEventListener("blur",
                function() {
                    this.handleBlur()
                }.bind(this)),
                this.el.addEventListener("paste",
                function(e) {
                    this.handlePaste(e)
                }.bind(this)),
                this.render = this.options.render ? this.options.render.bind(this) : this.render.bind(this),
                this.getItemValue = this.options.getItemValue ? this.options.getItemValue.bind(this) : this.getItemValue.bind(this),
                this
            };
            o.prototype.handleKeyUp = function(e) {
                40 !== e && 38 !== e && 27 !== e && 13 !== e && 9 !== e && this.handleInputChange(this.el.value)
            },
            o.prototype.handleKeyDown = function(e) {
                switch (e.keyCode) {
                case 13:
                case 9:
                    this.list.isEmpty() || (this.list.isVisible() && e.preventDefault(), this.value(this.list.items[this.list.active].original), this.list.hide());
                    break;
                case 27:
                    this.list.isEmpty() || this.list.hide();
                    break;
                case 38:
                    this.list.previous();
                    break;
                case 40:
                    this.list.next()
                }
            },
            o.prototype.handleBlur = function() {
                this.list.selectingListItem || this.list.hide()
            },
            o.prototype.handlePaste = function(e) {
                if (e.clipboardData) this.handleInputChange(e.clipboardData.getData("Text"));
                else {
                    var t = this;
                    setTimeout(function() {
                        t.handleInputChange(e.target.value)
                    },
                    100)
                }
            },
            o.prototype.handleInputChange = function(e) {
                if (this.query = this.normalize(e), this.list.clear(), this.query.length < this.options.minLength) return void this.list.draw();
                this.getCandidates(function(e) {
                    for (var t = 0; t < e.length && (this.list.add(e[t]), t !== this.options.limit - 1); t++);
                    this.list.draw()
                }.bind(this))
            },
            o.prototype.handleFocus = function() {
                this.list.isEmpty() || this.list.show(),
                this.list.selectingListItem = !1
            },
            o.prototype.update = function(e) {
                this.data = e,
                this.handleKeyUp()
            },
            o.prototype.clear = function() {
                this.data = [],
                this.list.clear()
            },
            o.prototype.normalize = function(e) {
                return e = e.toLowerCase()
            },
            o.prototype.match = function(e, t) {
                return e.indexOf(t) > -1
            },
            o.prototype.value = function(e) {
                if (this.selected = e, this.el.value = this.getItemValue(e), document.createEvent) {
                    var t = document.createEvent("HTMLEvents");
                    t.initEvent("change", !0, !1),
                    this.el.dispatchEvent(t)
                } else this.el.fireEvent("onchange")
            },
            o.prototype.getCandidates = function(e) {
                var t, n = {
                    pre: "<strong>",
                    post: "</strong>",
                    extract: function(e) {
                        return this.getItemValue(e)
                    }.bind(this)
                };
                this.options.filter ? (t = i.filter(this.query, this.data, n), t = t.map(function(e) {
                    return {
                        original: e.original,
                        string: this.render(e.original, e.string)
                    }
                }.bind(this))) : t = this.data.map(function(e) {
                    return {
                        original: e,
                        string: this.render(e)
                    }
                }.bind(this)),
                e(t)
            },
            o.prototype.getItemValue = function(e) {
                return e
            },
            o.prototype.render = function(e, t) {
                if (t) return t;
                for (var n = e.original ? this.getItemValue(e.original) : this.getItemValue(e), r = this.normalize(n), i = r.lastIndexOf(this.query); i > -1;) {
                    var s = i + this.query.length;
                    n = n.slice(0, i) + "<strong>" + n.slice(i, s) + "</strong>" + n.slice(s),
                    i = r.slice(0, i).lastIndexOf(this.query)
                }
                return n
            },
            o.prototype.renderError = function(e) {
                this.list.drawError(e)
            },
            t.exports = o
        },
        {
            "./list": 34,
            fuzzy: 27,
            xtend: 36
        }],
        36 : [function(e, t, n) {
            function r() {
                for (var e = {},
                t = 0; t < arguments.length; t++) {
                    var n = arguments[t];
                    for (var r in n) i.call(n, r) && (e[r] = n[r])
                }
                return e
            }
            t.exports = r;
            var i = Object.prototype.hasOwnProperty
        },
        {}]
    }, {}, [3])(3)
});