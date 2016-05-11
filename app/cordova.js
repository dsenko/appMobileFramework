app.cordova = {

    deviceReadyCallBack: null,

    initializeCordova: function (callBack) {
        app.cordova.bindDOMEvents();
        callBack();
    },

    bindDOMEvents: function () {

        document.addEventListener('deviceready', app.cordova.onDeviceReady, false);
        document.addEventListener('backbutton', app.cordova.onBack, false);

        if (app.events.domEvents !== undefined) {
            app.events.domEvents();
        }

    },

    checkNetwork: function () {

        app.plugins.wrapper.network.connection(function () {
            app.cordova.onOnline();
        }, function () {
            app.cordova.onOffline();
        });

    },


    onBack: function (e) {

        if (e) {
            e.preventDefault();
        }

        if (app.mCtx !== null && app.mCtx.onBack !== undefined) {
            console.log('on back mctx');
            app.mCtx.onBack();
        } else if (app.mCtx !== null && app.mCtx.onBack == undefined) {
            console.log('on back mctx2');
            app.system.hideModal();
        } else if (app.ctx !== null && app.ctx.onBack !== undefined) {
            console.log('on back ctx');
            app.system.hideModal();
            app.ctx.onBack();
        }else{

            console.log('on back event');

                if (app.events.onBack !== undefined) {
                    app.events.onBack();
                }

        }

    },

    onDeviceReady: function () {

        if (app.cordova.deviceReadyCallBack !== undefined && app.cordova.deviceReadyCallBack !== null) {
            app.cordova.deviceReadyCallBack();
        }

    },

    onOnline: function () {
        app.online = true;

        if (app.events.onOnline !== undefined) {
            app.events.onOnline();
        }

    },

    onOffline: function () {

        app.online = false;

        if (app.events.onOffline !== undefined) {
            app.events.onOffline();
        }

    },

};