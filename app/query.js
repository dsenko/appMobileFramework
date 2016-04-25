app.query = {

    defineList: function(list){

        $.each(list, function(i, queryObj){
            app.query.define(queryObj.name, queryObj.sql, queryObj.group);
        });

    },

    define: function(name, sql, group){

        var obj = {

            sql: sql,
            bind: function(valueListOrObj){

                var sql = this.sql;

                if(valueListOrObj instanceof Array) {

                    for (var i = 0; i < valueListOrObj.length; i++) {

                        if (typeof valueListOrObj[i] == 'string') {
                            sql = sql.replace('?', "'" + valueListOrObj[i] + "'");
                        } else {
                            sql = sql.replace('?', valueListOrObj[i]);
                        }

                    }

                }else{

                    for(var fieldName in valueListOrObj){

                        var fieldValue = valueListOrObj[fieldName];

                        if (typeof fieldValue == 'string') {
                            sql = sql.replace(':'+fieldName, "'" + valueListOrObj[i] + "'");
                        } else {
                            sql = sql.replace(':'+fieldName, fieldValue);
                        }

                    }

                }


                return sql;

            },

            execute: function(successCallback, errorCallback, valueList){

                var sqlToExecute = this.sql;

                if(valueList !== undefined){
                    sqlToExecute = this.bind(valueList);
                }

                crud.execute(sqlToExecute, successCallback, errorCallback);
            }



        }

        if(group == undefined){

            app.query[name] = obj;

        }else{

            if(app.query[group] == undefined){
                app.query[group] = {};
            }

            app.query[group][name] = obj;
        }

    }

};