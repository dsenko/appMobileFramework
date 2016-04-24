app.config = {

    mobileRun: false,

    mockApi: false,
    
    mainController: "Home",
    viewsPath: 'view',

    lang: "en",

    dbMode: 'create-drop',
    dbTestMode: true,

    dbCreateDropFromScript: true,
    
    dbCreateScript: 'sql/create.sql',
    dbDropScript: 'sql/drop.sql',
    
    dbTestScript: 'sqltest.sql',
    dbProductionScript: 'sqlproduction.sql',

    dbName: 'localdb',
    
    extend: function(configObj){

        for(var prop in configObj){
            app.config[prop] = configObj[prop];
        }

    }

};