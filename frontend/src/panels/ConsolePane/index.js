import React from "react";
import { inject, observer } from "mobx-react";
import { Button } from "@blueprintjs/core"

import './index.css'

@inject("store") @observer
export default class ConsolePane extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>ConsolePane</div>
        )
    }
}
