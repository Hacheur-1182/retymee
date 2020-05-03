$(document).ready(function() {
    $.datetimepicker.setLocale('fr');
    $('#startat').datetimepicker();
    $('#endat').datetimepicker();

    // all form data
    data = []

    // Add a new question
    $('#add-question').click(function() {
        // Get all responses
        var responses = []
        $("input[name='reponse']").each(function(i){
            if ($(this).val()) {
                responses[i] = $(this).val()
            }
        });

        // Get true responses
        var trueResponses = []; //:checkbox:checked
        $("input[type='checkbox']").each(function(i){
            if($(this).is(":checked")) {
                trueResponses.push(responses[i])
            }
        });

        var label = $("input[name='question']").val().trim()
        var mark = $("input[name='mark']").val().trim()

        if(responses.length >= 1 && trueResponses.length >=1 && label && mark) {
            var questions = {};
            // questions['_id'] = ''
            questions['label'] = label
            questions['mark'] = mark
            questions['trueResponses'] = trueResponses
            questions['responses'] = responses

            data.push(questions);
            $('.elements').append(
                `<div class="row">
                    <div class="col-sm-12">
                        <h5>${questions['label']}</h5>
                        <p class="mb-0">${responses}</p>
                    </div>
                </div><hr/>`
            )

            // Clear the filds
            // $("input[name='mark']").val("")
            $("input[name='question']").val("")
            $("input[name='reponse']").each(function(i){
                $(this).val("")
            });
            $(':checkbox:checked').each(function(i){
                $(this).prop("checked", false);
            });

        } else {
            alert('Veuillez remplir tous les champs.')
        }
    })
    
    
    // Submit whole quiz
    $('#submit').click(function() {
        var title = $("input[name='title']").val().trim()
        var startAt = $("input[name='startat']").val().trim()
        var endAt = $("input[name='endat']").val().trim()
        var courseTitle = $("select[name='courseTitle']").val().split(':')[0]
        var courseId = $("select[name='courseTitle']").val().split(':')[1]

        if(title.length && startAt && endAt && courseTitle && data.length > 0) {
            const newQuiz = {
                "title": title,
                "teacherId": "<%=teacher._id%>",
                "startAt": startAt,
                "endAt": endAt,
                "courseId": courseId,
                "courseTitle": courseTitle,
                "questions": JSON.stringify(data)
            }
            // send post request to the server
            $.ajax({
                type: 'POST',
                url: '/quiz/builder',
                data: (newQuiz),
                beforeSend: function(){
                    $('#file-upload-loader').css("display", "flex");
                },
                success: function(response){ 
                    if(response == '1'){
                        $('#file-upload-loader').css("display", "none");
                        window.location.href = '/quiz';
                    }
                },
                error: function(err){
                    $('#file-upload-loader').css("display", "none");
                    console.log(err)
                    alert('Une érreur s\'est produite. Veuillez reéssayer')
                }
            })
        } else {
            alert('Veuillez remplir tous les champs.')
        }
    })

    // Add a new response option
    $('#add-response').click(function() {
        $('.builder').append(
            `<div class="row">
                <div class="col-sm-10">
                    <div class="form-group">
                        <input type="text" name="reponse" class="form-control" placeholder="Entrez une réponse">
                    </div>
                </div>
                <div class="col-sm-2">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" class="trueResponse">
                        <label class="form-check-label">
                            <i class="fa fa-check"></i>
                        </label>
                    </div>
                </div>
            </div>`
        )
    })
})