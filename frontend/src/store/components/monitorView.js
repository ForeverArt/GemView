import { observable, action, computed } from "mobx";
import PARAMETERS from "../config/parameters.yml";

export default class MonitorViewStore {
    @observable isOpen = PARAMETERS.defaults.monitorView.isOpen;
    @observable name = '';
    @observable monitorId = null;

    @action.bound open(name, monitorId) {
        this.isOpen = true;
        this.name = name;
        this.monitorId = monitorId;
    }

    @action.bound close() {
        this.isOpen = false;
    }

    @computed get title() {
        return this.name + ' chart';
    }
}
