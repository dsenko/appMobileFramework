app.rest = {

    spinnerFunct: function(){
    },

    get: function (url, successCallback, errorCallback, urlParams, headers) {
        app.rest.getDelete(url, 'GET', successCallback, errorCallback, urlParams, headers);
    },

    delete: function (url, successCallback, errorCallback, urlParams, headers) {
        app.rest.getDelete(url, 'DELETE', successCallback, errorCallback, urlParams, headers);
    },

    update: function (url, request, successCallback, errorCallback, urlParams, headers) {
        app.rest.postPut(url, 'PUT', request, successCallback, errorCallback, urlParams, headers);
    },

    post: function (url, request, successCallback, errorCallback, urlParams, headers) {
        app.rest.postPut(url, 'POST', request, successCallback, errorCallback, urlParams, headers);
    },

    isMock: function(url, method, request, successCallback, callBackIsnt){

        if(app.config.mockApi){
            var result = app.mock.execByUrl(url, method, request);
            successCallback(result);
        }else{
            callBackIsnt();
        }

    },

    getDelete: function (url, method, successCallback, errorCallback, urlParams, headers) {

        app.rest.isMock(url, method, urlParams, successCallback, function(){

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

                        console.log(jqXHR);

                        errorCallback(jqXHR.responseJSON, jqXHR.status, jqXHR);

                    }

                }
            });


        });



    },

    postPut: function (url, method, request, successCallback, errorCallback, urlParams, headers) {

        app.rest.isMock(url, method, request, successCallback, function(){

            console.log(headers);
            
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

                    if(errorCallback !== undefined){

                        console.log(jqXHR);

                        errorCallback(jqXHR.responseJSON, jqXHR.status, jqXHR);

                    }

                }
            });

        });

    }


};