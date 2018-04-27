import { observable, computed, action, autorun } from "mobx";

import CameraStore from "./components/camera";
import CanStore from "./components/can";
import LidarStore from "./components/lidar";

import PadStore from "./components/pad";
import SiderStore from "./components/sider";
import InteractiveChartStore from "./components/interactiveChart";
import MonitorViewStore from "./components/monitorView";

import PlaytoolStore from "./components/playtool";

import PARAMETERS from "./config/parameters.yml";

class GemviewStore {
    @observable playtool = new PlaytoolStore();

    @observable camera = new CameraStore();
    @observable can = new CanStore();
    @observable lidar = new LidarStore();

    @observable pad = new PadStore();
    @observable sider = new SiderStore();
    @observable interactiveChart = new InteractiveChartStore();
    @observable monitorView = new MonitorViewStore();
}

const STORE = new GemviewStore();

autorun(() => {
    console.log('tick', performance.now());
    const { playtool, camera, can, lidar } = STORE;
    const { refresh: refresh_camera } = camera;
    const { refresh: refresh_lidar } = lidar;
    const { dataIndex } = playtool;
    refresh_camera(dataIndex);
    refresh_lidar(dataIndex);
});

export default STORE;
