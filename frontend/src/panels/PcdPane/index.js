import React from "react";
import { inject, observer } from "mobx-react";
// import { Button } from "@blueprintjs/core";

import './index.css'

@inject("store") @observer
export default class PcdPane extends React.Component {
    constructor(props) {
        super(props);
        const { pcapName } = props;
        const { pad } = props.store;
        const { fetch_pcap_pcd } = pad;
        fetch_pcap_pcd(pcapName);
    }

    render() {
        const { pcapName } = this.props;
        const { pad } = this.props.store;
        const { findPcapByName } = pad;
        const { pcd_list } = findPcapByName(pcapName);
        const filelist = pcd_list.map(pcd => {
            return (
                <div key={pcd.filename}>1</div>
            )
        })
        return (
            <div className="pcdpane">
                {filelist}
            </div>
        )
    }
}
