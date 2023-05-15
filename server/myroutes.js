const express = require('express')
const router = express.Router()

router.use(express.static('public'))

//const io = require('./websocket.js').io()

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

router.post('/upload', function(req, res){
    let form = new formidable.IncomingForm();
    form.parse(req, function (error, fields, file) {
        var serverip = fields.ipaddress;
        if(error){
            console.log('error form parsing.')
            return res.status(400).json({
                status: 'faile',
                message: 'there been some error',
                error :error
            })
        }
        let filepath = file.fileupload.filepath;
        //let newpath = 'D:/MySpace/writtenforbirddog/flash_cameras_using_node/uploaded_files/';
        let newpath = 'C:/temp/';
        newpath += file.fileupload.originalFilename;
        fs.rename(filepath, newpath, function () {
            var local_file_path = newpath;
            var destination_file_path = '/tmp/'+file.fileupload.originalFilename;
            client.scp(local_file_path, {
                host: serverip,
                username: 'root',
                port: 9031,
                password: 'bdstum01r21',
                path: '/tmp/'
            }, function(err) {
               if(err){
                  console.log('There has been some error!!!');
                  console.log(err);
                  //res.write('There has been some error!!!!');
                  res.sendStatus(200);
               }else{
                res.write('Firmware File Upload Success @' + serverip + '\n');   
                  //res.write('Firmware File Upload Success!');
               }
               var cmd = "dpkg -i "+ destination_file_path
               ssh.exec( cmd, 
               {
                   out: function (stdout) {
                    if (res.writableEnded) return; //prevent crash as res.end already called.
                    res.write(stdout);
                    if (stdout.includes("rebooting")) {
                        console.log(stdout);
                        res.end();
                    }
                  },
                }).start();
            });
        });
    });
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })
});

router.get("/", (req, res) => {
    res.write("you are in routes home page: try update-firmware \n\n");
    res.end();
    //res.sendFile(path.join(__dirname+'/index.html'));
    // ssh.exec('echo $PATH', {
    //     out: function(stdout) {
    //         console.log(stdout);
    //     }
    // }).start();
});

router.get("/update-firmware", (req, res) => {
   res.sendFile(path.join(__dirname+'/index.html'));
});


module.exports = router