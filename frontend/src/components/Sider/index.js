import React from "react";
import { inject, observer } from "mobx-react";
import { Card, Elevation } from "@blueprintjs/core"

import EasyChart from '../../charts/EasyChart/'

import './index.css'

@inject("store") @observer
export default class Sider extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let self = this;
        window.addEventListener( 'resize', onWindowResize, false );
        function onWindowResize() {
            // re-render
            self.setState({});
        }
    }

    render() {
        const { sider, pad, can, playtool } = this.props.store;
        const { showSider } = sider;
        const { showPad } = pad;
        const { data: canData } = can;
        const { dataIndex } = playtool;
        const minHeight = Math.max(window.innerHeight - 300, 0);
        const maxHeight = Math.max(window.innerHeight - 50, 0);

        const easycharts = canData.map((item, index) => {
            return (
                <EasyChart key={index} column={item.column_name} data={item.data} dataIndex={dataIndex} />
            )
        })

        return (
            <div className="my-sider" ref="sider" style={{right: showSider?'0px':'-250px', height: showPad?minHeight:maxHeight}}>
                <Card className="sider-card" elevation={Elevation.ONE}>
                    {easycharts}
                    {easycharts}
                </Card>
            </div>
        )
    }
}
