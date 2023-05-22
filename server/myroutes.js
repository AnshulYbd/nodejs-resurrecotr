const express = require('express')
const router = express.Router()
//const io = require('./websocket.js').io()
var path = require('path');
var SSH = require('simple-ssh');
// var ssh = new SSH({
//     host: "192.168.208.51",
//     user: 'root',
//     port: 9031,
//     pass: 'bdstum01r21'
// });

var ssh = new SSH({
    host: "192.168.208.52",
    user: 'master',
    port: 61022,
    pass: 'master'
});


// with commonJS
var client = require('scp2');
let formidable = require('formidable');
let fs = require('fs');
router.use(express.static('public'))

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})

router.post('/upload', function(req, res){
  var buildversion = req.body.fwVersion;
  var cmd_build_fw = 'source /home/master/sources/projects/git-node-fw-build/build_fw_from_scratch.sh ' + buildversion
  var dpkgstatus = "dpkgoff"
  if (req.body.builddpkg )
  {
    dpkgstatus = req.body.builddpkg
  }   
  cmd_build_fw = cmd_build_fw + " " + dpkgstatus 

  if (req.body.ipaddress )
  {
    cmd_build_fw = cmd_build_fw + " " + req.body.ipaddress
  } 
  var releasetag = "public"
  if (req.body.prerelease )
  {
    releasetag = req.body.prerelease
  }
  cmd_build_fw = cmd_build_fw + " " + releasetag 
  //console.log("command to execute on qemu : "+cmd_build_fw)
  ssh.exec( cmd_build_fw, 
  {
      out: function (stdout) {
      if (!res.writableEnded) {
        console.log(stdout)
        res.write(stdout);
      }
      if (stdout.includes("Finished.")) {
        res.end();
      }
     },
   }).start();
 res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
  })
});

router.post('/upload_build_deploy', function(req, res){
    var buildversion = req.body.fwVersion;
    // console.log(buildversion);
    // console.log(req.body.ipaddress);
    var cmd_build_fw = 'source /home/master/sources/projects/git-node-fw-build/build_fw_from_scratch.sh ' + buildversion
    var dpkgstatus = "dpkgoff"
    if (req.body.builddpkg )
    {
        dpkgstatus = req.body.builddpkg
    }   
    cmd_build_fw = cmd_build_fw + " " + dpkgstatus
   // var fw_filepath = "/home/master/sources/projects/git-node-fw-build/cam-fw-deb/BirdDog_CAM_"+buildversion +".deb"
    //console.log(cmd_build_fw)

    ssh.exec( cmd_build_fw, 
    {
        out: function (stdout) {
        if (!res.writableEnded) {
          //console.log(stdout);
          res.write(stdout);
        }

        //console.log(stdout);
        if (stdout.includes("Finished.")) {
          res.end();
          console.log("---build_fw_from_scratch.sh finished.");
          //scp -P 61022 master@192.168.208.52:/home/master/sources/projects/git-node-fw-build/cam-fw-deb/BirdDog_CAM_5.5.105.deb /tmp/
          // var scp_cmd_from_qemu =
          //   "sshpass -p bdstum01r21 scp -v -P 9031 " +
          //   fw_filepath +
          //   " root@" +
          //   req.body.ipaddress +
          //   ":/tmp";
          // res.write("Executing SCP cmd :"+ scp_cmd_from_qemu);
          // //console.log(scp_cmd_from_qemu);
          // ssh.exec(scp_cmd_from_qemu, {
          //     out: function (stdout) {
          //       if (!res.writableEnded) {
          //           //console.log(stdout);
          //           res.write(stdout);
          //         }
          //       res.write(stdout);
          //       if (stdout.includes("debug1: Exit status 0")) {
          //           res.write(stdout);
          //           res.end();
          //       }
          //     },
          //   })
          //   .start();
        }

       },
     }).start();


    // let form = new formidable.IncomingForm();
    // form.parse(req, function (error, fields, file) {
    //     var serverip = fields.ipaddress;
    //     if(error){
    //         console.log('error form parsing.')
    //         return res.status(400).json({
    //             status: 'faile',
    //             message: 'there been some error',
    //             error :error
    //         })
    //     }
    //     let filepath = file.fileupload.filepath;
/// building the firmware on QEMU machine that is hosted on windows
        // //let newpath = 'D:/MySpace/writtenforbirddog/flash_cameras_using_node/uploaded_files/';
        // let newpath = 'C:/temp/';
        // newpath += file.fileupload.originalFilename;
        // fs.rename(filepath, newpath, function () {
        //     var local_file_path = newpath;
        //     var destination_file_path = '/tmp/'+file.fileupload.originalFilename;
        //     client.scp(local_file_path, {
        //         host: serverip,
        //         username: 'root',
        //         port: 9031,
        //         password: 'bdstum01r21',
        //         path: '/tmp/'
        //     }, function(err) {
        //        if(err){
        //           console.log('There has been some error!!!');
        //           console.log(err);
        //           //res.write('There has been some error!!!!');
        //           res.sendStatus(200);
        //        }else{
        //         res.write('Firmware File Upload Success @' + serverip + '\n');   
        //           //res.write('Firmware File Upload Success!');
        //        }
        //        var cmd = "dpkg -i "+ destination_file_path
        //        ssh.exec( cmd, 
        //        {
        //            out: function (stdout) {
        //             if (res.writableEnded) return; //prevent crash as res.end already called.
        //             res.write(stdout);
        //             if (stdout.includes("rebooting")) {
        //                 console.log(stdout);
        //                 res.end();
        //             }
        //           },
        //         }).start();
        //     });
        // });
   // });
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