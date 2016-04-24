app.global = {

    define: function(name, value){


        app.global[name] = {

            get: function(){
                return window[name];
            },

            set: function(val){
                window[name] = val;
            }

        };

        window[name] = value;

    },

    defineMap: function(hashMap){


        $.each(hashMap, function(i, _global){
            app.global.define(_global.name, _global.initial);
        });


    },


};