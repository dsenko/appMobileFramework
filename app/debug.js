app.debug = {

    print: function(msg, obj){

        if(app.config.debug){
            console.log(msg);

            if(obj !== undefined){
                console.log(obj);
            }
        }


    }

};