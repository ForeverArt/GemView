import { observable, action, computed } from "mobx";
import PARAMETERS from "../config/parameters.yml";

export default class SiderStore {
    @observable showSider = PARAMETERS.defaults.sider.showSider;
    @action.bound toggleSider() {
        this.showSider = !this.showSider;
    }
}
