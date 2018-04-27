import { observable, action, computed } from "mobx";
import PARAMETERS from "../config/parameters.yml";
import * as config from '../../config'

class Pcd {
    filename;
    data;

    constructor(filename) {
        this.filename = filename;
        this.data = null;
    }
}

class Pcap {
    @observable filename;
    @observable pcd_list;

    constructor(filename) {
        this.filename = filename;
        this.pcd_list = [];
    }

    findPcdByName = pcd_name => {
        const filtered = this.pcd_list.filter(pcd => pcd.filename === pcd_name);
        if (filtered.length) {
            return filtered[0];
        }
        return null;
    }
}

export default class PadStore {
    @observable showPad = PARAMETERS.defaults.pad.showPad;
    @action.bound togglePad() {
        this.showPad = !this.showPad;
    }

    @observable selectedTabId = "tab_0";
    @action.bound selectTab(tabId) {
        this.selectedTabId = tabId;
    }

    // filepane
    @observable selectedTabId_filepane = "tab_0";
    @action.bound selectTab_filepane(tabId) {
        this.selectedTabId_filepane = tabId;
    }

    @observable filepane_handle = PARAMETERS.defaults.pad.filepane.showHandle;
    @action.bound toggleFilepane_handle() {
        this.filepane_handle = !this.filepane_handle;
    }

    @observable pcap_array = [];
    @observable currrentPcap = null;
    @observable fetch_pcap_state = "pending";
    @action.bound fetch_pcap() {
        this.fetch_pcap_state = "pending";
        const url = config.API_URL + 'playback/pcap'
        fetch(url).then(res => {
            res.json().then(json => {
                const pcaps = json.map(item => {
                    return new Pcap(item);
                })
                this.pcap_array = pcaps;
                if (pcaps.length) {
                    this.currrentPcap = pcaps[0].filename;
                }
                this.fetch_pcap_state = "done";
            }, err => {
                this.fetch_pcap_state = "error";
            })
        })
    }

    findPcapByName = function(pcap_name) {
        const filtered = this.pcap_array.filter(pcap => pcap.filename === pcap_name);
        if (filtered.length) {
            return filtered[0];
        }
        return null;
    }.bind(this);

    @observable fetch_pcap_pcd_state = "pending";
    @action.bound fetch_pcap_pcd(pcap_name) {
        this.fetch_pcap_pcd_state = "pending";
        const url = config.API_URL + 'playback/pcap/' + pcap_name;
        fetch(url).then(res => {
            res.json().then(json => {
                let pcap = this.findPcapByName(pcap_name);
                const pcds = json.map(item => {
                    return new Pcd(item);
                })
                pcap.pcd_list = pcds;
                this.fetch_pcap_pcd_state = "done";
            }, err => {
                this.fetch_pcap_pcd_state = "error";
            })
        })
    }

}
