app.renderer = {

    define: function(name, template){

        var htmlTemplate = null;

        if(typeof template == 'string'){
            htmlTemplate = template;
        }else{
            htmlTemplate = template();
        }

        htmlTemplate = app.message.replace(htmlTemplate);

        var obj = {

            template: htmlTemplate,

            render: function(listSelector, data, bindings){

                var elementsHtml = [];

                var dataIds = [];

                var templatehtml = this.template;
                var html = templatehtml;

                $.each(data, function(i, element){

                    var dataId = 'element-'+app.util.System.hash();

                    html = html.split('event(').join(' dataId="'+dataId+'" event(');

                    dataIds.push({
                        dataId: dataId,
                        context: element
                    });

                    for(var prop in element){
                        html = html.split('text('+prop+')').join(element[prop]);
                    }

                    elementsHtml.push(html);

                    html = templatehtml;

                });

                html = '';

                for(var i = 0;i<elementsHtml.length;i++){
                    html += elementsHtml[i];
                }

                for(var prop in bindings){
                    html = html.split('event('+prop+')').join('event="'+prop+'"');
                }

                listSelector.html(html);
                this.bind(listSelector, dataIds, bindings);

            },

            bind: function(listSelector, dataIds, bindings){

                var dataIdsLocal = dataIds;

                $.each(bindings, function(functionName, functionCallback){

                    listSelector.on('click', '[event="'+functionName+'"]', function(e){

                        var arrtributeDataId = $(e.currentTarget).attr('dataId');

                        $.each(dataIdsLocal, function(i, dataId){

                            if(dataId.dataId == arrtributeDataId){
                                e.eCtx = dataId.context;
                            }

                        });

                        functionCallback(e);

                    });

                });


                /*
                for(var prop in bindings){

                    var event = 'click'
                    if(bindings[prop].eventType !== undefined){
                        event = bindings[prop].eventType;
                    }

                   listSelector.on(event, '[event="'+prop+'"]', function(e){

                       var arrtributeDataId = $(e.currentTarget).attr('dataId');

                       $.each(dataIdsLocal, function(i, dataId){

                           if(dataId.dataId == arrtributeDataId){
                               e.eCtx = dataId.context;
                           }

                       });

                       bindings[prop](e);

                   });

                }*/

            }


        }


        app.renderer[name] = obj;

    }

};