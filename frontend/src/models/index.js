import { observable, action } from "mobx";
import PARAMETERS from "../store/config/parameters.yml";

export class Camera {
    @observable id;
    @observable name;
    @observable toggle;
    @observable data;

    constructor(id, name, data) {
        this.id = id;
        this.name = name;
        this.data = data;
        this.toggle = PARAMETERS.defaults.monitor.toggle;
    }

    @action.bound setData(data) {
        this.data = data;
    }
}

export class Lidar {
    @observable data;

    constructor(data) {
        this.data = data;
    }
}

export class Can {
    @observable column_name;
    @observable data;

    constructor(column_name, data) {
        this.data = data;
    }
}
