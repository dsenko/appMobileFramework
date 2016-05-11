app.plugins = {

    wrapper : {},

    wrapList: function(wrapList){

        app.plugins.wrapper = $.extend(true, app.plugins.wrapper, wrapList);

    },

    wrap: function(pluginName, wrapper){

        app.plugins.wrapper[pluginName] = wrapper;

    },



};

$apw = app.plugins.wrapper;