const express = require('express');
const router = express.Router();
const fs = require('fs');

// 该路由使用的中间件
// router.use(function timeLog(req, res, next) {
//     console.log('Time: ', Date.now());
//     next();
// });

router.get('/', function(req, res) {
    const response = `
        /pcap, return pcap file list<br/>
        /pcap/:pcap_name, return pcd file list that comes from pcap
    `
    res.send(response);
});

router.get('/pcap', function(req, res) {
    const path = __dirname + '/public/pcap';
    fs.stat(path, (err, stats) => {
        if (!err && stats.isDirectory()) {
            const filelist = fs.readdirSync(path).filter(filename => {
                const splited = filename.split('.');
                const suffix = splited[splited.length - 1];
                return suffix === 'pcap'
            })
            res.json(filelist);
        } else {
            const error = 'directory not exist'
            res.status(500).send(error);
        }
    });
});

router.get('/pcap/:pcap_name', function(req, res) {
    const pcap_name = req.params.pcap_name;
    const path = __dirname + '/public/' + pcap_name;
    fs.stat(path, (err, stats) => {
        if (!err && stats.isDirectory()) {
            const filelist = fs.readdirSync(path)
            res.json(filelist);
        } else {
            const error = 'directory not exist'
            res.status(500).send(error);
        }
    });
});

module.exports = router;
