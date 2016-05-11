app.service = {
    register: function (name, obj) {
        app.service[name] = obj;
    }
};

$asr = app.service.register;