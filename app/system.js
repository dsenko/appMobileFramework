
$.app = {};

var app = {
    ctx: null,
    mCtx: null,
    DB_INSTANCE: null,
    online: false,
    lastControllerName: null,
    lastModalName: null,
    langChanged: false,
};


app.system = {

    createSelectors: function (templateHtml) {

        var selectors = {};

        var idList = app.util.System.findStringBetween(templateHtml, 'id="', '"');
        var nameList = app.util.System.findStringBetween(templateHtml, 'name="', '"');


        selectors.names = {};

        $.each(nameList, function (i, name) {

            selectors.names[name] = function(){
                return $('*[name="' + name+'"]');
            }

        });

        $.each(idList, function (i, id) {

            var newId = id + '-' + app.util.System.hash();

            selectors[id] = function (eventsToBind) {

                var selector = $('#' + newId);
                selector.plainId = newId;

                $.each(eventsToBind, function(eventName, eventCallback){

                    if(eventName == 'click'){
                        selector.click(eventCallback);
                    }else if(eventName == 'change'){
                        selector.change(eventCallback);
                    }else {
                        selector.on(eventName, eventCallback);
                    }

                });

                return selector;

            };

            templateHtml = templateHtml.replace('id="'+id+'"', 'id="'+newId+'"');

        });

        return {
            html: templateHtml,
            selectors: selectors
        };
    },

    waitUntilReady: function (_controller, callBack) {

        if (_controller.ready !== true) {
            setTimeout(function () {
                app.system.waitUntilReady(_controller, callBack);
            }, 10);
            return;
        } else {
            callBack();
        }

    },

    waitUntilComponentsReady: function (callBack) {

        if (app.component.componentsReady !== app.component.total) {
            setTimeout(function () {
                app.system.waitUntilComponentsReady(callBack);
            }, 10);
            return;
        } else {
            callBack();
        }

    },

    renderModal: function (_modal, data) {

        if(!_modal.preventScroll){
            $(window).scrollTop(0);
        }


        if(app.mCtx){
            app.lastModalName = _modal.fullName;
        }

        app.system.hideModal();

       // app.system.waitUntilReady(_modal, function () {

            if(_modal.checkNetwork == true){
                app.cordova.checkNetwork();
            }

            app.mCtx = $.extend(true, {}, app.modal[_modal.fullName]);

            if (data == undefined) {
                data = null;
            }

            app.mCtx.render(data);

            if( app.events.onRender !== undefined && app.events.onRender !== null){
                app.events.onRender();
            }


       // });
    },

    renderLastController: function(){
        app.system.render(app.controller[app.lastControllerName]);
    },

    renderLastModal: function(){
        app.system.renderModal(app.modal[app.lastModalName]);
    },

    render: function (_controller, data, callBack) {

      /*  if(app.util.System.isFunction(data)){
            callBack = data;
        }*/

        $(window).scrollTop(0);

        if(app.ctx !== null){
            app.lastControllerName = app.ctx.fullName;
        }

       // app.system.waitUntilReady(_controller, function () {

            app.ctx = $.extend(true, {}, app.controller[_controller.fullName]);

           // app.system.waitUntilComponentsReady(function () {

                app.system.hideModal();

                if(_controller.checkNetwork == true){
                    app.cordova.checkNetwork();
                }

                if (data == undefined) {
                    data = null;
                }

                app.ctx.render(data);

                if( app.events.onRender !== undefined && app.events.onRender !== null){
                    app.events.onRender();
                }


                if(app.ctx.components instanceof Array){

                    $.each(app.ctx.components, function(i, componentName){
                        app.component[componentName].init(data);
                    });

                }else{

                    $.each(app.ctx.components, function(componentName, componentParams){
                        var params = $.app.extendObj(data, componentParams);
                        app.component[componentName].init(params);
                    });


                }

                if(callBack !== undefined) {
                    callBack();
                }



          //  });


        //});
    },

    backPrevious: function(){

        if(app.lastControllerName !== null){
            app.system.render(app.controller[app.lastControllerName]);
        }


    },

    hideModal: function () {

        if (app.mCtx) {
            app.mCtx.hide();
        }

    },


    init: function (callBack) {

        $(document).ready(function () {

            app.cordova.initializeCordova(function () {

                if(app.config.mobileRun){
                    app.cordova.deviceReadyCallBack = function(){
                        app.database.createDB(callBack);
                    };
                }else{
                    app.events.onDeviceReady();
                    app.database.createDB(callBack);
                }

            });

        });


    },

    changeLanguage: function(langCode){
        app.config.lang = langCode;

        console.log(app.config.lang);

        $.each(app.controller, function(controllerName, controllerObj){

            if(controllerName !== 'register'){

                var templateHtml = app.controller[controllerName].plainTemplate
                templateHtml = app.message.replace(templateHtml);
                app.controller[controllerName].template = templateHtml;

            }

        });

        app.system.render(app.controller[app.ctx.fullName], app.ctx.data)

    },

    exit: function(){
        if(app.config.mobileRun){
            navigator.app.exitApp();
        }else{
            console.warn('EXIT APP');
            app.system.hideModal();
        }


    },

    mainRender: function (callBack) {

        if (app.events.onReady !== undefined) {
            console.log('EVENT READY');
            app.events.onReady();
        }

        app.system.render(app.controller[app.config.mainController], null, callBack);

    },

};

