import React from "react";
import { inject, observer } from "mobx-react";
import * as d3 from "d3";

import { Card, Elevation, Dialog } from "@blueprintjs/core";

import './index.css'

@inject("store") @observer
export default class MonitorView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { monitorView, camera } = this.props.store;
        const { isOpen, close, monitorId, name } = monitorView;
        const { getCameraById } = camera;
        const camera_obj = getCameraById(monitorId);
        const img = camera_obj?(<img src={"data:image/png;base64," + camera_obj.data} />):(<div></div>);
        return (
            <Dialog
                    className="ifilm"
                    icon="camera"
                    onClose={close}
                    title={name}
                    isOpen={isOpen}
                >
                <div className="monitorView">
                    <div className="content">
                        <Card className="filmArea" elevation={Elevation.TWO}>
                            <span></span>{img}
                        </Card>
                        <div className="dataArea">
                            <Card className="card" interactive={true} elevation={Elevation.TWO}>
                                <label><b>Max</b></label>
                                <div className="data">{}</div>
                            </Card>
                            <Card className="card" interactive={true} elevation={Elevation.TWO}>
                                <label><b>Min</b></label>
                                <div className="data">{}</div>
                            </Card>
                            <Card className="card" interactive={true} elevation={Elevation.TWO}>
                                <label><b>Avg</b></label>
                                <div className="data">{}</div>
                            </Card>
                            <Card className="card" interactive={true} elevation={Elevation.TWO}>
                                <label><b>Mean</b></label>
                                <div className="data">{}</div>
                            </Card>
                        </div>
                    </div>
                    <div className="footer">
                        <Card className="controlBar" elevation={Elevation.TWO}></Card>
                    </div>
                </div>
            </Dialog>
        )
    }
}
