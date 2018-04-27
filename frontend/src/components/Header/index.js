import React from "react";
import { inject, observer } from "mobx-react";
import { Navbar, NavbarGroup, NavbarHeading, NavbarDivider, Alignment, Button, Switch, Icon, Slider } from "@blueprintjs/core"

import './index.css'

@inject("store") @observer
export default class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { pad, sider, camera, playtool } = this.props.store;
        const { showPad, togglePad } = pad;
        const { showSider, toggleSider } = sider;
        const { data, toggleCamera } = camera;
        const { playing, autoview, pause, backward, forward, jump, max_frame, currrent_frame } = playtool;

        const cameraButton = data.map((item, index) => {
            return (
                <Button key={item.id} className="pt-minimal" onClick={e => toggleCamera(item.id)}><Icon icon="camera" color={item.toggle?"#106ba3":"grey"} style={{margin: "0px auto"}}></Icon></Button>
            )
        })

        const backwardButton = (
            <Button className="pt-minimal" onClick={e => backward()}><Icon icon="step-backward" color={"grey"} style={{margin: "0px auto"}}></Icon></Button>
        )
        const playOrPauseButton = playing?(
            <Button className="pt-minimal" onClick={e => pause()}><Icon icon="pause" color={"grey"} style={{margin: "0px auto"}}></Icon></Button>
        ):(
            <Button className="pt-minimal" onClick={e => autoview()}><Icon icon="play" color={"grey"} style={{margin: "0px auto"}}></Icon></Button>
        )
        const forwardButton = (
            <Button className="pt-minimal" onClick={e => forward()}><Icon icon="step-forward" color={"grey"} style={{margin: "0px auto"}}></Icon></Button>
        )

        // const labelRenderer = (val) => {
        //     return `frame: ${val}`;
        // }
        return (
            <Navbar>
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading>Gemview</NavbarHeading>
                    <NavbarDivider />
                    {backwardButton}
                    {playOrPauseButton}
                    {forwardButton}
                    <NavbarDivider />
                    <Button className="pt-minimal"><input className="pt-input slider-input" value={currrent_frame.toString()} onChange={e => jump(e.target.value)} /></Button>
                    <Slider
                        className="play-slider"
                        min={max_frame===0?0:1}
                        max={max_frame || 1}
                        stepSize={1}
                        labelStepSize={max_frame || 1}
                        value={currrent_frame}
                        onChange={e => jump(e)}
                    />
                    <span style={{marginLeft: '20px'}}>{max_frame} frames</span>
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <NavbarDivider />
                    {cameraButton}
                    <NavbarDivider />
                    <Switch className="selfSwitch" checked={showPad} label="Pad" onChange={togglePad} />
                    <Switch className="selfSwitch" checked={showSider} label="Sider" onChange={toggleSider} />
                </NavbarGroup>
            </Navbar>
        )
    }
}
