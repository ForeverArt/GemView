import { observable, action, autorun } from "mobx";
// import PARAMETERS from "../config/parameters.yml";

import { Can } from "../../models/"
import STORE from "../index"

export default class CanStore {
    @observable data = [];

    @action.bound arrange(timestamp, can) {
        // object -> array
        const arranged = Object.keys(can).map(column_name => {
            const data = timestamp.map((t, i) => {
                return {
                    x: t,
                    y: can[column_name][i]
                }
            })
            return {
                column_name: column_name,
                data: data
            }
        })

        this.data = arranged;
    }
}
