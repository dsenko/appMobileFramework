app.crud = {


    replaceBooleanToString: function(sql){

        sql = sql.split("'true'").join("'bool_true'");
        sql = sql.split("'false'").join("'bool_false'");

        return sql;

    },

    execute: function (sql, successCallback, errorCallback) {


        if(typeof sql !== 'string'){
            sql = sql();
        }

        sql = this.replaceBooleanToString(sql);
        console.log(sql);

        var array = [];
        var lastId = null;

        app.DB_INSTANCE.transaction(function (tx) {

            tx.executeSql(sql, [], function (tx,
                                             results) {

                var len = results.rows.length, i;

                for (i = 0; i < len; i++) {

                    var item = results.rows.item(i);
                    array.push(item);

                }

                if(sql.toLowerCase().indexOf('insert') > -1){
                    lastId =  results.insertId;
                }

            }, null);

        }, function (err) {
            if (errorCallback !== undefined) {
                errorCallback();
            }
            console.error(err);
        }, function () {
            if(successCallback !== undefined){

                if(sql.toLowerCase().indexOf('insert') != -1){
                    successCallback(lastId);
                }else{
                    successCallback(array);
                }


            }
        });

    },

    builder: {

        findById: function(tableName, id){
            return "select * from "+tableName+" where id = "+id;
        },

        deleteById: function(tableName, id){
            return "delete from "+tableName+" where id = "+id;
        },

        drop: function (tableName) {
            return 'DROP TABLE IF EXISTS ' + tableName;
        },

        count: function(tableName){
            return 'select count(*) as count from '+tableName;
        },

        create: function (tableName, columns) {

            var sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (id INTEGER PRIMARY KEY';

            for (var i = 0; i < columns.length; i++) {
                sql += ', ' + columns[i];
            }

            sql += ')';

            return sql;
        },

        findAll: function (tableName) {
            return 'SELECT * FROM ' + tableName;
        },

        select: function (tableName, values, columns) {

            var sql = "";


                sql = "select * from " + tableName + " where ";


            for (var i = 0; i < values.length; i++) {

                if(typeof values[i] == 'string' || typeof values[i] == 'boolean'){
                    sql +=  ' '+columns[i]+"='"+values[i] + "' and ";
                }else{
                    sql +=  ' '+columns[i]+"="+values[i] + " and ";
                }






            }

            sql = sql.substr(0, sql.length - 4);

            return sql;

        },

        insert: function (tableName, values, columns) {

            var sql = "";

            if(columns !== undefined){

                sql = "INSERT INTO " + tableName + " (";

                for (var i = 0; i < columns.length; i++) {
                    sql += columns[i] + ',';
                }

                sql = sql.substr(0, sql.length - 1);

                sql += ") VALUES (";

            }else{
                sql = "INSERT INTO " + tableName + " VALUES (";
            }


            for (var i = 0; i < values.length; i++) {

                if(typeof values[i] == 'string' || typeof values[i] == 'boolean'){
                    sql +=  " '"+values[i] + "',";
                }else{
                    sql +=  " "+values[i] + ",";
                }


            }

            sql = sql.substr(0, sql.length - 1);

            sql += ")";

            return sql;

        },

        update: function (tableName, id, values, columns) {

            var sql = "";

            sql = "UPDATE " + tableName + " SET ";


            for (var i = 0; i < values.length; i++) {

                if(typeof values[i] == 'string' || typeof values[i] == 'boolean'){
                    sql +=  ' '+ columns[i]+"= '"+values[i] + "',";
                }else{
                    sql += ' '+columns[i]+"= "+values[i] + ",";
                }


            }

            sql = sql.substr(0, sql.length - 1);

            sql += " where id = "+id;

            return sql;

        }


    }

};