import { Hotkey, Hotkeys, HotkeysTarget } from "@blueprintjs/core";
import * as React from "react";

@HotkeysTarget
export class Hotkeys extends React.Component<{}, {}> {
    public render() {
        return <div>Custom content</div>;
    }

    public renderHotkeys() {
        return <Hotkeys>
            <Hotkey
                global={true}
                combo="shift + a"
                label="Be awesome all the time"
                onKeyDown={() => console.log("Awesome!")}
            />
            <Hotkey
                group="Fancy shortcuts"
                combo="shift + f"
                label="Be fancy only when focused"
                onKeyDown={() => console.log("So fancy!")}
            />
        </Hotkeys>;
    }
}
