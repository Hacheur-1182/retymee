$(ducument).ready(function(){

    //Validation du formulaire de login
    $("#form-login").parsley({
        errorsContainer: function (ParsleyField) {
        return ParsleyField.$element.attr("title");
        },
            errorsWrapper: false
    });
    window.Parsley.on('field:error', function (fieldInstance) {
        var messages = ParsleyUI.getErrorsMessages(fieldInstance);
        var errorMsg = messages.join(';');
        fieldInstance.$element.tooltip('dispose');
        fieldInstance.$element.tooltip({
            animation: true,
            container: 'body',
            placement: 'top',
            title: errorMsg
        });
    });
    window.Parsley.on('field:success', function (fieldInstance) {
        fieldInstance.$element.tooltip('dispose');
    });

    //Validation du formulaire d'inscription
    $("#form-register").parsley({
        errorsContainer: function (ParsleyField) {
        return ParsleyField.$element.attr("title");
        },
            errorsWrapper: false
        });
        window.Parsley.on('field:error', function (fieldInstance) {
        var messages = ParsleyUI.getErrorsMessages(fieldInstance);
        var errorMsg = messages.join(';');
        fieldInstance.$element.tooltip('dispose');
        fieldInstance.$element.tooltip({
            animation: true,
            container: 'body',
            placement: 'top',
            title: errorMsg
        });
        });
        window.Parsley.on('field:success', function (fieldInstance) {
            fieldInstance.$element.tooltip('dispose');
    });

});