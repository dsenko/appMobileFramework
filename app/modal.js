app.modal = {

    register: function (name, obj) {

        obj.name = name.substring(0, 1).toLowerCase() + name.substring(1, name.length);
        obj.fullName = name;

        obj.data = {};
        obj.ready = false;
        app.modal[name] = obj;

        var tempTemplateId = '#temp-template-' +  app.util.System.hash();
        $('body').append('<div id="' + tempTemplateId.replace('#', '') + '"></div>');

        $(tempTemplateId).load(app.config.viewsPath+"/modal/" + obj.name + "/" + obj.name + ".view.html", function () {

            var modalSelector = $('[mainmodal]');
            var newModalId = 'modal-' +  app.util.System.hash();
            modalSelector.attr('modalselector', newModalId);

            app.modal[name].id = newModalId;
            app.modal[name].selfSelector = function(){
                return $('[modalselector="'+newModalId+'"]');
            }

            obj.show = function () {

                $('body').removeClass('modal-open');

                var backgroundModalSelector = $('.modal-backdrop');

                if(backgroundModalSelector && backgroundModalSelector.length > 1){
                    $(backgroundModalSelector[0]).fadeOut(200, function(){ $(this).remove();});
                }

                app.modal[name].selfSelector().modal('show');

                app.modal[name].selfSelector().on('hidden.bs.modal', function () {

                    app.mCtx = null;

                });

            };

            obj.hide = function (callBack) {

                if(!app.modal[name].preventDismiss){
                    app.modal[name].selfSelector().modal('hide');
                }


            };

            obj.render = function (data) {

                $('[modal="' + obj.name + '"]').html(obj.template);

                if(obj.preventDismiss){
                    obj.selfSelector().modal({
                        backdrop: 'static',
                        keyboard: false
                    });

                }else{
                    obj.selfSelector().modal();
                }


                obj.init(data);
                obj.show();

            };

            obj.forceHide = function(){

                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                $('[modal="' + obj.name + '"]').html('');
                app.mCtx = null;

            }

            var templateHtml = $(tempTemplateId).html();

            var selectorsObj =  app.system.createSelectors(templateHtml);

            app.modal[name].selector = selectorsObj.selectors;
            templateHtml = selectorsObj.html;
            templateHtml = app.message.replace(templateHtml);

            app.modal[name].template = templateHtml;

            $(tempTemplateId).remove();

            app.modal[name].ready = true;

        });

    },

};