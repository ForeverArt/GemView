import React from "react";
import { inject, observer } from "mobx-react";
import * as d3 from "d3";

import { Card, Elevation } from "@blueprintjs/core";

import './index.css'

@inject("store") @observer
export default class EasyChart extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.bindDom();

        const { column, data } = this.props;
        // console.log(dataIndex);
        const PADDING = {
            top: 5,
            right: 5,
            bottom: 5,
            left: 5
        }

        const bbox = this.svg.node().getBoundingClientRect();
        const { width, height } = bbox;

        const xrange = data.map(d => d.x);
        const yrange = data.map(d => d.y);

        const xdomain = d3.extent(xrange);
        const ydomain = d3.extent(yrange);

        const xscale = d3.scaleTime().domain(xdomain).range([PADDING.left, width - PADDING.right]);
        const yscale = d3.scaleLinear().domain(ydomain).range([height - PADDING.bottom, PADDING.top]);

        this.xrange = xrange;
        this.yrange = yrange;
        this.xscale = xscale;
        this.yscale = yscale;

        const xaxis = d3.axisBottom(xscale)
        const yaxis = d3.axisLeft(yscale)

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

        this.timeline = this.svg.append('line')
            .attr('x1', xscale(xrange[0]))
            .attr('x2', xscale(xrange[0]))
            .attr('y1', yscale(ydomain[0]))
            .attr('y2', yscale(ydomain[ydomain.length - 1]))
            .attr("fill", "none")
            .attr("stroke", "#e94d42")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 2)
            .style("opacity", 1);

        this.timepoint = this.svg.append('circle')
            .attr('cx', xscale(xrange[0]))
            .attr('cy', yscale(yrange[0]))
            .attr('r', 3)
            .attr("fill", "red")
            .style("opacity", 1);
    }

    componentDidUpdate() {
        const { dataIndex } = this.props;
        const { xscale, xrange, yscale, yrange } = this;
        this.timeline
            .transition()
            .attr('x1', xscale(xrange[dataIndex]))
            .attr('x2', xscale(xrange[dataIndex]))

        this.timepoint
            .transition()
            .attr('cx', xscale(xrange[dataIndex]))
            .attr('cy', yscale(yrange[dataIndex]))
    }

    bindDom() {
        this.node = this.refs.svg;
        this.svg = d3.select(this.node);
    }

    render() {
        const { column, data } = this.props;
        const { interactiveChart } = this.props.store;
        const { open } = interactiveChart;
        return (
            <div className="easy-chart">
                <Card className="chart-card" interactive={true} elevation={Elevation.ONE} onClick={e => open(column, data)}>
                    <svg ref="svg"></svg>
                </Card>
                <div className="chart-title">{column + " chart"}</div>
            </div>
        )
    }
}
