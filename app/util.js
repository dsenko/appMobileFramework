app.util = {
    register: function (name, obj) {
        app.util[name] = obj;
    },

    System: {

        isNull: function(obj){

            if(obj == undefined || obj == null){
                return true;
            }

            return false;

        },

        prepareUrl: function(url, params){

            for(var prop in params){
                url = url.replace('{'+prop+'}', params[prop]);
            }
            
            return url;

        },

        findStringBetween: function (str, first, last) {

            var r = new RegExp(first + '(.*?)' + last, 'gm');
            var arr = str.match(r);

            if (arr == null || arr.length == 0) {
                return [];
            }

            var arr2 = [];

            for (var i = 0; i < arr.length; i++) {
                arr2.push(arr[i].replace('id="', '').replace('"', ''));
            }

            return arr2;

        },

        hash: function () {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }

    }
};
