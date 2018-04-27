import { observable, action } from "mobx";
// import PARAMETERS from "../config/parameters.yml";

import { Lidar } from "../../models/"

export default class LidarStore {
    storage = null;
    @observable data = null;

    @action.bound arrange(lidar_data) {
        this.storage = lidar_data;
    }

    @action.bound refresh(dataIndex) {
        if (this.storage) {
            this.data = this.storage[dataIndex];
        }
    }
}
