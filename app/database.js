app.dbTablesCount = 0;

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
                app.DB_INSTANCE = window.sqllitePlugin.openDatabase(app.database.dbName, app.database.dbVersion, app.database.dbName + '_manager', app.database.dbSize);
            } else {
                app.DB_INSTANCE = openDatabase(app.database.dbName, app.database.dbVersion, app.database.dbName + '_manager', app.database.dbSize);
            }

            if (app.config.dbMode == 'create-drop') {

                app.database.dbDrop(function () {
                    app.database.dbCreate(function () {
                        app.database.dbLoadData(function () {
                            app.system.mainRender(callBack);
                        });
                    });
                });

            } else if (app.config.dbMode == 'create') {

                if (localStorage.getItem('db_created') == null) {
                    app.database.dbCreate(function () {
                        app.database.dbLoadData(function () {
                            app.system.mainRender(callBack);
                            localStorage.setItem('db_created', true);
                        });
                    });
                } else {
                    app.system.mainRender(callBack);
                }

            }

        }

    },

    dbLoadData: function (callBack) {

        var finished = false;

        if (app.config.dbTestMode) {

            app.rest.getFile(app.config.dbTestScript, function (data) {

                if (data.trim().length == 0) {
                    console.log('callback 2');
                    finished = true;
                    callBack();

                } else {

                    var queries = [];
                    var splitted = data.split(';');

                    for (var i = 0; i < splitted.length; i++) {
                        if (splitted[i].trim().length > 0 && splitted[i].trim().indexOf('/*') == 0) {
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

            app.rest.getFile(app.config.dbProductionScript, function (data) {

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

            app.rest.getFile(app.config.dbCreateScript, function (data) {

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

            for (var i = 0; i < app.model.createScripts.length; i++) {

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

            app.rest.getFile(app.config.dbDropScript, function (data) {

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
