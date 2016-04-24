app.query = {

    defineList: function(list){

        $.each(list, function(i, queryObj){
            app.query.define(queryObj.name, queryObj.sql, queryObj.group);
        });

    },

    define: function(name, sql, group){

        var obj = {

            sql: sql,
            bind: function(valueList){

                var sql = this.sql;

                for (var i = 0; i < valueList.length; i++) {

                    if(typeof valueList[i] == 'string'){
                        sql = sql.replace('?', "'"+valueList[i]+"'");
                    }else{
                        sql = sql.replace('?', valueList[i]);
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