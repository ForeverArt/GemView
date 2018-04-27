import { observable, action } from "mobx";
// import PARAMETERS from "../config/parameters.yml";

import { Camera } from "../../models/"

export default class CameraStore {
    storage = null;
    @observable data = [new Camera(0, 'camera_0', null), new Camera(1, 'camera_1', null), new Camera(2, 'camera_2', null), new Camera(3, 'camera_3', null)];

    @action.bound toggleCamera(id) {
        let camera = this.data.filter(item => item.id === id)[0] || null;
        camera.toggle = !camera.toggle;
    }

    @action.bound arrange(camera_data) {
        this.storage = camera_data;
    }

    @action.bound getCameraById(id) {
        return this.data.filter(item => item.id === id)[0] || null;
    }

    @action.bound refresh(dataIndex) {
        if (this.storage) {
            this.storage.map((item, index) => {
                this.data[index].setData(item[dataIndex]);
            })
        }
    }
}
