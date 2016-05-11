
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

        $.each(idList, function (i, id) {

            var newId = id + '-' + app.util.System.hash();

            selectors[id] = function () {

                var selector = $('#' + newId);
                selector.plainId = newId;

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

        $(window).scrollTop(0);

        if(app.mCtx){
            app.lastModalName = _modal.fullName;
        }

        app.system.hideModal();

        app.system.waitUntilReady(_modal, function () {

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


        });
    },

    render: function (_controller, data, callBack) {

        $(window).scrollTop(0);

        if(app.ctx !== null){
            app.lastControllerName = app.ctx.fullName;
        }

        app.system.waitUntilReady(_controller, function () {

            app.ctx = $.extend(true, {}, app.controller[_controller.fullName]);

            app.system.waitUntilComponentsReady(function () {

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

                $.each(app.ctx.components, function (i, componentName) {

                    app.component[componentName].init(data);

                });

                if(callBack !== undefined) {
                    callBack();
                }



            });


        });
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
        navigator.app.exitApp();
    },

    mainRender: function (callBack) {
        app.system.render(app.controller[app.config.mainController], null, callBack);
    }


};


