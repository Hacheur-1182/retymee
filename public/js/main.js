$(document).ready(function(){
    $("#banner").vegas({
        slides: [
            { src: './img/writing.jpg' },
            { src: './img/02.jpg' },
            { src: './img/img2.jpeg' },
            { src: './img/pexels-photo.jpg' }
        ],
        animation: 'kenburns'
    });

    $('#sign-in-log').click(function(){
        $('#log').modal('hide');
    });
    $('#log_as_teacher').click(function(){
        $('#log').modal('hide');
        $('#teachers-log').modal('show');
    });
    $('#sign-up').click(function(){
        $('#sign').modal('show');
    });
    $('#login').click(function(){
        $('#log').modal('show');
    });

    // Auto play modal video
    $(".video").click(function () {
      var theModal = $(this).data("target"),
      videoSRC = $(this).attr("data-video"),
      videoSRCauto = videoSRC + "?modestbranding=1&rel=0&controls=0&showinfo=0&html5=1&autoplay=1";
      $(theModal + ' iframe').attr('src', videoSRCauto);
      $(theModal + ' button.close').click(function () {
        $(theModal + ' iframe').attr('src', videoSRC);
      });
    });

    $("#testimonial-slider").owlCarousel({
        items:2,
        itemsDesktop:[1000,2],
        itemsDesktopSmall:[979,2],
        itemsTablet:[768,1],
        pagination:true,
        autoPlay:false
    });

    $(".slider").slick({
        autoplay: true,
        autoplaySpeed: 3000,
        infinite: true,
        slideToShow:1,
        slideToScroll:1
    });


    $('.counter').counterUp({
        total: 1
    });

    
    $("#instructor").waypoint(function(){
        $("#annim1").addClass("animated fadeInLeft");
        $("#annim2").addClass("animated fadeInLeft");
        $("#annim3").addClass("animated fadeInRight");
        $("#annim4").addClass("animated fadeInRight");
    }, { offset: '100%'});

    $("#start-teaching").waypoint(function(){
        $("#start-teaching").addClass("animated wobble");
    }, { offset: '100%'});
});


$(window).scroll(function(){
    arrangeBar();
});

function arrangeBar(){
    if($(window).scrollTop() > 150){
        $('#second-menu').slideDown(130);
    }
    else{
        $('#second-menu').slideUp(130);
    }
}
