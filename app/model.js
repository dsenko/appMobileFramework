app.model = {

    createScripts: [],
    dropScripts: [],

    define: function (name, fieldList) {

        var columnsWithId = $.app.copyArray(fieldList).unshift('id');
        var nameUpperCase = name.toUpperCase();
        var dropTableSql =  app.crud.builder.drop(nameUpperCase);
        var createTableSql =  app.crud.builder.create(nameUpperCase, fieldList);
        var findAllSql =  app.crud.builder.findAll(nameUpperCase);

        app.model.createScripts.push(createTableSql);
        app.model.dropScripts.push(dropTableSql);

        var obj = {

            table: nameUpperCase,
            name: nameUpperCase,
            columns: fieldList,
            columnsAll: columnsWithId,
            dropSQL: dropTableSql,
            createSQL: createTableSql,
            findAllSQL: findAllSql,

            new: function (objList) {

                var modelObj = {};

                for (var i = 0; i < this.columns; i++) {

                    if (objList[this.columns[i]] !== undefined) {
                        modelObj[this.columns[i]] = objList[this.columns[i]];
                    } else {
                        modelObj[this.columns[i]] = null;
                    }

                }

                return modelObj;

            },


        }

        app.model[name] = obj;

    }
};