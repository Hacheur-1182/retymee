    //Verify if Discuss Group already exist
function changeFunc(){
  var course_id = $('#course_id').val();

  $.ajax({
      type: 'POST',
      url: '/admin/group/verify-group',
      data: (
          {
              groupname: course_id
          }
      ),
      beforeSend: function(){
        var spin = '<i class="fa fa-circle-o-notch fa-spin sp" style="font-size:36px"></i>';
        $('#add-group-form').append(spin);
        $('#add-group').css("display", "none");
      },
      success: function(response){ 
          if(response == '0'){
              $('#add-group-form').append('<div class="alert msg alert-danger mt-2">The Discuss Group for this course have already been created, Choose another</div>');
              $('.sp').css("display", "none");
          }else if(response == '1'){
              $('.sp').css("display", "none");
              $('.msg').css("display", "none");
              $('#add-group').css("display", "inline-block");
          }
          //window.location.href='/';
      },
      error: function(err){
          console.log(err)
      }
  })
}