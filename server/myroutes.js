const express = require('express')
const router = express.Router()
var path = require('path');
var SSH = require('simple-ssh');
var ssh = new SSH({
    host: "192.168.208.51",
    user: 'root',
    port: 9031,
    pass: 'bdstum01r21'
});
// with commonJS
var client = require('scp2');
let formidable = require('formidable');
let fs = require('fs');

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})

//we need body-parser and json to get the data 
// from html form to here
router.post('/myform', function(req, res){
    console.log('form submitted :');
    console.log(req.body.filename)
    console.log(req.body.ipaddress)
    res.send('success')

});

router.post('/upload', function(req, res){
    console.log('file uploading :');
    var serverip = req.body.ipaddress;
     console.log(serverip)
    // //Create an instance of the form object
    let form = new formidable.IncomingForm();
    //Process the file upload in Node
    form.parse(req, function (error, fields, file) {
        let filepath = file.fileupload.filepath;
        //let newpath = 'D:/MySpace/writtenforbirddog/flash_cameras_using_node/uploaded_files/';
        let newpath = 'C:/temp/';
        newpath += file.fileupload.originalFilename;
        fs.rename(filepath, newpath, function () {
            //Send a NodeJS file upload confirmation message
            var local_file_path = newpath;
            var destination_file_path = '/tmp/'+file.fileupload.originalFilename;
            client.scp(local_file_path, {
                host: "192.168.208.51",
                username: 'root',
                port: 9031,
                password: 'bdstum01r21',
                path: '/tmp/'
            }, function(err) {
               if(err){
                  console.log('There has been some error!!!');
                  console.log(err);
                  res.write('There has been some error!!!!');
               }else{
                  console.log('succeeded copying server: ' + serverip);   
                  res.write('Firmware File Upload Success!');
               }
               var cmd = "dpkg -i "+ destination_file_path
               ssh.exec( cmd, {
                   out: function (stdout) {
                       console.log(stdout);
                       res.write(stdout);
                       res.send();
                       },
                   })
                   .start();
            });
        });
    });

    

});


router.get('/about',function(req,res){
    res.sendFile(path.join(__dirname+'/about.html'));
  });
   
  router.get('/sitemap',function(req,res){
    res.sendFile(path.join(__dirname+'/sitemap.html'));
  });

  router.get("/", (req, res) => {
    console.log(path.join(__dirname+'/index.html'))
    res.sendFile(path.join(__dirname+'/index.html'));
    // ssh.exec('echo $PATH', {
    //     out: function(stdout) {
    //         console.log(stdout);
    //     }
    // }).start();
});
  
module.exports = router