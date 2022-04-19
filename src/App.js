import './App.css';
import React from "react"
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import _ from "lodash"

import Kmeans from './Kmeans'
import Graph from './Graph'
import Settings from './Settings'



const theme = createTheme({
  palette: { 
    background: {
      default: "#fafafa"
    }
  }
});

const randomAnchoredNum = (anchored) => {
  while(true) { 
    const num = anchored + ((Math.random() < 0.5 ? -1 : 1) * Math.floor(Math.random() * 13))
    if (num > 0 && num < 100)
      return num
  }
}

const generatePoints = (numPoints, numClusters) =>  {
  console.log("generating points with " + numPoints)

  const points = []

  const pointsPerCluster = Math.floor(numPoints / numClusters);

  
  for (let i = 0; i < numClusters; i++) { 

    // create an anchoring point for the cluster
    const anchor = { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100)}
    for(let j = 0; j < pointsPerCluster; j++) { 
      //if it generates offscreen, then generate another point
      const point = {
        centroid: 0,
        x: randomAnchoredNum(anchor.x),
        y: randomAnchoredNum(anchor.y)
      }
      points.push(point)
    }

  }

  //in case the number of points is not evenly divisible from clusters, add 
  //some random points in to fill it out
  while(points.length < numPoints) { 
    const point = {
      centroid: 0,
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100)
    }
    points.push(point)
  }

  return points
}

const generateInitialClusters = (points, numClusters) => { 

  const clusters = []
  //pick random points to be centroids
  for(let i = 1; i <= numClusters; i++) { 
    const randNum = Math.floor(Math.random() * points.length)
    clusters.push({
      id: i, 
      x: points[randNum].x,
      y: points[randNum].y
    })
  }
  return clusters
}

const distance = (point1, point2) => { 
  return Math.abs(Math.sqrt(
    Math.pow(point2.x - point1.x, 2)
    +
    Math.pow(point2.y - point1.y, 2)
  ))
}

const computeCentroid = (id, points) => { 
  //filter the points down to this cluster
  const idPoints = points.filter((e) => e.centroid == id)

  //now get the average point
  return { 
    id: id,
    x: idPoints.reduce((oldVal, newVal) => oldVal + newVal.x, 0) / idPoints.length,
    y: idPoints.reduce((oldVal, newVal) => oldVal + newVal.y, 0) / idPoints.length
  }
}

const closestCentroid = (point, centroids) => { 

  let retDistance; 
  let retCentroid = point.centroid;

  //loop through, if distance is less, then replace retCentroid
  centroids.forEach((c) => { 
    const d = distance(point, c)
    if(!retDistance || d < retDistance) { 
      retDistance = d
      retCentroid = c.id
    }
  })

  return retCentroid;
}

const runIter = (state) => { 
  
  console.log("iter is " + state.iter)
  const newState = {
    ...state, 
    iter: state.iter+1,
  }

  //move the point to the center of the centroid,
  if(newState.centroids.length == 0) { 
    newState.centroids = generateInitialClusters(state.points, state.cfg.numClusters)
  } else { 
    newState.centroids = newState.centroids.map((e) => computeCentroid(e.id, newState.points))
  }

  newState.points = newState.points.map((e) => { return { centroid: closestCentroid(e, newState.centroids), x: e.x, y: e.y } })

  //now update cluster membership
  console.log(newState)
  return newState;
}

const initialState = (cfg) => { 

  return {
    points: generatePoints(cfg.numPoints, cfg.numClusters),
    centroids: [], 
    cfg: cfg,
    iter: 0
  }   

}

function App() {

  //initialstate is being called on each render....
  const [data, setData] = React.useState()
 
  const doIter = () => {  
    setData((data) => {
      if(data.iter >= data.cfg.numIter)
        return data

      const newState = runIter(data)
      setTimeout(doIter, 300)
      return newState
    })
  }

  const onCfgChange = (withCfg) => { 
    //only regenerate data if the cfg is different
    setData(data => {
      const newCfg = withCfg(data.cfg)
      if(_.isEqual(data.cfg, newCfg)) 
        return data
      
      return initialState(newCfg)      
    })
  }

  const onRunSimulation = () => { 
    doIter()    
  }

  React.useEffect(() => { 
    setData(initialState({ 
        numPoints: 300,
        numClusters: 5, 
        numIter: 10
    }))
  }, [])

  if(!data)
    return
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Box marginY={2}>
          <Typography variant="h5">K-Means Convergence</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item sm={12} md={8}>
            <Paper><Graph data={data}/></Paper>
          </Grid>
          <Grid item sm={12} md={4}>
            <Settings 
              cfg={data.cfg} setCfg={onCfgChange}
              onRunSimulation={onRunSimulation}/>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
