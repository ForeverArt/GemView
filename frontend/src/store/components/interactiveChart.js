import { observable, action, computed } from "mobx";
import PARAMETERS from "../config/parameters.yml";

export default class InteractiveChartStore {
    @observable isOpen = PARAMETERS.defaults.interactiveChart.isOpen;
    @observable column = '';
    @observable data = [];

    @action.bound open(column, data) {
        this.isOpen = true;
        this.column = column;
        this.data = data;
    }

    @action.bound close() {
        this.isOpen = false;
    }

    @computed get title() {
        return this.column + ' chart';
    }
}
