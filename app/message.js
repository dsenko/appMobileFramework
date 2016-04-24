app.message = {

    messages: null,

    define: function(object){
        app.message.messages = object;
    },

    get: function(_message){
        for(prop in  app.message.messages){
            if(prop.toString() == _message){
                for(prop2 in  app.message.messages[prop]){
                    if(prop2.toString() ==  app.config.lang){
                        return  app.message.messages[prop][prop2];
                    }
                }
            }
        }

    },

    replace: function(html){

        for(prop in  app.message.messages){
            html = html.split('msg('+prop.toString()+')').join( app.message.messages[prop][ app.config.lang]);
        }

        return html;

    },

};