$(document).ready(function(){

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

    //Validation du formulaire de modification du mot de passe
    $("#form-password-update").parsley({
        errorsContainer: function (ParsleyField) {
        return ParsleyField.$element.attr("title");
        },
            errorsWrapper: false
    });    
    
    //Validation du champs email pour la recuperation du mot de passe
    $("#update-pass-form-email").parsley({
        errorsContainer: function (ParsleyField) {
        return ParsleyField.$element.attr("title");
        },
            errorsWrapper: false
    });

    //Validation du formulaire de modification des infos du profil
    $("#update-infos-form").parsley({
        errorsContainer: function (ParsleyField) {
        return ParsleyField.$element.attr("title");
        },
            errorsWrapper: false
    });

    //has uppercase
    window.Parsley.addValidator('uppercase', {
    requirementType: 'number',
    validateString: function(value, requirement) {
        var uppercases = value.match(/[A-Z]/g) || [];
        return uppercases.length >= requirement;
    },
    messages: {
        en: 'Une lettre majuscule requise.'
    }
    });

    //has lowercase
    window.Parsley.addValidator('lowercase', {
    requirementType: 'number',
    validateString: function(value, requirement) {
        var lowecases = value.match(/[a-z]/g) || [];
        return lowecases.length >= requirement;
    },
    messages: {
        en: 'Une lettre minuscule requise.'
    }
    });

    //has number
    window.Parsley.addValidator('number', {
    requirementType: 'number',
    validateString: function(value, requirement) {
        var numbers = value.match(/[0-9]/g) || [];
        return numbers.length >= requirement;
    },
    messages: {
        en: 'Le mot de passe doit contenir au moins 1 chiffre'
    }
    });

    //has special char
    window.Parsley.addValidator('special', {
    requirementType: 'number',
    validateString: function(value, requirement) {
        var specials = value.match(/[^a-zA-Z0-9]/g) || [];
        return specials.length >= requirement;
    },
    messages: {
        en: 'Un caractère spécial est requis'
    }
    });

});