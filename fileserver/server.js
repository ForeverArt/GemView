const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8080});

const fs = require('fs')

//
const t1 = new Date().getTime();

const MAX = 50;
const num = 30;
let img_base64 = [];
// transfer img to base64
const path = __dirname + '/public/camera';
const filelist = fs.readdirSync(path).slice(0, num);
const files = filelist.map(file => {
    return Buffer.from(fs.readFileSync(path + '/' + file)).toString('base64');
})
img_base64 = files;
//
let pcd = [];
const pcd_path = __dirname + '/public/velodyne_h32_test.pcap';
const pcd_filelist = fs.readdirSync(pcd_path).slice(0, num);
const pcd_files = pcd_filelist.map(file => {
    return Buffer.from(fs.readFileSync(pcd_path + '/' + file)).toString('base64');
})
pcd = pcd_files;

let timestamps = [];
let cans = [];
for (let i = 0;i < num ;i++) {
    timestamps.push(1523867893000 + i * 33);
    cans.push(Math.random() * 2 - 1);
}
//
const t2 = new Date().getTime();
console.log('Data ready, used: ' + (t2 - t1) + ' ms');
// establish connection
wss.on('connection', ws => {
    console.log('connection');
    ws.on('message', message => {
        console.log('receive request at', new Date().getTime());
        const json = JSON.parse(message);
        const { type } = json;
        if (type === "OfflineData") {
            const response_json = {
                timestamp: timestamps,
                camera: [
                    img_base64,
                    img_base64,
                    img_base64,
                    img_base64
                ],
                lidar: pcd,
                can: {
                    velocity: cans,
                    angel: cans,
                    column3: cans,
                    acc: cans
                }
            };
            const mock_data = JSON.stringify(response_json);
            console.log('send data at', new Date().getTime());
            ws.send(mock_data)
        } else if (type === "ActiveData") {
            ws.send('active')
        }
    });
});
