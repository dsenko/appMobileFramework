
app.cordova = {

    initializeCordova: function(callBack){
        app.cordova.bindDOMEvents();
        callBack();
    },

    bindDOMEvents: function() {

        document.addEventListener('deviceready', app.cordova.onDeviceReady, false);
        document.addEventListener('backbutton', app.cordova.onBack, false);

        if(app.events.domEvents !== undefined){
            app.events.domEvents();
        }

    },

    checkNetwork : function(){

        app.plugins.wrapper.network.connection(function(){
            app.cordova.onOnline();
        }, function(){
            app.cordova.onOffline();
        });

    },


    onBack : function(e){
        
        if(e){
            e.preventDefault();
        }
        
        console.log('x');
        if(app.mCtx !== null && app.mCtx.onBack !== undefined){
            app.mCtx.onBack();
        }else if(app.mCtx !== null && app.mCtx.onBack == undefined) {
            app.system.hideModal();
        }else if(app.ctx !== null && app.ctx.onBack !== undefined){
            app.ctx.onBack();
        }else{

            if(app.events.onBack !== undefined){
                app.events.onBack();
            }

        }

    },

    onDeviceReady: function() {
        app.cordova.checkNetwork(function(){});
    },

    onOnline: function() {
        app.online = true;

        if(app.events.onOnline !== undefined){
            app.events.onOnline();
        }

    },

    onOffline: function() {

        app.online = false;

        if(app.events.onOffline !== undefined){
            app.events.onOffline();
        }

    },

};