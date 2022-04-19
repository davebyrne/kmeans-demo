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

const generateDataSet = (numPoints, numClusters) =>  {

  const dataset = { 
    points: [],
    centroids: []
  }

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
      dataset.points.push(point)
    }

  }

  //in case the number of points is not evenly divisible from clusters, add 
  //some random points in to fill it out
  while(dataset.points.length < numPoints) { 
    const point = {
      centroid: 0,
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100)
    }
    dataset.points.push(point)
  }

  return dataset
}

const generateInitialClusters = (data, numClusters) => { 
  //pick random points to be centroids
  for(let i = 1; i <= numClusters; i++) { 
    const randNum = Math.floor(Math.random() * data.points.length)
    data.centroids.push({
      id: i, 
      x: data.points[randNum].x,
      y: data.points[randNum].y
    })
  }
  return data
}

const resetData = (oldData) => {
  
  //clear centroids and return copy of data
  return { 
    points: oldData.points.map((e) => { return { centroid: 0, x: e.x, y: e.y } }),
    centroids: [],
  }
}

const runIter = (state) => { 

  //move the point to the center of the centroid,
  //now update cluster membership
    
  return {
    points: state.points,
    centroids: state.centroids.map((e) => { return { id: e.id, x: e.x + 3, y: e.y + 3 } }),
  }
}

function App() {

  const [numPoints, setNumPoints] = React.useState(200)
  const [numClusters, setNumClusters] = React.useState(5)
  const [numIter, setNumIter] = React.useState(10)
  const [data, setData] = React?.useState(null)
  const iter = React.useRef(1)

  const doIter = (data, iter) => { 
    console.log("iteration " + iter.current)
    iter.current = iter.current + 1
    setData(data => runIter(data))
    if(iter.current < numIter) { 
      setTimeout(doIter, 1000, data, iter)
    }
  }

  React.useEffect(() => {
    setData(generateDataSet(numPoints, numClusters))
  }, [numPoints, numClusters])

  const onRunSimulation = () => { 
    setData(generateInitialClusters(resetData(data), numClusters))
    setTimeout(doIter, 1000, data, iter)
  }

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
              numPoints={numPoints} setNumPoints={setNumPoints} 
              numClusters={numClusters} setNumClusters={setNumClusters} 
              numIter={numIter} setNumIter={setNumIter}
              onRunSimulation={onRunSimulation}/>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
