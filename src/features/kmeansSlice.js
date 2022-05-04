import { createSlice } from '@reduxjs/toolkit'

const initialCfg = {
  numPoints: 300,
  numClusters: 5, 
  numIter: 10
}


const randomAnchoredNum = (anchored) => {
  while(true) { 
    const num = anchored + ((Math.random() < 0.5 ? -1 : 1) * Math.floor(Math.random() * 13))
    if (num > 0 && num < 100)
      return num
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



const generatePoints = (numPoints, numClusters) =>  {
  //console.log("generating points with " + numPoints)

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

export const kmeansSlice = createSlice({
  name: 'kmeans',
  initialState: {
    data: { 
      points: generatePoints(initialCfg.numPoints, initialCfg.numClusters),
      centroids: [],
    },
    cfg: initialCfg,
    runtimeStatus: { 
      iter: 0,
      converged: false,
      running: false
    }
  },
  reducers: {
    setNumPoints: (state, action) => {
      if(state.cfg.numPoints !== action.payload) {
        state.cfg.numPoints = action.payload
        state.data.points = generatePoints(state.cfg.numPoints, state.cfg.numClusters)
        state.data.centroids = []
      }
    },
    setNumClusters: (state, action) => {
      if(state.cfg.numClusters !== action.payload) { 
        state.cfg.numClusters = action.payload
        state.data.points = generatePoints(state.cfg.numPoints, state.cfg.numClusters)
        state.data.centroids = []
      }
    },
    setNumIterations: (state, action) => {
      state.cfg.numIter = action.payload
    }, 
    step: (state) => { 

      //do an iteration
      state.runtimeStatus.iter += 1

      //move the point to the center of the centroid,
      state.data.centroids = state.data.centroids.map((e) => computeCentroid(e.id, state.data.points))

      //update cluster membership
      state.data.points = state.data.points.map((e) => { return { centroid: closestCentroid(e, state.data.centroids), x: e.x, y: e.y } })

      if(state.runtimeStatus.iter >= state.cfg.numIter) { 
        state.runtimeStatus.running = false
      }
    },
    start: (state) => { 
      //set running to be true and clear and existing centroids / membership
      state.runtimeStatus.running= true
      state.runtimeStatus.iter = 1
      state.data.centroids = generateInitialClusters(state.data.points, state.cfg.numClusters)
      //update cluster membership
      state.data.points = state.data.points.map((e) => { return { centroid: closestCentroid(e, state.data.centroids), x: e.x, y: e.y } })
    }
  }
})


// Action creators are generated for each case reducer function
export const { setNumPoints, setNumClusters, setNumIterations, step, start } = kmeansSlice.actions

export const selectCfg = (state) => state.kmeans.cfg

export const selectData = (state) => state.kmeans.data

export const selectRuntimeStatus = (state) => state.kmeans.runtimeStatus

export default kmeansSlice.reducer