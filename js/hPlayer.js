/*
 * hPlayer Extend v 2.0.0 VLC and ACE Plugin  detection and embed
 * More information about the script and how to use - http://hplayer.hmscript.net
 * Event Horizon is used to handle keyboard events.
 *
 * Created ZpVs and JD9496
 * support[at]hmscript.net
 * 3dhotboy[at]gmail.com
 *
 * Copyright (c) 2013 ZpVs and JD9496
 * Released under the License:
 * MIT and GPL licenses.
 */
var hPlayer_Ext = function () {
    var a = {
        __agent: function () {
            var c = !! top.execScript;
            if (c) {
                return "ie"
            } else {
                return "non-ie"
            }
        },
        __api: function () {
            var c = {
                status: {
                    0: "",
                    1: "Getting data the video",
                    2: "Buffering stream",
                    3: "Playback media file",
                    4: "Pause",
                    5: "Playback is stopped",
                    6: "Ending of playing",
                    7: "Error from playback"
                },
                pl_list: [],
                plugin: $("#" + b.init._interface.continer + "-plugin")[0],
                __getPlugin: function () {
                    if (typeof ($("#" + b.init._interface.continer + "-plugin")[0]) == "object") {
                        return true
                    }
                },
                __getPluginState: function () {
                    return (b.init._script.type == "ace") ? this.plugin.version : this.plugin.VersionInfo
                },
                __getPlaylist: function () {
                    var j = b.init._player.stream;
                    if (j.indexOf(".m3u") == -1) {
                        if (b.init._ad.state && !b.init._ad.isView && b.init._script.type != "ace") {
                            this.pl_list[0] = [b.init._ad.link, b.init._ad.link]
                        } else {
                            this.pl_list[0] = ["", ""]
                        }
                        this.pl_list[1] = [b.init._player.stream, b.init._player.stream]
                    } else {
                        var f;
                        try {
                            f = new ActiveXObject("Msxml2.XMLHTTP")
                        } catch (k) {
                            try {
                                f = new ActiveXObject("Microsoft.XMLHTTP")
                            } catch (h) {
                                f = false
                            }
                        }
                        if (!f && typeof XMLHttpRequest != "undefined") {
                            f = new XMLHttpRequest()
                        }
                        f.open("GET", b.init._script.api_url + "" + b.init._player.stream, false);
                        f.send(null);
                        var l = f.responseText.split("#EXTINF:-1,");
                        for (var d = 1; d < l.length; d++) {
                            if (!b.init._ad.isView) {
                                this.pl_list[0] = [b.init._ad.link, b.init._ad.link]
                            } else {
                                this.pl_list[0] = []
                            }
                            var g = l[d].split("\n");
                            this.pl_list[d] = [g[0], g[1].trim()]
                        }
                    }
                    return this.pl_list
                },
                __controlMethod: function (h, e) {
                    if (!this.plugin) {
                        setTimeout(this.__controlMethod(h, e), 100)
                    } else {
                        switch (h) {
                        case "play":
                            var d;
                            if (e != null) {
                                d = e;
                                b.init._ad.isView = true
                            } else {
                                d = this.__getPlaylist()
                            }
                            var f = "";
                            if (b.init._script.type == "ace") {
                                this.plugin.playlistClear();
                                this.plugin.playlistLoadPlayer(d[1][1]);
                                this.plugin.playlistPlay()
                            } else {
                                this.plugin.playlist.items.clear();
                                var g = 0;
                                if (b.init._ad.isView) {
                                    g = 1
                                }
                                for (g; g < d.length; g++) {
                                    if (b.init._script.browser == "ie") {
                                        this.plugin.playlist.add(d[g][1])
                                    } else {
                                        this.plugin.playlist.add(d[g][1], d[g][0], f)
                                    }
                                }
                                this.plugin.playlist.play()
                            } if (!b.init._ad.isView) {
                                setTimeout("hPlayer_Ext.api().checkAds()", b.init._ad.time)
                            }
                            break;
                        case "forward":
                            (b.init._script.type == "ace") ? this.plugin.playlistNext() : this.plugin.playlist.next();
                            break;
                        case "backward":
                            (b.init._script.type == "ace") ? this.plugin.playlistPrev() : this.plugin.playlist.prev();
                            break;
                        case "stop":
                            if (b.init._script.type == "ace") {
                                this.plugin.playlistStop(true)
                            } else {
                                this.plugin.playlist.clear();
                                this.plugin.playlist.stop()
                            }
                            break;
                        case "pause":
                            (b.init._script.type == "ace") ? this.plugin.playlistTogglePause() : this.plugin.playlist.togglePause();
                            break;
                        case "fullscreen":
                            (b.init._script.type == "ace") ? this.plugin.setDisabled(false) : "";
                            if (b.init._script.browser == "ie") {
                                (b.init._script.type == "ace") ? this.plugin.videoToggleFullscreen() : this.plugin.video.toggleFullscreen()
                            } else {
                                a.__fullscreen(b.init._interface.continer)
                            }
                            break;
                        case "playlist":
                            break;
                        case "mute":
                            (b.init._script.type == "ace") ? this.plugin.audioToggleMute() : this.plugin.audio.toggleMute();
                            break;
                        case "ratio":
                            (b.init._script.type == "ace") ? this.plugin.videoAspectRatio = e : this.plugin.video.aspectRatio = e;
                            break;
                        case "deinterlace":
                            (b.init._script.type == "ace") ? this.plugin.deinterlaceMode = e : this.plugin.video.deinterlace.enable(e);
                            break;
                        case "changevolume":
                            (b.init._script.type == "ace") ? this.plugin.audioVolume = e : this.plugin.audio.volume = e;
                            break;
                        case "audioChannel":
                            (b.init._script.type == "ace") ? this.plugin.audioChannel = parseInt(e) : this.plugin.audio.channel = parseInt(e);
                            break
                        }
                    }
                },
                __checker: function (e, g) {
                    if (!a.__api().__getPlugin()) {
                        return false
                    }
                    if (!a.__api().__getPluginState()) {
                        this.statusText('<p style="color: red;">PLUGIN NOT FOUND FROM PAGE</p>');
                        return false
                    }
                    switch (e) {
                    case "start":
                        this.__checker("stop", null);
                        this.statusCheckTimer = setInterval('hPlayer_Ext.api().__checker("checking",null)', 100);
                        break;
                    case "stop":
                        clearTimeout(this.statusCheckTimer);
                        break;
                    case "checking":
                        var d;
                        (b.init._script.type == "ace") ? d = this.plugin.state : d = this.plugin.input.state;
                        switch (d) {
                        case 2:
                            if (b.init._script.type == "ace") {
                                this.fullscreenWidth();
                                this.statusText(this.status[d]);
                                this.plugin.setDisabled(true);
                                $("." + b.init._interface.continer + "-playerMediaInfo").html(a.__playTime() + " / " + a.__playTime("end"))
                            } else {
                                this.statusText(this.status[d])
                            }
                            break;
                        case 3:
                        case 4:
                            this.fullscreenWidth();
                            if (d == 3 && !b.init._ad.isView && b.init._ad.state) {
                                this.statusText("advertising clip")
                            } else {
                                this.statusText(this.status[d]);
                                $("." + b.init._interface.continer + "-playerMediaInfo").html(a.__playTime() + " / " + a.__playTime("end"))
                            }
                            break;
                        case 6:
                            $(".ico-pause").addClass("ico-play");
                            $(".ico-pause").removeClass("ico-pause");
                            b.init._script.isPause = false;
                            this.plugin.width = "1px";
                            this.plugin.height = "1px";
                            this.statusText(this.status[d]);
                            break;
                        case 7:
                            break;
                        default:
                            (b.init._script.type == "ace") ? this.plugin.setDisabled(false) : "";
                            this.statusText(this.status[d]);
                            this.plugin.width = "1px";
                            this.plugin.height = "1px";
                            if (b.init._player.autoplay) {
                                $(".ico-play").addClass("ico-pause");
                                $(".ico-play").removeClass("ico-play");
                                b.init._script.isPause = true;
                                b.init._player.autoplay = false;
                                this.__controlMethod("play")
                            }
                        }
                        var f;
                        (b.init._script.type == "ace") ? f = this.plugin.audioMute : f = this.plugin.audio.mute;
                        if (f) {
                            $(".ico-volume-up").addClass("ico-volume-off");
                            $(".ico-volume-up").removeClass("ico-volume-up")
                        } else {
                            $(".ico-volume-off").addClass("ico-volume-up");
                            $(".ico-volume-off").removeClass("ico-volume-off")
                        }
                        break
                    }
                },
                checkAds: function () {
                    var d;
                    (b.init._script.type == "ace") ? d = this.plugin.state : d = this.plugin.input.state;
                    if (b.init._ad.state && !b.init._ad.isView && d != 5) {
                        a.__inf("Advertising has been viewed ", !b.init._ad.isView, "i");
                        b.init._ad.isView = true;
                        (b.init._script.type == "ace") ? "" : this.__controlMethod("forward");
                        (b.init._script.type == "ace") ? this.plugin.playlistRemoveItem(0) : this.plugin.playlist.items.remove(0)
                    }
                },
                fullscreenWidth: function () {
                    if (b.init.isFullscreen) {
                        this.plugin.width = $("#" + b.init._interface.continer).width() - 3;
                        this.plugin.height = $("#" + b.init._interface.continer).height() - $("#" + b.init._interface.continer + "-toolbar").height() - 6
                    } else {
                        this.plugin.width = b.init._interface.width;
                        this.plugin.height = b.init._interface.height
                    }
                },
                statusText: function (d) {
                    $("." + b.init._interface.continer + "-playerInfo").html("");
                    $("." + b.init._interface.continer + "-playerInfo").html(d)
                }
            };
            return c
        },
        __inf: function (e, d, c) {
            switch (c) {
            case "s":
                b.init._script.debug ? console.log('Value "' + e + '" set in (' + d + ")") : "";
                break;
            case "e":
                b.init._script.debug ? console.warn("Value " + e + " ignored as not used") : "";
                break;
            case "i":
                b.init._script.debug ? console.info(e + d) : "";
                break
            }
        },
        __interface: function (c) {
            var l = {
                buttons: {
                    backward: {
                        access: false,
                        d_class: b.init._interface.continer + "-playerControl",
                        txt: "Backward",
                        icon: "ico-backward",
                        event: function () {
                            a.__control("backward")
                        }
                    },
                    play: {
                        access: false,
                        d_class: b.init._interface.continer + "-playerControl",
                        txt: "Play / Pause",
                        icon: "ico-play",
                        event: function () {
                            a.__control("play")
                        }
                    },
                    forward: {
                        access: false,
                        d_class: b.init._interface.continer + "-playerControl",
                        txt: "Forward",
                        icon: "ico-forward",
                        event: function () {
                            a.__control("forward")
                        }
                    },
                    fullscreen: {
                        access: false,
                        d_class: b.init._interface.continer + "-playerConfig",
                        txt: "Fullscreen",
                        icon: "ico-fullscreen",
                        event: function () {
                            a.__control("fullscreen")
                        }
                    },
                    stop: {
                        access: false,
                        d_class: b.init._interface.continer + "-playerControl",
                        txt: "Stop",
                        icon: "ico-stop",
                        event: function () {
                            a.__control("stop")
                        }
                    },
                    mute: {
                        access: false,
                        d_class: b.init._interface.continer + "-playerControl",
                        txt: "Volume",
                        icon: "ico-volume-up",
                        event: function () {
                            a.__control("mute")
                        }
                    },
                    playlist: {
                        access: false,
                        d_class: b.init._interface.continer + "-playerConfig",
                        txt: "Playlist",
                        icon: "ico-playlist",
                        event: function () {
                            a.__control("playlist")
                        }
                    },
                    config: {
                        access: false,
                        d_class: b.init._interface.continer + "-playerConfig",
                        txt: "Settings",
                        icon: "ico-cogs",
                        event: function () {
                            a.__control("config")
                        }
                    }
                },
                parts: {
                    main: {
                        access: true,
                        box: c,
                        jbox: $("#" + c)
                    },
                    screen: {
                        access: true,
                        box: c + "-screen",
                        jbox: $("#" + c + "-screen")
                    },
                    plugin: {
                        access: true,
                        box: c + "-plugin",
                        jbox: $("#" + c + "-plugin")
                    },
                    toolbar: {
                        access: true,
                        box: c + "-toolbar",
                        jbox: $("#" + c + "-toolbar")
                    }
                }
            };
            $("#" + b.init._interface.continer).addClass(b.init._script.type);
            for (var e in l.parts) {
                switch (e) {
                case "screen":
                    if (l.parts[e].access) {
                        $("#" + l.parts.main.box).append('<div id="' + l.parts[e].box + '"></div>');
                        if (b.init._player.thumbnail != "") {
                            $("#" + l.parts[e].box).attr("style", "background: transparent url(" + b.init._player.thumbnail + ") no-repeat center center")
                        }
                    }
                    break;
                case "toolbar":
                    if (b.init._script.type == "vcam") {
                        l.parts.toolbar.access = false;
                        b.init._interface.width = "100%";
                        b.init._interface.height = "99%"
                    }
                    if (l.parts[e].access) {
                        $("#" + l.parts.main.box).append('<div id="' + l.parts[e].box + '"></div>');
                        var d;
                        switch (b.init._script.type) {
                        case "ace":
                            d = '<div class="' + b.init._interface.continer + '-playerControl"></div><div class="' + b.init._interface.continer + '-playerVolume"></div><div class="' + b.init._interface.continer + '-playerMediaInfo"></div><div class="' + b.init._interface.continer + '-playerInfo"></div><div class="' + b.init._interface.continer + '-playerConfig"></div>';
                            b.init._script.buttons = b.init._script.buttons + ":play:stop:config:mute:fullscreen";
                            break;
                        case "base":
                            d = '<div class="' + b.init._interface.continer + '-playerControl"></div><div class="' + b.init._interface.continer + '-playerVolume"></div><div class="' + b.init._interface.continer + '-playerMediaInfo"></div><div class="' + b.init._interface.continer + '-playerInfo"></div><div class="' + b.init._interface.continer + '-playerConfig"></div>';
                            b.init._script.buttons = b.init._script.buttons + ":play:stop:config:mute:fullscreen";
                            break;
                        case "vcam":
                            break;
                        case "http":
                            d = '<div class="' + b.init._interface.continer + '-playerInfo"></div>';
                            b.init._script.buttons = "";
                            break
                        }
                        var j = b.init._script.buttons.split(":");
                        for (var f = 0; f < j.length; f++) {
                            if (j[f] != "") {
                                l.buttons[j[f]].access = true
                            }
                        }
                    }
                    break;
                case "plugin":
                    if (l.parts[e].access) {
                        $("#" + l.parts.screen.box).append('<div id="' + l.parts[e].box + '"></div>')
                    }
                    break;
                default:
                    l.parts[e].jbox.html("")
                }
            }
            var k = $("#" + l.parts.toolbar.box);
            k.append(d);
            for (var g in l.buttons) {
                var h = l.buttons[g];
                if (h.access) {
                    this.__interfaceButton(h.d_class, h.txt, h.icon, h.event)
                }
            }
            $("." + b.init._interface.continer + "-playerVolume").append('<div id="' + b.init._interface.continer + '-player-volume"></div>');
            a.__volumeSlider()
        },
        __interfaceButton: function (f, h, c, e) {
            var g = $("." + f);
            var i = f + "-" + g[0].childNodes.length;
            var d = '<div id="' + i + '" class="btn-player ' + c + '" title="' + h + '"></div>';
            g.append(d);
            if (e) {
                $("#" + i).bind("click", {
                    doing: this.__api()
                }, e)
            }
        },
        __interfaceButtonSettings: function (g, e, c, f) {
            var h = $("." + g);
            var i = g + "-" + h[0].childNodes.length;
            var d = '<div id="' + i + '" class="' + c + ' btn-default" title="' + e + '">' + e + "</div>";
            h.append(d);
            if (f) {
                $("#" + i).bind("click", {
                    doing: this.__api()
                }, f)
            }
        },
        __keyboard: function () {
            var c = (function () {
                var e = {};
                var d = function (g) {
                    this.initedBy = g || "EventHorizon Core"
                };
                var f = d.prototype;
                f.add = function (j, k, g, i) {
                    var h = this.genId();
                    e[h] = {
                        event: j,
                        callback: k,
                        phase: (g) ? g : false,
                        stage: i || 1
                    };
                    document.addEventListener(e[h]["event"], e[h]["callback"], e[h]["phase"]);
                    return h
                };
                f.del = function (g) {
                    document.removeEventListener(e[g]["event"], e[g]["callback"], e[g]["phase"]);
                    delete e[g]
                };
                f.stage = function (g, h) {
                    out: switch (h) {
                    case (0):
                        if (e[g] !== 0) {
                            e[g].stage = 0;
                            document.removeEventListener(e[g]["event"], e[g]["callback"], e[g]["phase"])
                        }
                        break;
                    case (1):
                        if (e[g] !== 1) {
                            document.addEventListener(e[g]["event"], e[g]["callback"], e[g]["phase"]);
                            e[g].stage = 1
                        }
                        break;
                    default:
                        if (e[g].stage) {
                            document.addEventListener(e[g]["event"], e[g]["callback"], e[g]["phase"]);
                            e[g].stage = 1
                        } else {
                            document.removeEventListener(e[g]["event"], e[g]["callback"], e[g]["phase"]);
                            e[g].stage = 0
                        }
                        break out
                    }
                };
                f.init = function () {
                    var g = new EventHorizon(this);
                    e.treats = e.treats || {};
                    e.treats[this.genId()] = g;
                    return g
                };
                f.insert = function (j, h) {
                    for (var g in j) {
                        this[g] = (this[g]) ? ((h) ? ((j[g].clone) ? j[g].clone() : j[g]) : this[g]) : ((j[g].clone) ? j[g].clone() : j[g])
                    }
                };
                f.genId = function () {
                    var j = "",
                        k = "qwertyuiopasdfghjklzxcvbnm741028963";
                    for (var h = 0; h < 25; h++) {
                        j += k[parseInt(Math.random() * 31)]
                    }
                    return j
                };
                f.checkMySelf = function () {
                    return (this.checkMySelf) ? true : false
                };
                return new d()
            })();
            c.insert({
                keyCallbacks: {
                    17: {
                        recall: "/38/40/",
                        38: function () {
                            var e = (b.init._script.type == "ace") ? a.__api().plugin.audioVolume : a.__api().plugin.audio.volume;
                            if (e !== 200) {
                                var d = (e < 195) ? e + 5 : (e + (200 - e));
                                a.__control("changevolume", d);
                                $("#" + b.init._interface.continer + "-player-volume").slider("value", d)
                            }
                        },
                        40: function () {
                            var e = (b.init._script.type == "ace") ? a.__api().plugin.audioVolume : a.__api().plugin.audio.volume;
                            if (e !== 0) {
                                var d = (e > 5) ? e - 5 : e - (5 - e);
                                a.__control("changevolume", d);
                                $("#" + b.init._interface.continer + "-player-volume").slider("value", d)
                            }
                        },
                        67: function () {
                            a.__control("config")
                        },
                        39: function () {
                            a.__control("forward")
                        },
                        37: function () {
                            a.__control("backward")
                        },
                        192: function () {
                            a.__control("mute")
                        }
                    },
                    18: {
                        recall: "",
                        13: function () {
                            a.__control("fullscreen")
                        },
                        83: function () {
                            a.__control("stop")
                        },
                        80: function () {
                            a.__control("playlist")
                        }
                    },
                    onekey: {
                        recall: "",
                        32: function () {
                            a.__control("play")
                        },
                        27: function () {
                            b.init.isFullscreen = false
                        }
                    }
                },
                blockade: "/17/18/13/27/32/38/40/",
                startEventsStage: function (h) {
                    c.stage(c.ku, 1);
                    c.stage(c.kd, 1);
                    if (c.blockade.indexOf("/" + h.which + "/") >= 0) {
                        h.preventDefault()
                    }
                    var d = c.keyCallbacks;
                    if (c.callWay.length > 0) {
                        var g = d;
                        for (var f = 0; f < c.callWay.length; f++) {
                            g = (h.which === c.callWay[f]) ? g : g[c.callWay[f]]
                        }
                        if (c.callWay[c.callWay.length - 1] !== h.which) {
                            c.callWay.push(h.which)
                        }
                        if (g[h.which]) {
                            if (g.recall) {
                                if (g.recall.indexOf("/" + h.which + "/") < 0) {
                                    c.stage(c.kd, 0)
                                }
                            }
                            if (g[h.which] instanceof Function) {
                                g[h.which]()
                            }
                        }
                    } else {
                        if (d[h.which]) {
                            c.callWay.push(h.which)
                        } else {
                            if (d.onekey[h.which]) {
                                if (d.onekey.recall.indexOf("/" + h.which + "/") < 0) {
                                    c.stage(c.kd, 0)
                                }
                                if (d.onekey[h.which] instanceof Function) {
                                    d.onekey[h.which]()
                                }
                            }
                        }
                    }
                },
                stopEventsStage: function (d) {
                    if (c.callWay.length > 0) {
                        while (("/" + c.callWay.join("/") + "/").indexOf(d.which) >= 0) {
                            c.callWay.pop()
                        }
                        c.stage(c.ku, 1)
                    } else {
                        c.stage(c.ku, 0)
                    }
                    c.stage(c.kd, 1)
                },
                callWay: [],
                keyboardEventsOn: function () {
                    c.kd = c.add("keydown", c.startEventsStage);
                    c.ku = c.add("keyup", c.stopEventsStage);
                    c.stage(c.ku, 0)
                },
                keyboardEventsOff: function () {
                    c.del(c.kd);
                    c.del(c.ku)
                }
            });
            return c
        },
        __control: function (e, h) {
            if (!a.__api().__getPluginState()) {
                return false
            }
            this.__inf("For the plugin called event: " + e, "", "i");
            var c = b.init._script;
            var g = $("#" + b.init._interface.continer);
            switch (e) {
            case "play":
                if (c.isPause) {
                    g.find(".ico-pause").addClass("ico-play");
                    g.find(".ico-pause").removeClass("ico-pause");
                    c.isPause = false;
                    this.__api().__controlMethod("pause")
                } else {
                    c.isPause = true;
                    g.find(".ico-play").addClass("ico-pause");
                    g.find(".ico-play").removeClass("ico-play");
                    this.__api().__controlMethod("play")
                }
                break;
            case "stop":
                if (c.isPause) {
                    g.find(".ico-pause").addClass("ico-play");
                    g.find(".ico-pause").removeClass("ico-pause");
                    c.isPause = false
                }
                this.__api().__controlMethod("stop");
                break;
            case "mute":
                if (c.mute) {
                    g.find(".ico-volume-off").addClass("ico-volume-up");
                    g.find(".ico-volume-off").removeClass("ico-volume-off");
                    c.mute = false
                } else {
                    c.mute = true;
                    g.find(".ico-volume-up").addClass("ico-volume-off");
                    g.find(".ico-volume-up").removeClass("ico-volume-up")
                }
                var j = $("#" + b.init._interface.continer + "-player-volume");
                if (j.slider("value") == "0") {
                    j.slider("value", b.init._script.volume)
                } else {
                    b.init._script.volume = j.slider("value");
                    j.slider("value", 0)
                }
                this.__api().__controlMethod("mute");
                break;
            case "fullscreen":
                if (c.windowless) {} else {
                    this.__api().__controlMethod("fullscreen")
                }
                break;
            case "config":
                if (c.configBox) {
                    c.configBox = false;
                    $("#" + b.init._interface.continer + "-infoBox").remove();
                    $("#" + b.init._interface.continer + "-plugin").removeClass("infoBox-overlay")
                } else {
                    if (c.playlistBox) {
                        c.playlistBox = false;
                        $("#" + b.init._interface.continer + "-infoBox").remove();
                        $("#" + b.init._interface.continer + "-plugin").removeClass("infoBox-overlay")
                    }
                    c.configBox = true;
                    $("#" + b.init._interface.continer + "-plugin").addClass("infoBox-overlay");
                    $("#" + b.init._interface.continer + "-screen").append('<div id="' + b.init._interface.continer + '-infoBox"></div>');
                    $("#" + b.init._interface.continer + "-infoBox").append('<div class="infoBox-inner"><p>Aspect ratio for video screen</p><span class ="SettingsRatio"></span><p>Deinterlacing modes</p><span class ="SettingsDeint"></span><p>Audio channels</p><span class ="SettingsAudio"></span></div>');
                    var d = "SettingsRatio";
                    this.__interfaceButtonSettings(d, "1:1", "btn", function (i) {
                        a.__control("ratio", "1:1")
                    });
                    this.__interfaceButtonSettings(d, "4:3", "btn", function (i) {
                        a.__control("ratio", "4:3")
                    });
                    this.__interfaceButtonSettings(d, "16:9", "btn", function (i) {
                        a.__control("ratio", "16:9")
                    });
                    this.__interfaceButtonSettings(d, "16:10", "btn", function (i) {
                        a.__control("ratio", "16:10")
                    });
                    this.__interfaceButtonSettings(d, "221:100", "btn", function (i) {
                        a.__control("ratio", "221:100")
                    });
                    this.__interfaceButtonSettings(d, "5:4", "btn", function (i) {
                        a.__control("ratio", "5:4")
                    });
                    var k = "SettingsDeint";
                    this.__interfaceButtonSettings(k, "blend", "btn", function (i) {
                        a.__control("deinterlace", "blend")
                    });
                    this.__interfaceButtonSettings(k, "bob", "btn", function (i) {
                        a.__control("deinterlace", "bob")
                    });
                    this.__interfaceButtonSettings(k, "linear", "btn", function (i) {
                        a.__control("deinterlace", "linear")
                    });
                    this.__interfaceButtonSettings(k, "mean", "btn", function (i) {
                        a.__control("deinterlace", "mean")
                    });
                    this.__interfaceButtonSettings(k, "yadif", "btn", function (i) {
                        a.__control("deinterlace", "yadif")
                    });
                    this.__interfaceButtonSettings(k, "yadif2x", "btn", function (i) {
                        a.__control("deinterlace", "yadif2x")
                    });
                    this.__interfaceButtonSettings(k, "discard", "btn", function (i) {
                        a.__control("deinterlace", "discard")
                    });
                    var m = "SettingsAudio";
                    this.__interfaceButtonSettings(m, "stereo", "btn", function (i) {
                        a.__control("audioChannel", "1")
                    });
                    this.__interfaceButtonSettings(m, "r :stereo", "btn", function (i) {
                        a.__control("audioChannel", "2")
                    });
                    this.__interfaceButtonSettings(m, "left", "btn", function (i) {
                        a.__control("audioChannel", "3")
                    });
                    this.__interfaceButtonSettings(m, "right", "btn", function (i) {
                        a.__control("audioChannel", "4")
                    });
                    this.__interfaceButtonSettings(m, "dolby", "btn", function (i) {
                        a.__control("audioChannel", "5")
                    })
                }
                break;
            case "playlist":
                if (c.playlistBox) {
                    c.playlistBox = false;
                    $("#" + b.init._interface.continer + "-infoBox").remove();
                    $("#" + b.init._interface.continer + "-plugin").removeClass("infoBox-overlay")
                } else {
                    if (c.configBox) {
                        c.configBox = false;
                        $("#" + b.init._interface.continer + "-infoBox").remove();
                        $("#" + b.init._interface.continer + "-plugin").removeClass("infoBox-overlay")
                    }
                    c.playlistBox = true;
                    $("#" + b.init._interface.continer + "-plugin").addClass("infoBox-overlay");
                    $("#" + b.init._interface.continer + "-screen").append('<div id="' + b.init._interface.continer + '-infoBox"></div>');
                    $("#" + b.init._interface.continer + "-infoBox").append('<ul class="infoBox-inner"></ul>');
                    var f = 0;
                    var l = a.__api().__getPlaylist();
                    for (f; f < l.length; f++) {
                        if (f == 0) {} else {
                            if (b.init._player.stream != "") {
                                $(".infoBox-inner").append('<li data-play="' + l[f][1] + '">' + l[f][0] + "</li>")
                            }
                        }
                    }
                    $(".infoBox-inner li").bind("click", function () {
                        var i = [];
                        if (!b.init._ad.isView && b.init._ad.state) {
                            i[0] = [b.init._ad.link, b.init._ad.link]
                        }
                        i[1] = [this.getAttribute("data-play"), this.getAttribute("data-play")];
                        a.__api().__controlMethod("play", i)
                    })
                }
                this.__api().__controlMethod("playlist");
                break;
            case "backward":
                this.__api().__controlMethod("backward");
                break;
            case "forward":
                this.__api().__controlMethod("forward");
                break;
            case "ratio":
                this.__api().__controlMethod("ratio", h);
                break;
            case "deinterlace":
                this.__api().__controlMethod("deinterlace", h);
                break;
            case "changevolume":
                this.__api().__controlMethod("changevolume", h);
                break;
            case "audioChannel":
                this.__api().__controlMethod("audioChannel", h);
                break
            }
        },
        __player: function () {
            var h = b.init;
            var e, g = document.getElementById(h._interface.continer + "-plugin");
            if (g) {
                if (b.init._script.browser == "ie") {
                    var d = "";
                    var f = "";
                    d += 'id="' + b.init._interface.continer + '-plugin"';
                    d += 'bgcolor="' + b.init._interface.background + '"';
                    f += '<param name="ShowDisplay" value="true" />';
                    f += '<param name="id" value="' + b.init._interface.continer + '-plugin" />';
                    f += '<param name="bgcolor" value="' + b.init._interface.background + '" />';
                    f += '<param name="width" value="' + b.init._interface.width + '" />';
                    f += '<param name="height" value="' + b.init._interface.height + '" />';
                    if (b.init._script.type == "ace") {
                        f += '<embed type="' + b.init._player.ace.MimeType + '"   width="' + b.init._interface.width + '" height="' + b.init._interface.height + '"></embed>';
                        g.outerHTML = '<object classid="' + b.init._player.ace.classid + '"' + d + f + "</object>"
                    } else {
                        d += 'toolbar="false"';
                        f += '<param name="toolbar" value="false" />';
                        if (b.init._player.windowless) {
                            d += 'windowless="' + b.init._interface.windowless + '"';
                            f += '<param name="windowless" value="' + b.init._interface.windowless + '" />'
                        }
                        if (b.init._player.autoloop) {
                            d += 'loop="' + b.init._interface.autoloop + '"';
                            f += '<param name="loop" value="' + b.init._interface.autoloop + '" />'
                        }
                        f += '<embed type="' + b.init._player.vlc.MimeType + '"   width="' + b.init._interface.width + '" height="' + b.init._interface.height + '"></embed>';
                        g.outerHTML = '<object classid="' + b.init._player.vlc.classid + '"' + d + f + "</object>"
                    }
                    e = document.getElementById(h._interface.continer + "-plugin")
                } else {
                    var c = document.createElement("object");
                    if (b.init._script.type == "ace") {
                        c.setAttribute("type", b.init._player.ace.MimeType);
                        c.setAttribute("force", "true");
                        c.setAttribute("fscontrolsenable", "0");
                        c.setAttribute("defaultcontrolsforstream", "0");
                        if (b.init._player.autoplay) {
                            c.setAttribute("defaultcontrolsforstream", "0")
                        }
                    } else {
                        c.setAttribute("type", b.init._player.vlc.MimeType);
                        c.setAttribute("toolbar", "false");
                        c.setAttribute("allowfullscreen", "false");
                        if (b.init._player.windowless) {
                            c.setAttribute("windowless", b.init._player.windowless)
                        }
                        if (b.init._player.autoloop) {
                            c.setAttribute("autoloop", b.init._player.autoloop)
                        }
                    }
                    c.setAttribute("id", b.init._interface.continer + "-plugin");
                    c.setAttribute("bgcolor", b.init._interface.background);
                    c.setAttribute("width", b.init._interface.width);
                    c.setAttribute("height", b.init._interface.height);
                    g.parentNode.replaceChild(c, g);
                    e = c
                }
            }
            if (!a.__api().__getPluginState()) {
                return false
            }
            a.__inf("Mounted plugin - ", a.__version(), "i");
            return e
        },
        __playTime: function (f) {
            var g = {
                video_time: function (i) {
                    if (i == "end") {
                        if (b.init._script.type == "ace") {
                            return $("#" + b.init._interface.continer + "-plugin")[0].inputLength / 1000
                        } else {
                            return $("#" + b.init._interface.continer + "-plugin")[0].input.length / 1000
                        }
                    } else {
                        if (b.init._script.type == "ace") {
                            return $("#" + b.init._interface.continer + "-plugin")[0].inputTime / 1000 + 1
                        } else {
                            return $("#" + b.init._interface.continer + "-plugin")[0].input.time / 1000 + 1
                        }
                    }
                },
                time: function (j, i) {
                    var k = "" + j;
                    while (k.length < i) {
                        k = "0" + k
                    }
                    return k
                }
            };
            var e = parseInt(g.video_time(f));
            var h = e;
            var d = 0;
            var c = 0;
            if (h == 0) {}
            if (h > 60) {
                d = Math.floor(h / 60);
                h = parseInt((h - (d * 60)))
            }
            if (h > 3600) {
                c = Math.floor(d / 60);
                d = Math.floor(h / 60);
                h = parseInt((h - (d * 60)))
            }
            return g.time(c, 2) + ":" + g.time(d, 2) + ":" + g.time(h, 2)
        },
        __volumeSlider: function () {
            var c = $("#" + b.init._interface.continer + "-player-volume");
            c.slider({
                range: "min",
                min: 0,
                max: 150,
                value: 50,
                animate: true,
                start: function (d, e) {},
                slide: function (d, f) {
                    var e = c.slider("value")
                },
                stop: function (d, e) {
                    a.__control("changevolume", e.value)
                }
            })
        },
        __fullscreen: function (d) {
            var c = document.getElementById(d);
            if (b.init.isFullscreen) {
                b.init.isFullscreen = false;
                if (document.cancelFullScreen) {
                    document.cancelFullScreen()
                } else {
                    if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen()
                    } else {
                        if (document.webkitCancelFullScreen) {
                            document.webkitCancelFullScreen()
                        }
                    }
                }
            } else {
                b.init.isFullscreen = true;
                if (c.requestFullscreen) {
                    c.requestFullscreen()
                } else {
                    if (c.webkitRequestFullscreen) {
                        c.webkitRequestFullscreen()
                    } else {
                        if (c.mozRequestFullScreen) {
                            c.mozRequestFullScreen()
                        }
                    }
                }
            }
        },
        __version: function () {
            var c;
            if (b.init._script.type == "ace") {
                c = "ACE Stream plugin " + $("#" + b.init._interface.continer + "-plugin")[0].version
            } else {
                c = "VLC plugin " + $("#" + b.init._interface.continer + "-plugin")[0].VersionInfo
            }
            return c
        }
    };
    var b = {
        defaults: {
            _script: {
                debug: false,
                browser: "non-ie",
                type: "base",
                buttons: "",
                api_url: "http://hplayer.hmscript.net/api.php?pl=",
                mute: false
            },
            _player: {
                vlc: {
                    Name: "VideoLAN VLC ActiveX Plugin",
                    ActiveX: "VideoLAN.VLCPlugin.2",
                    MimeType: "application/x-vlc-plugin",
                    classid: "clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921"
                },
                ace: {
                    Name: "VLC Multimedia Plug-in",
                    ActiveX: "VideoLAN.VLCPlugin.2",
                    MimeType: "application/x-acestream-plugin",
                    classid: "clsid:79690976-ED6E-403c-BBBA-F8928B5EDE17"
                },
                autoplay: false,
                autoloop: false,
                windowless: false,
                thumbnail: "",
                stream: ""
            },
            _interface: {
                continer: "hPlayer",
                width: "936px",
                height: "464px",
                background: "#000000"
            },
            _ad: {
                state: false,
                link: "",
                time: 10000,
                isView: false
            }
        }
    };
    return {
        init: function (e, c) {
            var d;
            b.init = b.defaults;
            a.__inf("Check the current settings", "", "i");
            var f = b.init;
            f._script.browser = a.__agent();
            a.__inf("Check the browser", "", "i");
            if (e != null) {
                a.__inf("Checking for key changes to load and initialize the plugin", "", "i");
                for (d in e) {
                    switch (d) {
                    case "debug":
                        f._script.debug = e[d];
                        a.__inf(d, e[d], "s");
                        break;
                    case "type":
                        f._script.type = e[d];
                        a.__inf(d, e[d], "s");
                        break;
                    case "wrapper":
                        f._interface.continer = e[d];
                        a.__inf(d, e[d], "s");
                        break;
                    case "width":
                        f._interface.width = e[d];
                        a.__inf(d, e[d], "s");
                        break;
                    case "height":
                        f._interface.height = e[d];
                        a.__inf(d, e[d], "s");
                        break;
                    case "background":
                        f._interface.background = e[d];
                        a.__inf(d, e[d], "s");
                        break;
                    case "windowless":
                        f._player.windowless = e[d];
                        a.__inf(d, e[d], "s");
                        break;
                    case "autoplay":
                        f._player.autoplay = e[d];
                        a.__inf(d, e[d], "s");
                        break;
                    case "autoloop":
                        f._player.autoloop = e[d];
                        a.__inf(d, e[d], "s");
                        break;
                    case "stream":
                        f._player.stream = e[d];
                        a.__inf(d, e[d], "s");
                        break;
                    case "thumbnail":
                        f._player.thumbnail = e[d];
                        a.__inf(d, e[d], "s");
                        break;
                    case "ads_link":
                        f._ad.link = e[d];
                        a.__inf(d, e[d], "s");
                        break;
                    case "ads_time":
                        f._ad.time = e[d];
                        a.__inf(d, e[d], "s");
                        break;
                    case "ads":
                        f._ad.state = e[d];
                        a.__inf(d, e[d], "s");
                        break;
                    case "buttons":
                        f._script.buttons = e[d];
                        a.__inf(d, e[d], "s");
                        break;
                    case "api_url":
                        f._script.buttons = e[d];
                        a.__inf(d, e[d], "s");
                        break;
                    default:
                        a.__inf(d, e[d], "e")
                    }
                }
            } else {
                a.__inf("Check for key extension to load and initialize the plugin", "", "i");
                for (d in c) {
                    switch (d) {
                    case "debug":
                        f._script.debug = c[d];
                        a.__inf(d, c[d], "s");
                        break;
                    case "type":
                        f._script.type = c[d];
                        a.__inf(d, c[d], "s");
                        break;
                    case "wrapper":
                        f._interface.continer = c[d];
                        a.__inf(d, c[d], "s");
                        break;
                    case "width":
                        f._interface.width = c[d];
                        a.__inf(d, c[d], "s");
                        break;
                    case "height":
                        f._interface.height = c[d];
                        a.__inf(d, c[d], "s");
                        break;
                    case "background":
                        f._interface.background = c[d];
                        a.__inf(d, c[d], "s");
                        break;
                    case "windowless":
                        f._player.windowless = c[d];
                        a.__inf(d, c[d], "s");
                        break;
                    case "autoplay":
                        f._player.autoplay = c[d];
                        a.__inf(d, c[d], "s");
                        break;
                    case "autoloop":
                        f._player.autoloop = c[d];
                        a.__inf(d, c[d], "s");
                        break;
                    case "stream":
                        f._player.stream = c[d];
                        a.__inf(d, c[d], "s");
                        break;
                    case "thumbnail":
                        f._player.thumbnail = c[d];
                        a.__inf(d, c[d], "s");
                        break;
                    case "ads_link":
                        f._ad.link = c[d];
                        a.__inf(d, c[d], "s");
                        break;
                    case "ads_time":
                        f._ad.time = c[d];
                        a.__inf(d, c[d], "s");
                        break;
                    case "ads":
                        f._ad.state = c[d];
                        a.__inf(d, c[d], "s");
                        break;
                    case "buttons":
                        f._script.buttons = c[d];
                        a.__inf(d, c[d], "s");
                        break;
                    case "api_url":
                        f._script.buttons = c[d];
                        a.__inf(d, c[d], "s");
                        break;
                    default:
                        a.__inf(d, c[d], "e")
                    }
                }
            }
            a.__interface(f._interface.continer);
            a.__player();
            a.__api().__checker("start", null);
            a.__keyboard().keyboardEventsOn()
        },
        api: function () {
            return a.__api()
        },
        control: function (d, c) {
            this.init(null, c);
            a.__control(d)
        }
    }
}();
