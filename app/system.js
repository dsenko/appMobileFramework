
$.app = {};

var app = {
    ctx: null,
    mCtx: null,
    DB_INSTANCE: null,
    online: false,
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

        app.cordova.checkNetwork();

        app.system.waitUntilReady(_modal, function () {

            app.mCtx = $.extend(true, {}, app.modal[_modal.fullName]);

            if (data == undefined) {
                data = null;
            }

            app.mCtx.render(data);

        });
    },

    render: function (_controller, data, callBack) {

        app.cordova.checkNetwork();

        app.system.waitUntilReady(_controller, function () {

            app.ctx = $.extend(true, {}, app.controller[_controller.fullName]);

            app.system.waitUntilComponentsReady(function () {

                app.system.hideModal();

                if (data == undefined) {
                    data = null;
                }

                app.ctx.render(data);

                $.each(app.ctx.components, function (i, componentName) {
                    app.component[componentName].init(data);
                });

                if(callBack !== undefined) {
                    callBack();
                }
            });


        });
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

    exit: function(){
        navigator.app.exitApp();
    },

    mainRender: function (callBack) {
        app.system.render(app.controller[app.config.mainController], null, callBack);
    }


};


