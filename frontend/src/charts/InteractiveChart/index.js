import React from "react";
import { inject, observer } from "mobx-react";
import * as d3 from "d3";

import { Card, Elevation, Dialog } from "@blueprintjs/core";

import './index.css'

@observer
class InteractiveSvg extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.bindDom();

        const { name, data } = this.props;
        const PADDING = {
            top: 15,
            right: 15,
            bottom: 30,
            left: 40
        }

        const bbox = this.svg.node().getBoundingClientRect();
        const { width, height } = bbox;

        const xdomain = d3.extent(data, d => d.x);
        const ydomain = d3.extent(data, d => d.y);

        const xscale = d3.scaleTime().domain(xdomain).range([PADDING.left, width - PADDING.right]);
        const yscale = d3.scaleLinear().domain(ydomain).range([height - PADDING.bottom, PADDING.top]);

        let xticks = xscale.ticks();
        // xticks.shift();
        let yticks = yscale.ticks();
        yticks.shift();

        const xaxis = d3.axisBottom(xscale).tickFormat(d3.timeFormat("%H:%M:%S"));
        const yaxis = d3.axisLeft(yscale);

        const line = d3.line()
            .x(d => xscale(d.x))
            .y(d => yscale(d.y));

        const path = this.svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        this.svg.append('g')
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xscale(d.x))
            .attr('cy', d => yscale(d.y))
            .attr('r', 3)
            .attr('fill', 'skyblue')
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .style('opacity', 0.8)

        this.svg.append('g')
            .attr("transform", "translate(0," + (height - PADDING.bottom) + ")")
            .call(xaxis);
        this.svg.append('g')
            .attr("transform", "translate(" + PADDING.left + ", 0)")
            .call(yaxis);

        // dashed grid line
        this.svg.append('g')
            .selectAll('line')
            .data(yticks)
            .enter()
            .append('line')
            .attr('x1', xscale(xdomain[0]))
            .attr('x2', xscale(xdomain[xdomain.length - 1]))
            .attr('y1', d => yscale(d))
            .attr('y2', d => yscale(d))
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr("stroke-dasharray", "4, 4")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 0.5)
            .style("opacity", 0.7)

        this.svg.append('g')
            .selectAll('line')
            .data(xticks)
            .enter()
            .append('line')
            .attr('y1', yscale(ydomain[0]))
            .attr('y2', yscale(ydomain[ydomain.length - 1]))
            .attr('x1', d => xscale(d))
            .attr('x2', d => xscale(d))
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr("stroke-dasharray", "4, 4")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 0.5)
            .style("opacity", 0.7)

        this.svg.append('g')
            .attr('class', 'brush')
            .call(d3.brushX()
                .extent([[PADDING.left, PADDING.top], [width - PADDING.right, height - PADDING.bottom]])
                .on('brush', brushed)
                // .on('end', brushended)
            );

        function brushed() {

        }

        function brushended() {
            if (!d3.event.sourceEvent) return;
            if (!d3.event.selection) return;
            let d0 = d3.event.selection.map(xscale.invert),
                d1 = d0.map(d3.timeDay.round);

            if (d1[0] >= d1[1]) {
                d1[0] = d3.timeSecond.floor(d0[0]);
                d1[1] = d3.timeSecond.offset(d1[0]);
            }

            d3.select(this).transition().call(d3.event.target.move, d1.map(xscale));
        }
    }

    bindDom() {
        this.node = this.refs.svg;
        this.svg = d3.select(this.node);
    }

    render() {
        return (
            <svg ref="svg"></svg>
        )
    }
}


@inject("store") @observer
export default class InteractiveChart extends React.Component {
    constructor(props) {
        super(props);
    }

    formatted(data) {
        return (Number(data) || 0).toFixed(3);
    }

    render() {
        const { interactiveChart } = this.props.store;
        const { isOpen, close, data, title } = interactiveChart;
        const ydomain = d3.extent(data, d => d.y);
        const yavg = (d3.sum(data, d => d.y) / data.length);
        const ymedian = d3.median(data, d => d.y);
        return (
            <Dialog
                    className="ichart"
                    icon="chart"
                    onClose={close}
                    title={title}
                    isOpen={isOpen}
                >
                <div className="interactiveSvg">
                    <div className="content">
                        <Card className="chartArea" elevation={Elevation.TWO}>
                            <InteractiveSvg data={data} />
                        </Card>
                        <div className="dataArea">
                            <Card className="card" interactive={true} elevation={Elevation.TWO}>
                                <label><b>Max</b></label>
                                <div className="data">{this.formatted(ydomain[1])}</div>
                            </Card>
                            <Card className="card" interactive={true} elevation={Elevation.TWO}>
                                <label><b>Min</b></label>
                                <div className="data">{this.formatted(ydomain[0])}</div>
                            </Card>
                            <Card className="card" interactive={true} elevation={Elevation.TWO}>
                                <label><b>Avg</b></label>
                                <div className="data">{this.formatted(yavg)}</div>
                            </Card>
                            <Card className="card" interactive={true} elevation={Elevation.TWO}>
                                <label><b>Mean</b></label>
                                <div className="data">{this.formatted(ymedian)}</div>
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
