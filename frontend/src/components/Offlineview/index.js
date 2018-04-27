import React from "react";
import { inject, observer } from "mobx-react";
import { Collapse } from "@blueprintjs/core"

import Header from '../Header/'
import Mainview from '../Mainview/'
import Pad from '../Pad/'

import { offline_ws } from "../../store/websocket";

import './index.css'

@inject("store") @observer
export default class Offlineview extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        offline_ws.initialize();
    }

    render() {
        const { pad } = this.props.store;
        const { showPad } = pad;
        return (
            <div className="offlineview">
                <Header></Header>
                <Mainview></Mainview>
                <Collapse className="padCollapse" keepChildrenMounted isOpen={showPad}>
                    <Pad></Pad>
                </Collapse>
            </div>
        )
    }
}
