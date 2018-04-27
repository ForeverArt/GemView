import React from "react";
import { inject, observer } from "mobx-react";

import "normalize.css/normalize.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/icons/lib/css/blueprint-icons.css"
import Offlineview from "./Offlineview/"
import Activeview from "./Activeview/"

import './main.css'

@observer
export default class Gemview extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Offlineview></Offlineview>
        )
    }
}
