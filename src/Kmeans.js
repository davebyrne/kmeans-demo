
class Kmeans { 

  constructor(numClusters, numIters, data) {
    this.numClusters = numClusters
    this.numIters = numIters
    this.data = data
    this.minDelta = 1
    this.initialize()
  }

  initialize() { 
    //pick random points to be centroids
    for(let i = 1; i <= this.numClusters; i++) { 
      const randNum = Math.floor(Math.random() * this.data.points.length)
      this.data.centroids.push({
        id: i, 
        x: this.data.points[randNum].x,
        y: this.data.points[randNum].y
      })
    }
    console.log(this.data)
  }

  iterate() { 


    if(this.data.centroids.length == 0) { 
      
    }

  }

}


export default Kmeans