import React from "react";
import { inject, observer } from "mobx-react";

import * as THREE from 'three'

import './index.css'

@inject("store") @observer
export default class EasyCamera extends React.Component {
    constructor(props) {
        super(props);
        this.loader = new THREE.ImageLoader();
    }

    componentDidMount() {
        const { id } = this.props;
        this.bindNode(id);
    }

    bindNode(id) {
        this.node = this.refs[id];
    }

    componentDidUpdate() {
        const { data } = this.props;
        const image_src = `data:text/plain;base64,${data}`;
        const node = this.node;
        const ctx = node.getContext('2d');
        const width = node.offsetWidth;
        const height = node.offsetHeight;
        this.loader.load(image_src, function (image) {
            ctx.drawImage(image, 0, 0, width, height);
        })
    }

    render() {
        const { id } = this.props;
        return (
            <canvas id={id} ref={id}></canvas>
        )
    }
}
