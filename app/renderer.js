app.renderer = {

    define: function(name, template, renderPerContext){

        var htmlTemplate = null;

        if(renderPerContext == undefined || renderPerContext == null){
            renderPerContext = false;
        }

        if(renderPerContext == false){
            htmlTemplate = template();
        }else{
            htmlTemplate = template;
        }

        htmlTemplate = app.message.replace(htmlTemplate);

        var obj = {

            renderPerContext: renderPerContext,
            template: htmlTemplate,
            dataIds: null,
            bindings: null,
            listSelector: null,
            data: null,

            update: function(eCtx, compareField){

                var _this = this;

                $.each(this.dataIds, function(i, listObj){

                    if(listObj.context[compareField] == eCtx[compareField]){

                        _this.dataIds[i].context = eCtx;
                        _this.data[i] = eCtx;

                        var template = '';
                        if(_this.renderPerContext){
                            template = _this.template(i, eCtx);
                        }else{
                            template = _this.template();
                        }

                        var newListElementHtml = _this.renderElement(listObj.dataId, listObj.listElementId, template, listObj.context);

                        for(var prop in _this.bindings){
                            newListElementHtml = newListElementHtml.split('event('+prop+')').join('event="'+prop+'"');
                        }

                        $('*[liId="'+listObj.listElementId+'"]').replaceWith(newListElementHtml);

                    }

                });

            },

            renderElement: function(dataId, listElementId, html, element){

                html = html.replace('>', ' liId="'+listElementId+'" >');
                html = html.split('event(').join(' dataId="'+dataId+'" event(');

                for(var prop in element){
                    html = html.split('text('+prop+')').join(element[prop]);
                }

                return html;

            },

            render: function(listSelector, data, bindings, finishCallBack){

                var _this = this;

                var elementsHtml = [];

                var dataIds = [];

                var templatehtml = this.template;

                var html = templatehtml;

                var renderPerContext = this.renderPerContext;

                $.each(data, function(i, element){

                    if(renderPerContext){
                        html = templatehtml(i, element);
                    }

                    var listElementId = 'li-'+app.util.System.hash()+'-'+app.util.System.hash()+'-'+app.util.System.hash();
                    var dataId = 'element-'+app.util.System.hash()+'-'+app.util.System.hash()+'-'+app.util.System.hash();

                    html = _this.renderElement(dataId, listElementId, html, element);

                    dataIds.push({
                        listElementId: listElementId,
                        dataId: dataId,
                        context: element
                    });

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

                this.bindings = bindings;
                this.listSelector = listSelector;
                this.data = data;
                this.bind(listSelector, dataIds, bindings, data);

				if(finishCallBack){
					finishCallBack();
				}
				
				
            },

            bind: function(listSelector, dataIds, bindings, dataList){

                var dataIdsLocal = dataIds;

                listSelector.unbind();
                $.each(bindings, function(functionName, functionCallback){

                    listSelector.on('click', '[event="'+functionName+'"]', function(e){

                        var arrtributeDataId = $(e.currentTarget).attr('dataId');

                        $.each(dataIdsLocal, function(i, dataId){

                            if(dataId.dataId == arrtributeDataId){
                                e.eCtx = dataId.context;

                                var selector = $('*[dataId="' + dataId.dataId+'"]');
                                selector.dataId = dataId.dataId;
                                e.eCtxSelector = function(){
                                    return selector;
                                }
                            }

                        });

                        e.eCtxList = dataList;

                        functionCallback(e);

                    });

                });

                this.dataIds = dataIdsLocal;


            }


        }


        app.renderer[name] = obj;

    }

};