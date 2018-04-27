import React from "react";
import { inject, observer } from "mobx-react";

import * as THREE from 'three'
// import Stats from 'stats.js'
import * as Detector from '../../utils/third-party/Detector'
import '../../utils/third-party/PCDLoader'
import '../../utils/third-party/TrackballControls'

import Sider from '../Sider/'
import InteractiveChart from '../../charts/InteractiveChart/'
import MonitorView from '../MonitorView/'

import EasyCamera from '../EasyCamera/'

import './index.css'

@inject("store") @observer
export default class Mainview extends React.Component {
    constructor(props) {
        super(props);
        this.container = {};
        this.camera = {};
        this.controls = {};
        this.scene = {};
        this.renderer = {};
        // this.gridHelper = {};
        this.HexColor = 0.1 * 0xffffff;
        this.pcd_index = 0;

        this.animate = this.animate.bind(this);

        this.headerHeight = 50;
        this.panHeight = 250;
    }

    componentDidMount() {
        if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
        this.init();
        this.animate();
    }

    componentDidUpdate() {
        const { lidar } = this.props.store;
        const { data: data } = lidar;
        const loader = new THREE.PCDLoader();

        loader.load(`data:text/plain;base64,${data}`, (mesh) => {
            const lastMesh = this.scene.getObjectByName("pcd_mesh");
            if (lastMesh) {
                this.scene.remove(lastMesh);
            }
            mesh.name = "pcd_mesh";
            mesh.material.color.setHex(this.HexColor);
            this.scene.add( mesh );
        })
    }

    init() {
        let self = this;
        const { headerHeight, panHeight } = this;

        const { pad } = this.props.store;
        const { showPad } = pad;
        const maxHeight = Math.max(window.innerHeight - this.headerHeight, 0);
        const minHeight = Math.max(maxHeight - panHeight, 0);
        let height = minHeight;
        if (!showPad) height = maxHeight;
        const width = window.innerWidth;



        this.container = document.getElementById('render-canvas')

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x000000 );

        // this.gridHelper = new THREE.GridHelper( 10, 10 );
        // this.scene.add(this.gridHelper)

        this.camera = new THREE.PerspectiveCamera( 60, width / height, 0.1, 300 );
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 60;
        this.camera.up.set(0,1,0);

        this.controls = new THREE.TrackballControls( this.camera, this.container );

        this.controls.rotateSpeed = 2.0;
        this.controls.zoomSpeed = 1.5;
        this.controls.panSpeed = 0.2;

        this.controls.noZoom = false;
        this.controls.noPan = false;

        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;

        this.controls.minDistance = 0.3;
        this.controls.maxDistance = 0.3 * 100;

        this.scene.add( this.camera );

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( width, height);
        document.body.appendChild( this.renderer.domElement );

        this.container.appendChild( this.renderer.domElement );
        window.addEventListener( 'resize', onWindowResize, false );

        function onWindowResize() {
            const { pad } = self.props.store;
            const { showPad } = pad;
            const maxHeight = Math.max(window.innerHeight - self.headerHeight, 0);
            const minHeight = Math.max(maxHeight - self.panHeight, 0);

            self.camera.aspect = window.innerWidth / (showPad?minHeight:maxHeight);
            self.camera.updateProjectionMatrix();
            self.renderer.setSize( window.innerWidth, (showPad?minHeight:maxHeight));
            self.controls.handleResize();
        }
    }

    animate() {
        requestAnimationFrame(this.animate);
        this.controls.update();
        if (this.stats) {
            this.stats.update();
        }
        this.renderer.render( this.scene, this.camera );
    }

    render() {
        const { pad, camera, monitorView } = this.props.store;
        const { showPad } = pad;
        const { data: cameraData } = camera;
        const { open } = monitorView;
        const cameras = cameraData.map((item, index) => {
            const img = (
                <EasyCamera id={"camera_canvas_" + index} data={item.data}></EasyCamera>
            )
            return (
                <div key={item.id}
                    className={"monitor monitor_" + index}
                    style={{height: item.toggle?"180px":"0px"}}
                    onClick={e => open(item.name, item.id)}>
                    {img}
                </div>
            )
        })

        const maxHeight = Math.max(window.innerHeight - this.headerHeight, 0);
        const minHeight = Math.max(maxHeight - this.panHeight, 0);
        if (this.renderer.setSize) {
            this.camera.aspect = window.innerWidth / (showPad?minHeight:maxHeight);
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, showPad?minHeight:maxHeight);
            this.controls.handleResize();
        }
        return (
            <div className="main" ref="canvasRef" height={showPad?minHeight:maxHeight + 'px'}>
                {cameras}
                <Sider></Sider>
                <InteractiveChart></InteractiveChart>
                <MonitorView></MonitorView>
                <div id="render-canvas"></div>
            </div>
        )
    }
}
