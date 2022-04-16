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

import Graph from './Graph'
import Settings from './Settings'


const theme = createTheme({
  palette: { 
    background: {
      default: "#fafafa"
    }
  }
});


const oldData = {
  points: [
    {x: 23, y: 27, centroid: 0},
    {x: 56, y: 93, centroid: 0},
    {x: 89, y: 34, centroid: 0},
    {x: 45, y: 22, centroid: 1},
    {x: 83, y: 88, centroid: 2},
    {x: 12, y: 68, centroid: 2},
    {x: 17, y: 44, centroid: 3},
    {x: 78, y: 33, centroid: 3},
    {x: 40, y: 38, centroid: 1}
  ],
  centroids: [
    {id: 1, x: 44, y: 44},
    {id: 2, x: 22, y: 22},
    {id: 3, x: 55, y: 66}
  ]
}

const randomAnchoredNum = (anchored) => {
  while(true) { 
    const num = anchored + ((Math.random() < 0.5 ? -1 : 1) * Math.floor(Math.random() * 20))
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

function App() {

  const [numPoints, setNumPoints] = React.useState(200)
  const [numClusters, setNumClusters] = React.useState(5)
  const [numIter, setNumIter] = React.useState(10)
  const [data, setData] = React.useState(null)

  React.useEffect(() => {
    setData(generateDataSet(numPoints, numClusters))
  }, [numPoints, numClusters])

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
              numIter={numIter} setNumIter={setNumIter}/>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
