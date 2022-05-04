import React from "react"
import { useSelector } from 'react-redux';

import { selectData } from "./features/kmeansSlice";
import * as d3 from "d3"

const GraphAxis = ({domain}) => { 

  const yRef = React.useRef(null)
  const xRef = React.useRef(null)

  React.useEffect(() => {
  
    if(xRef.current && yRef.current) { 
      d3.select(xRef.current)
        .attr("transform", "translate(0, " + domain.height + ")")
        .call(d3.axisBottom(domain.x))
      d3.select(yRef.current).call(d3.axisLeft(domain.y))
    }
  }, [])

  return (
    <>
      <g ref={xRef}/>
      <g ref={yRef}/>
    </>
  )
}

const GraphPoints = ({domain, data, ...props}) => { 

  const svgRef = React.useRef(null)

  React.useEffect(() => {
    if(!svgRef.current)
      return;
    
    const svg = d3.select(svgRef.current);

    const colors = d3.schemeCategory10

    svg.select(".points")
      .selectAll("circle")
      .data(data.points)
      .join("circle")
      .attr("r", 1.5)
      .attr("cx", value => domain.x(value.x))
      .attr("cy", value => domain.y(value.y))
      .attr("fill", value => colors[value.centroid])
      .attr("stroke", value => colors[value.centroid])

    svg.select(".centroids")
      .selectAll("circle")
      .data(data.centroids)
      .join("circle")
      .attr("r", 5)
      .attr("cx", value => domain.x(value.x))
      .attr("cy", value => domain.y(value.y))
      .attr("fill", value => colors[value.id])
      .attr("stroke", value => colors[value.id])

  }, [data]);

 
  return ( 
    <g ref={svgRef}>
      <g className="points"></g>
      <g className="centroids"></g>
    </g>
  )
}

const Graph = ({width, height, margin, data, ...props}) => { 



  const [domain, setDomain] = React.useState(null)

  React.useEffect(() => { 

    const graphWidth = width - margin.left - margin.right
    const graphHeight = height - margin.top - margin.bottom

    const xFunc = d3.scaleLinear()
      .domain([0, 100])
      .range([0, graphWidth])
    
    const yFunc = d3.scaleLinear()
      .domain([0, 100])
      .range([graphHeight, 0])

    setDomain({x: xFunc, y: yFunc, width: graphWidth, height: graphHeight, margin: margin})
  
  }, [width, height, margin])

  if(!domain)
    return null
 
  return (
    <div id="#d3-viz">
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <GraphAxis domain={domain}/>
          <GraphPoints domain={domain} data={data} />
        </g>
      </svg>
    </div>
  )
}

const GraphWrapper = ({...props}) => { 
  const margin = { left: 50, top: 50, bottom: 50, right: 50}
  const data = useSelector(selectData)
  console.log(data)
  return <Graph width={400} height={400} margin={margin} data={data} {...props}/>
}
export default GraphWrapper;