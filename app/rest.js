app.rest = {

    spinnerFunct: function(){
    },

    getFile: function(url, successCallback, errorCallback){

        $.ajax({
            url: url,
            success: successCallback,
            error: errorCallback,
            cache: false
        });
    
    },

    get: function (url, successCallback, errorCallback, headers) {
        app.rest.getDelete(url, 'GET', successCallback, errorCallback, headers);
    },

    delete: function (url, successCallback, errorCallback, headers) {
        app.rest.getDelete(url, 'DELETE', successCallback, errorCallback, headers);
    },

    update: function (url, request, successCallback, errorCallback, headers) {
        app.rest.postPut(url, 'PUT', request, successCallback, errorCallback, headers);
    },

    post: function (url, request, successCallback, errorCallback, headers) {
        app.rest.postPut(url, 'POST', request, successCallback, errorCallback, headers);
    },

    isMock: function(url, method, request, successCallback, callBackIsnt){

        if(app.config.mockApi){
            var result = app.mock.execByUrl(url, method, request);
            successCallback(result);
        }else{
            callBackIsnt();
        }

    },

    getDelete: function (url, method, urlParams, successCallback, errorCallback, headers) {

        app.rest.isMock(url, method, null, successCallback, function(){

            var preparedUrl = null;

            if(urlParams !== undefined && urlParams !== null){
                preparedUrl = app.util.System.prepareUrl(url, urlParams);
            }else{
                preparedUrl = url;
            }

            $.ajax({
                url: preparedUrl,
                type: method,
                beforeSend: function () {
                    app.rest.spinnerFunct();
                },
                complete: function () {
                    app.rest.spinnerFunct = function () {};
                },
                headers: headers,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data, textStatus, jqXHR) {
                    successCallback(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {

                    if(errorCallback !== undefined){
                        errorCallback(jqXHR.status, jqXHR);
                    }

                }
            });


        });



    },

    postPut: function (url, method, request, successCallback, errorCallback, headers, urlParams) {

        app.rest.isMock(url, method, request, successCallback, function(){

            var preparedUrl = null;

            if(urlParams !== undefined && urlParams !== null){
                preparedUrl = app.util.System.prepareUrl(url, urlParams);
            }else{
                preparedUrl = url;
            }

            var jsonData = JSON.stringify(request);

            $.ajax({
                url: preparedUrl,
                type: method,
                beforeSend: function () {
                    app.rest.spinnerFunct();
                },
                complete: function () {
                    app.rest.spinnerFunct = function () {};
                },
                headers: headers,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: jsonData,
                success: function (data, textStatus, jqXHR) {
                    successCallback(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    errorCallback(jqXHR.status, jqXHR);
                }
            });

        });

    }


};