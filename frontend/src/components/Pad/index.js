import React from "react";
import { inject, observer } from "mobx-react";
import { Tabs, Tab, Card, Button } from "@blueprintjs/core";

import FilePane from '../../panels/FilePane/';
import ConsolePane from '../../panels/ConsolePane/';

import './index.css'

@inject("store") @observer
export default class Pad extends React.Component {
    constructor(props) {
        super(props);
        const { pad } = props.store;
        const { fetch_pcap } = pad;
        fetch_pcap();
    }

    render() {
        const { pad } = this.props.store;
        const { pcap_array, selectedTabId, selectTab, togglePad } = pad;
        return (
            <Card className="pad">
                <Tabs onChange={selectTab} selectedTabId={selectedTabId}>
                    <Tab id="tab_0" title="Files" panel={<FilePane></FilePane>} />
                    <Tab id="tab_1" title="Elements" panel={<div></div>} />
                    <Tab id="tab_3" title="Console" panel={<ConsolePane></ConsolePane>} />
                    <Tabs.Expander />
                    <Button className="pt-minimal" icon="collapse-all" onClick={togglePad}/>
                </Tabs>
            </Card>
        )
    }
}
