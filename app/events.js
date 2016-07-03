app.events = {

    domEvents: function(){

    },

    onOnline: function(){

    },

    onOffline: function(){

    },

    onBack: function(){

    },

    onDeviceReady: function(){

    },

    onReady: function(){

    },

    extend: function(eventName, eventCallback){

        if(eventName == "render"){
            eventName = "onRender";
        }

        if(eventName == "offline"){
            eventName = "onOffline";
        }

        if(eventName == "online"){
            eventName = "onOnline";
        }

        if(eventName == "dom"){
            eventName = "domEvents";
        }

        if(eventName == "back"){
            eventName = "onBack";
        }

        if(eventName == 'ready'){
            eventName = 'onReady'
        }

        app.events[eventName] = eventCallback;

    }


};