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
        var startAt = new Date($("input[name='startat']").val().trim())
        var endAt = new Date($("input[name='endat']").val().trim())
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

    // Imprimer les résultats
    $('#print').click(function() {
        var sTable = document.getElementById('pagecontent').innerHTML;

        var style = "<style>";
        style = style + "table {width: 100%;font: 17px Calibri;}";
        style = style + "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
        style = style + "padding: 2px 3px;text-align: center;}";
        style = style + "</style>";

        // CREATE A WINDOW OBJECT.
        var win = window.open('', '', 'height=700,width=700');

        win.document.write('<html><head>');
        win.document.write('<title>Evaluation</title>');   // <title> FOR PDF HEADER.
        win.document.write(style);          // ADD STYLE INSIDE THE HEAD TAG.
        win.document.write('</head>');
        win.document.write('<body>');
        win.document.write(sTable);         // THE TABLE CONTENTS INSIDE THE BODY TAG.
        win.document.write('</body></html>');

        win.document.close(); 	// CLOSE THE CURRENT WINDOW.

        win.print();    // PRINT THE CONTENTS.
    })
})
