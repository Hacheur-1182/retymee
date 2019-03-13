$(document).ready(function(){
    //SignUp Script
    $('#form-register').submit(function(){
        var username = $("#username").val();
        var email = $("#email").val();
        var password = $("#password").val();
        var password2 = $("#password2").val();

        $('.alert').css('display', 'none');

        $.ajax({
            type: 'POST',
            url: '/student/signup',
            data: (
                {
                    username: username,
                    email: email,
                    password: password,
                    password2: password2
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
                    $('#form-register').append('<div class="alert alert-success mt-2">Inscription réussie, Un mail de confirmation vous a été envoyé</div>');
                    $('.fa-spin').css("display", "none");
                    //Message username is already use
                }else if(response == "username_exist"){
                    $('#form-register').append('<div class="alert alert-danger mt-2">This Username is already used</div>');
                    $('.fa-spin').css("display", "none");
                    $('#signup').css("display", "block");
                    //Message email is already use
                }else if(response == "email_exist"){
                    $('#form-register').append('<div class="alert alert-danger mt-2">This Email is already used</div>');
                    $('.fa-spin').css("display", "none");
                    $('#signup').css("display", "block");
                }else if(response == "username"){
                    $('#form-register').append('<div class="alert alert-danger mt-2">Username Field error (Min 6 caracters)</div>');
                    $('.fa-spin').css("display", "none");
                    $('#signup').css("display", "block");
                }else if(response == "email"){
                    $('#form-register').append('<div class="alert alert-danger mt-2">Enter a valid Email</div>');
                    $('.fa-spin').css("display", "none");
                    $('#signup').css("display", "block");
                }else if(response == "password"){
                    $('#form-register').append('<div class="alert alert-danger mt-2">Password Field error (Min 6 caracters)</div>');
                    $('.fa-spin').css("display", "none");
                    $('#signup').css("display", "block");
                }else if(response == "password2"){
                    $('#form-register').append('<div class="alert alert-danger mt-2">Passwords Fields don\'t match</div>');
                    $('.fa-spin').css("display", "none");
                    $('#signup').css("display", "block");
                }
                
                //window.location.href='/';
            },
            error: function(err){
                console.log(err)
            }
        })
        return false
    })

    //Login script
    $('#form-logi').submit(function(){
        var email = $("#login_email").val();
        var password = $("#login_password").val();

        $.ajax({
            type: 'POST',
            url: '/student/login',
            data: (
                {
                    email: email,
                    password: password
                }
            ),
            beforeSend: function(){
              var spin = '<i class="fa fa-circle-o-notch fa-spin" style="font-size:36px"></i>';
              $('#form-login').append(spin);
              $('#login').css("display", "none");
            },
            success: function(response){ 
                if(response == 'email'){
                    $('#form-login').append('<div class="alert alert-danger mt-2">Invalid Email</div>');
                    $('.fa-spin').css("display", "none");
                    $('#signup').css("display", "block");
                }else if(response == 'password'){
                    $('#form-login').append('<div class="alert alert-danger mt-2">Incorrect Password</div>');
                    $('.fa-spin').css("display", "none");
                    $('#signup').css("display", "block");
                }else if(response == '1'){
                    $('#form-login').append('<div class="alert alert-danger mt-2">Correct</div>');
                    $('.fa-spin').css("display", "none");
                    $('#signup').css("display", "block");
                }
                //window.location.href='/';
            },
            error: function(err){
                console.log(err)
            }
        })

        return false
    })
})