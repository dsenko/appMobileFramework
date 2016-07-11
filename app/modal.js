app.modal = {

    register: function (name, obj) {

        obj.name = name.substring(0, 1).toLowerCase() + name.substring(1, name.length);
        obj.fullName = name;

        obj.data = {};
        obj.ready = false;
        //obj = obj;

      //  var tempTemplateId = '#temp-template-' +  app.util.System.hash();
      //  $('body').append('<div id="' + tempTemplateId.replace('#', '') + '"></div>');

        var templateName = app.config.viewsPath+"/modal/" + obj.name + "/" + obj.name + ".view.html";
        var templateHtml = templates[templateName];

        var tempTemplateId = '#temp-template-' +  app.util.System.hash();
        $('body').append('<div id="' + tempTemplateId.replace('#', '') + '"></div>');

        $(tempTemplateId).html(templateHtml);

        var modalSelector = $('[mainmodal]');
        var newModalId = 'modal-' +  app.util.System.hash();
        modalSelector.attr('modalselector', newModalId);

        obj.id = newModalId;
        obj.selfSelector = function(){
            return $('[modalselector="'+newModalId+'"]');
        }

        obj.show = function () {

            $('body').removeClass('modal-open');

            var backgroundModalSelector = $('.modal-backdrop');

            if(backgroundModalSelector && backgroundModalSelector.length > 1){
                $(backgroundModalSelector[0]).fadeOut(200, function(){ $(this).remove();});
            }

            obj.selfSelector().modal('show');

            obj.selfSelector().on('hidden.bs.modal', function () {

                console.log('hide2');
                if(app.mCtx.onHide){
                    app.mCtx.onHide();
                }

                obj.forceHide();


            });

        };

        obj.hide = function (callBack) {

            if(!obj.preventDismiss){
                console.log('hide1');
                obj.forceHide();
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

            console.log('force hide');

            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            $('[modal="' + obj.name + '"]').html('');
            app.mCtx = null;

        }

        templateHtml =  $(tempTemplateId).html();
        $(tempTemplateId).remove();

        var selectorsObj =  app.system.createSelectors(templateHtml);

        obj.selector = selectorsObj.selectors;
        templateHtml = selectorsObj.html;
        templateHtml = app.message.replace(templateHtml);

        obj.template = templateHtml;


        obj.ready = true;

        app.modal[name] = obj;



    },

};