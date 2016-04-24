app.events = {

    domEvents: function(){

    },

    onOnline: function(){

    },

    onOffline: function(){

    },

    onBack: function(){

    },

    extend: function(eventName, eventCallback){

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

        app.events[eventName] = eventCallback;

    }


};