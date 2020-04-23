const express = require('express');
var mkdirp = require('mkdirp')
var  router = express.Router();


//Get DiscussGroup Model
var DiscussGroup = require('../models/discussGroup');

// Partager un support dans le groupe de discussion
router.post('/', ensureAuthenticated, (req, res) =>{
	var supportFile = typeof req.files.file !== "undefined" ? Math.random()*100000000+req.files.file.name : "";
    var groupId = req.body.groupId;
    var userId = req.body.userId;
    var courseId = req.body.courseId;
    var fileType = req.body.fileType;
    var date = req.body.date;
    
	var query = {_id:  groupId};

    DiscussGroup.updateOne(
        query,
        {$push: {"messages": {user_id: userId, content: "", date: date, file: supportFile, fileType: fileType}}},
        {safe: true, upsert: true},
        function(err, message){
            if(err) return console.log(err)

            mkdirp('public/sharesdocs/'+courseId, function(err){
                return console.log(err);
            });

            if(supportFile != ""){
                var support = req.files.file;
                var path = 'public/sharesdocs/'+courseId+'/'+supportFile;

                support.mv(path, function(err){
                    if (err) return console.log(err);
                    res.send('/sharesdocs/'+courseId+'/'+supportFile+':'+fileType)
                })
            }
        }
    );

});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated() && req.user.role != "admin"){
        return next()
    }else{
        req.flash('warning', 'Veuillez vous connecter')
        res.redirect('/')
    }
}

// Exports
module.exports = router;