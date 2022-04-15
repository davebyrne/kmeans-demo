import './App.css';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Graph from "./Graph"


const theme = createTheme({
  palette: { 
    background: {
      default: "#fafafa"
    }
  }
});


const data = {
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

function App() {
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
            <Paper>
              <Box padding={1} >
                
                <Typography id="input-slider" gutterBottom>
                    Dataset Size:
                </Typography>
                <Box sx={{display: 'flex'}}>
                  <Typography marginRight={2}>
                    100
                  </Typography>
                  <Slider
                      defaultValue={300}
                      step={100}
                      marks
                      min={100}
                      max={500}
                      valueLabelDisplay="auto"
                  />
                  <Typography marginLeft={2}>
                  500
                  </Typography>
                </Box>

                <Typography id="input-slider" gutterBottom>
                    Number of Clusters:
                </Typography>
                <Box sx={{display: 'flex'}}>
                  <Typography marginRight={2}>
                    3
                  </Typography>
                  <Slider
                      defaultValue={5}
                      step={1}
                      marks
                      min={3}
                      max={10}
                      valueLabelDisplay="auto"
                  />
                  <Typography marginLeft={2}>
                  10
                  </Typography>
                </Box>

                <Typography id="input-slider" gutterBottom>
                    Number of Iterations:
                </Typography>
                <Box sx={{display: 'flex'}}>
                  <Typography marginRight={2}>
                    10
                  </Typography>
                  <Slider
                      defaultValue={10}
                      step={10}
                      marks
                      min={10}
                      max={100}
                      valueLabelDisplay="auto"
                  />
                  <Typography marginLeft={2}>
                  100
                  </Typography>
                </Box>
                <Box textAlign='center' marginBottom={2}>
                  <Button variant="contained">Run Simulation</Button>
                </Box>
              </Box>
              

            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
