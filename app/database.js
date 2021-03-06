app.dbTablesCount = 0;

var DB_INSTANCE = null;

app.database = {

    dbName: '',
    dbVersion: '1.0',
    dbSize: 2097152,

    createDB: function (callBack) {

        app.database.dbName = app.config.dbName;

        if (app.config.dbMode == 'none') {

            app.DB_INSTANCE = null;
            app.system.mainRender(callBack);

        } else {

            if (app.config.mobileRun) {

               app.DB_INSTANCE = window.sqlitePlugin.openDatabase({ name: app.database.dbName, location: 'default' });

            } else {
                app.DB_INSTANCE = openDatabase(app.database.dbName, app.database.dbVersion, app.database.dbName + '_manager', app.database.dbSize);
            }


            if (app.config.dbMode == 'create-drop') {

                app.database.dbDrop(function () {
                    app.database.dbCreate(function () {

                        console.log('DB created');
                        app.database.dbLoadData(function () {

                            console.log('DB loaded');
                            app.system.mainRender(callBack);

                        });

                    });
                });

            } else if (app.config.dbMode == 'create') {

                   console.log('create db 222');
                    app.database.dbCreate(function () {
                        console.log('created db');
                        app.database.dbLoadData(function () {
                            app.system.mainRender(callBack);
                        });
                    });

            }

        }

    },

    dbLoadData: function (callBack) {

        var finished = false;

        if (app.config.dbTestMode) {

            console.log('xxx');

            $.get(app.config.dbTestScript, function (data) {

                if (data.trim().length == 0) {
                    console.log('callback 2');
                    finished = true;
                    callBack();
                } else {

                    var queries = [];
                    var splitted = data.split(';');


                    for (var i = 0; i < splitted.length; i++) {

                        if (splitted[i].trim().length > 0) {
                            queries.push(splitted[i].trim());
                        }

                    }


                    for (var i = 0; i < queries.length; i++) {


                        app.crud.execute(queries[i], function (data) {

                            app.dbTablesCount++;

                            if (app.dbTablesCount >= queries.length) {
                                app.dbTablesCount = 0;

                                if (!finished) {
                                    console.log('callback 1');
                                    finished = true;
                                    callBack();

                                }

                            }

                        });

                    }

                }


            });

        } else {

            $.get(app.config.dbProductionScript, function (data) {

                if (data.trim().length == 0) {
                    console.log('callback 3');
                    finished = true;
                    callBack();

                } else {

                    var queries = [];
                    var splitted = data.split(';');

                    for (var i = 0; i < splitted.length; i++) {
                        if (splitted[i].trim().length > 0) {
                            queries.push(splitted[i].trim());
                        }
                    }

                    for (var i = 0; i < queries.length; i++) {

                        app.crud.execute(queries[i], function (data) {

                            app.dbTablesCount++;

                            if (app.dbTablesCount >= queries.length) {
                                app.dbTablesCount = 0;

                                if (!finished) {
                                    console.log('callback 4');
                                    finished = true;
                                    callBack();

                                }

                            }

                        });

                    }

                }


            });

        }

    },

    dbCreate: function (callBack) {


        if (app.config.dbCreateDropFromScript) {

            $.get(app.config.dbCreateScript, function (data) {

                if (data.trim().length == 0) {
                    callBack();
                } else {

                    var queries = [];
                    var splitted = data.split(';');

                    for (var i = 0; i < splitted.length; i++) {
                        if (splitted[i].trim().length > 0) {
                            queries.push(splitted[i].trim());
                        }
                    }

                    for (var i = 0; i < queries.length; i++) {

                        app.crud.execute(queries[i], function (data) {

                            app.dbTablesCount++;

                            if (app.dbTablesCount >= queries.length) {
                                app.dbTablesCount = 0;
                                callBack();
                            }

                        });

                    }

                }


            });

        } else {

            console.log('from model');
            for (var i = 0; i < app.model.createScripts.length; i++) {

                console.log(app.model.createScripts);

                app.crud.execute(app.model.createScripts[i], function (data) {

                    app.dbTablesCount++;

                    if (app.dbTablesCount == app.model.createScripts.length) {
                        app.dbTablesCount = 0;
                        callBack();
                    }

                });

            }

        }


    },

    dbDrop: function (callBack) {


        if (app.config.dbCreateDropFromScript) {

            $.get(app.config.dbDropScript, function (data) {

                if (data.trim().length == 0) {
                    callBack();
                } else {

                    var queries = [];
                    var splitted = data.split(';');

                    for (var i = 0; i < splitted.length; i++) {
                        if (splitted[i].trim().length > 0) {
                            queries.push(splitted[i].trim());
                        }
                    }

                    for (var i = 0; i < queries.length; i++) {

                        app.crud.execute(queries[i], function (data) {

                            app.dbTablesCount++;

                            if (app.dbTablesCount >= queries.length) {
                                app.dbTablesCount = 0;
                                callBack();
                            }

                        });
                    }
                }

            });

        } else {

            for (var i = 0; i < app.model.dropScripts.length; i++) {

                app.crud.execute(app.model.dropScripts[i], function (data) {

                    app.dbTablesCount++;

                    if (app.dbTablesCount == app.model.dropScripts.length) {
                        app.dbTablesCount = 0;
                        callBack();
                    }

                });

            }

        }


    }


};
