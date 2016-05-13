app.controller = {

    register: function (name, obj) {

        if(obj.components == undefined || obj.components == null){
            obj.components = [];
        }

        if(obj.view == undefined || obj.view == null){
            obj.view = 'main';
        }

        obj.name = name.substring(0, 1).toLowerCase() + name.substring(1, name.length);
        obj.fullName = name;

        obj.render = function (data) {
            $('[view="' + app.ctx.view + '"]').html(obj.template);
            obj.init(data);
        };

        obj.componentsReady = 0;

        if(obj.data == undefined){
            obj.data = {};
        }

        obj.ready = false;
        app.controller[name] = obj;

        var tempTemplateId = '#temp-template-' + app.util.System.hash();
        $('body').append('<div id="' + tempTemplateId.replace('#', '') + '"></div>');

        $(tempTemplateId).load(app.config.viewsPath+"/controller/" + obj.name + "/" + obj.name + ".view.html", function () {

            var templateHtml = $(tempTemplateId).html();

            var selectorsObj = app.system.createSelectors(templateHtml);

            app.controller[name].selector = selectorsObj.selectors;
            templateHtml = selectorsObj.html;


            if(app.controller[name].components instanceof Array){

                $.each(app.controller[name].components, function(i, componentName){
                    var _component = app.component[componentName];

                    templateHtml = templateHtml.split('<component name="'+_component.name+'"></component>').join(_component.template);
                });


            }else{

                $.each(app.controller[name].components, function(componentName, componentParams){
                    var _component = app.component[componentName];

                    templateHtml = templateHtml.split('<component name="'+_component.name+'"></component>').join(_component.template);
                });


            }


            app.controller[name].plainTemplate = templateHtml;

            templateHtml = app.message.replace(templateHtml);
            app.controller[name].template = templateHtml;
            $(tempTemplateId).remove();

            app.controller[name].ready = true;

        });

    },

};

$acr = app.controller.register;