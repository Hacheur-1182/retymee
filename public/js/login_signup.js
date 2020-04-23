$(document).ready(function(){
    //SignUp Script
    $('#form-register').submit(function(){
        var username = $("#username").val();
        var email = $("#email").val();
        var password = $("#password").val();
        var password2 = $("#password2").val();
        var status = $("#status").val();

        $('.alert').css('display', 'none');

        $.ajax({
            type: 'POST',
            url: '/student/signup',
            data: (
                {
                    username: username,
                    login_email: email,
                    login_password: password,
                    password2: password2,
                    status: status
                }
            ),
            beforeSend: function(){
              var spin = '<i class="fa fa-circle-o-notch fa-spin" style="font-size:36px"></i>';
              $('#form-register').append(spin);
              $('#signup').css("display", "none");
            },
            success: function(response){
                if(response == "0"){
                    $('.fa-spin').css("display", "none");
                    $('#form-register').append('<div class="alert alert-danger mt-2">Erreur lors de l\'incription</div>');
                    $('#signup').css("display", "block");
                    $('#signUp').modal('show');
                }else if(response == "1"){
                    $('#form-register').append('<div class="alert alert-success mt-2">Inscription réussie. Veuillez ouvrir votre boîte mail pour confirmer votre compte.</div>');
                    $('.fa-spin').css("display", "none");
                    //Message username is already use
                }else if(response == "username_exist"){
                    $('#form-register').append('<div class="alert alert-danger mt-2">Nom d\'utilisateur déja utilisé.</div>');
                    $('.fa-spin').css("display", "none");
                    $('#signup').css("display", "block");
                    //Message email is already use
                }else if(response == "email_exist"){
                    $('#form-register').append('<div class="alert alert-danger mt-2">Adresse email déja utilisée.</div>');
                    $('.fa-spin').css("display", "none");
                    $('#signup').css("display", "block");
                }else if(response == "username"){
                    $('#form-register').append('<div class="alert alert-danger mt-2">Nom d\'utilisateur requis (Min 6 caracters)</div>');
                    $('.fa-spin').css("display", "none");
                    $('#signup').css("display", "block");
                }else if(response == "email"){
                    $('#form-register').append('<div class="alert alert-danger mt-2">Adresse email invalide.</div>');
                    $('.fa-spin').css("display", "none");
                    $('#signup').css("display", "block");
                }else if(response == "password"){
                    $('#form-register').append('<div class="alert alert-danger mt-2">Erreur de mot de passe (Min 6 caractères)</div>');
                    $('.fa-spin').css("display", "none");
                    $('#signup').css("display", "block");
                }else if(response == "password2"){
                    $('#form-register').append('<div class="alert alert-danger mt-2">Les mots de passe ne correspondent pas.</div>');
                    $('.fa-spin').css("display", "none");
                    $('#signup').css("display", "block");
                }
                
                //window.location.href='/';
                setTimeout(() => {
                    
                }, 2000);
            },
            error: function(err){
                console.log(err)
                $('.fa-spin').css("display", "none");
                $('#signup').css("display", "block");
                alert('Une érreur s\'est produite. Veuillez reéssayer')
            }
        })
        return false
    })

    //Login script
    $('#form-login').submit(function(){
        var email = $("#login_email").val();
        var password = $("#login_password").val();
        $('.alert').remove()

        var url = '/student/login';
        var redirect = '/student/dashboard';
        var isTeacher = $('#isTeatcher')[0].checked

        if(isTeacher) {
            url = '/teacher/login';
            redirect = '/teacher/dashboard';
        }

        $.ajax({
            type: 'POST',
            url: url,
            data: (
                {
                    login_email: email,
                    login_password: password
                }
            ),
            beforeSend: function(){
              var spin = '<i class="fa fa-circle-o-notch fa-spin" style="font-size:36px"></i>';
              $('#form-login').append(spin);
              $('#login').css("display", "none");
            },
            success: function(response){ 
                if(response == '0'){
                    $('#form-login').append('<div class="alert alert-danger mt-2">Email ou Mot de passe invalide</div>');
                    $('.fa-spin').css("display", "none");
                    $('#login').css("display", "block");
                }else if(response == '1'){
                    window.location.href = redirect;
                }
            },
            error: function(err){
                $('.fa-spin').css("display", "none");
                $('#login').css("display", "block");
                console.log(err)
                alert('Une érreur s\'est produite. Veuillez reéssayer')
            }
        })

        return false
    })
})