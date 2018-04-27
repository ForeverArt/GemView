import { observable, action, computed } from "mobx";
import PARAMETERS from "../config/parameters.yml";

export default class PlaytoolStore {
    @observable currrent_frame = 0;
    @observable timestamps = [];
    @computed get max_frame() {
        return this.timestamps.length;
    }

    Frame_duration = 1000 / PARAMETERS.play.default_fps;

    @computed get dataIndex () {
        return this.currrent_frame - 1;
    }

    @action.bound setTimestamps(timestamps) {
        if (timestamps.length) {
            this.currrent_frame = 1;
        }
        this.timestamps = timestamps;
    }

    timer;
    @action.bound autoview() {
        console.log('from', performance.now());
        this.playing = true;

        const self = this;
        function next() {
            self.timer = setTimeout(() => {
                if (self.playing) {
                    next();
                }
                if (self.currrent_frame + 1 > self.max_frame) {
                    self.pause();
                } else {
                    self.currrent_frame++;
                }
            }, self.Frame_duration)
        }
        next();
    }

    @observable playing = PARAMETERS.play.playing;

    @action.bound forward() {
        this.pause();
        this.currrent_frame = Math.min(this.currrent_frame + 1, this.max_frame);
    }

    @action.bound backward() {
        this.pause();
        this.currrent_frame = Math.max(this.currrent_frame - 1, 1);
    }

    @action.bound pause() {
        console.log('stop', performance.now());
        clearTimeout(this.timer);
        this.playing = false;
    }

    @action.bound jump(val) {
        this.pause();
        const valid = Math.max(Math.min(Number(val), this.max_frame), 0);
        this.currrent_frame = valid;
    }
}
