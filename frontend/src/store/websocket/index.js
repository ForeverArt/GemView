import STORE from "../index";
import PARAMETERS from "../config/parameters.yml";

import { _caculateObjSize } from "../../utils/Transformer";

class WS {
    constructor(serverAddr, play_mode) {
        this.serverAddr = serverAddr;
        this.websocket = null;
        // this.worker = new Worker();
        this.play_mode = play_mode;
    }

    initialize() {
        try {
            this.websocket = new WebSocket(this.serverAddr);
            this.websocket.binaryType = "arraybuffer";
        } catch (e) {
            console.error("Fail to establish a websocket connection: " + e);
            setTimeout(() => {
                this.initialize();
            }, 1000);
            return;
        }

        this.websocket.onmessage = event => {
            console.log('reveived data', performance.now());
            const { camera, lidar, can, playtool } = STORE;
            const { arrange: arrangeCan } = can;
            const { arrange: arrangeLidar } = lidar;
            const { arrange: arrangeCamera } = camera;
            const { setTimestamps } = playtool;
            const data = JSON.parse(event.data);
            const { timestamp, camera: camera_data, lidar: lidar_data, can: can_data} = data;
            console.log('arranged data', performance.now());
            arrangeCan(timestamp, can_data);
            console.log('arranged data', performance.now());
            arrangeLidar(lidar_data);
            console.log('arranged data', performance.now());
            arrangeCamera(camera_data);
            console.log('arranged data', performance.now());

            setTimestamps(timestamp);
            console.log('arranged data', performance.now());

            console.log(_caculateObjSize(data), 'bytes');


            // this.worker.postMessage({
            //     data: event.data,
            // });
        };

        this.websocket.onclose = event => {
            console.log(event);
            console.log("WebSocket connection closed with code: " + event.code);
            this.initialize();
        };

        // this.worker.onmessage = event => {
        //     // arrange data
        // };

        // request data every 100ms.
        clearInterval(this.timer);
        this.timer = setTimeout(() => {
            if (this.websocket.readyState === this.websocket.OPEN) {
                console.log('send request', performance.now());
                if (this.play_mode === PARAMETERS.websocket.play_mode.offline) {
                    this.websocket.send(JSON.stringify({
                        type: PARAMETERS.websocket.play_mode.offline
                    }));
                } else {
                    this.websocket.send(JSON.stringify({
                        type: PARAMETERS.websocket.play_mode.active
                    }));
                }
            }
        }, 1000);
    }
}

const { protocal, host, port, play_mode } = PARAMETERS.websocket
export const offline_ws = new WS(`${protocal}://${host}:${port}`, play_mode.offline);
export const ws = new WS(`${protocal}://${host}:${port}`, play_mode.active);
