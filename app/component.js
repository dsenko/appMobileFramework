
app.component = {

    total: 0,
    componentsReady: 0,

    register: function (name, obj) {

        app.component.total++;

        obj.type = 'COMPONENT';
        obj.name = name.substring(0, 1).toLowerCase() + name.substring(1, name.length);
        obj.fullName = name;
        obj.ready = false;

        obj.data = {};

        obj.clean = function(){
            app.component[name].data = {};
        }

        app.component[name] = obj;

       // var tempTemplateId = '#temp-template-' + app.util.System.hash();
       // $('body').append('<div id="' + tempTemplateId.replace('#', '') + '"></div>');

        var templateName = app.config.viewsPath+"/component/" + obj.name + "/" + obj.name + ".view.html";
        var templateHtml = templates[templateName];

        var selectorsObj = app.system.createSelectors(templateHtml);
        app.component[name].selector = selectorsObj.selectors;
        templateHtml = selectorsObj.html;


        app.component[name].template = templateHtml;
        app.component[name].ready = true;
        app.component.componentsReady++;

        /*
        $(tempTemplateId).load(app.config.viewsPath+"/component/" + obj.name + "/" + obj.name + ".view.html", function () {

            var templateHtml = $(tempTemplateId).html();


            var selectorsObj = app.system.createSelectors(templateHtml);
            app.component[name].selector = selectorsObj.selectors;
            templateHtml = selectorsObj.html;

            console.log('COMPONENT '+obj.name);
            console.log(templateHtml);

            app.component[name].template = templateHtml;
            $(tempTemplateId).remove();

            app.component[name].ready = true;

            app.component.componentsReady++;

        });*/

    }

};