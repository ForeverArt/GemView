import React from "react";
import { inject, observer } from "mobx-react";
import { Button, Card, Elevation, Switch, Menu, MenuItem, MenuDivider, Tabs, Tab } from "@blueprintjs/core";

import PcdPane from '../PcdPane/';

import './index.css'

@inject("store") @observer
export default class FilePane extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { pad } = this.props.store;
        const { filepane_handle, toggleFilepane_handle, pcap_array } = pad;
        const filepane_tabs = pcap_array.map((pcap, index) => {
            return (
                <Tab key={pcap.filename} id={"tab_" + index} title={pcap.filename} panel={<PcdPane pcapName={pcap.filename}></PcdPane>} />
            )
        })
        return (
            <div className="filepane">
                <Card className="config-card" elevation={Elevation.TWO}>
                    <Switch checked={filepane_handle} label="Toggle Handle" onClick={toggleFilepane_handle} />

                </Card>
                <Card className="file-card" elevation={Elevation.TWO}>
                    <Tabs
                        selectedTabId="tab_0"
                        vertical
                        animate={false}
                    >
                        {filepane_tabs}
                        <Tabs.Expander />
                    </Tabs>
                </Card>
            </div>
        )
    }
}
