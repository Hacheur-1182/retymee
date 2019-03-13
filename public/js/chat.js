$(document).ready(function(){
	
	//First method
	$("#send-messag").click(function(){
		var content = $('#content').val()
		content = content.trim()
		var file = $('#file').val()
		var group_id = $('#group-id').val()

		if(content != ""){
			$.ajax({
	            type: 'POST',
	            url: '/student/group/send',
	            data: (
	                {
	                    content: content,
	                    file: file,
	                    group_id: group_id
	                }
	            ),
	            beforeSend: function(){
	              var spin = '<i class="fa fa-circle-o-notch fa-spin" style="font-size:36px"></i>';
	              $('#spin-space').append(spin);
	              $('#send-message').css("display", "none");
	            },
	            success: function(response){ 
	                if(response == '1'){
	                    $('#discuss-form').append('<div class="alert alert-success mt-2">Message posted</div>');
	                    $('.fa-spin').css("display", "none");
	                    $('#send-message').css("display", "block");
	                    $('#content').val("");
	                }
	                //window.location.href='/';
	            },
	            error: function(err){
	                console.log(err)
	                $('#discuss-form').append('<div class="alert alert-danger mt-2">Message have not been sent</div>');
	                $('.fa-spin').css("display", "none");
	                $('#send-message').css("display", "block");
	            }
	        })
	    }
	})
})