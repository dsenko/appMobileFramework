app.mock = {

    api: {},

    execByUrl: function(url, method, request){

        for(prop in app.mock.api){
            if(app.mock.api[prop].url == url){
                return app.mock.api[prop].exec(request);
            }
        }

    },

    execByName: function(name, method, request){

        for(prop in app.mock.api){
            if((prop == name) && (app.mock.api[prop].method == method.toLowerCase())){
                return app.mock.api[prop].exec(request);
            }
        }

    },

    registerList: function(mockList){

        $.each(mockList, function(i, mockObj){
           app.mock.register(mockObj.name, mockObj.url, mockObj.method, mockObj.returning);
        });

    },

    register: function(name, url, method, returning){

        var urlVal = null;

        if(typeof url == 'string'){
            urlVal = url;
        }else{
            urlVal = url();
        }

        app.mock.api[name] = {
            url: urlVal,
            method: method,
            exec: returning
        }

    },


};