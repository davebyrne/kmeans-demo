import React from "react"
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useSelector, useDispatch } from 'react-redux';

import { setNumPoints, setNumClusters, setNumIterations, selectCfg, start, selectRuntimeStatus } from "./features/kmeansSlice";

const Settings = () => { 
    const status = useSelector(selectRuntimeStatus)

    return (
        <Paper>
            <Box padding={1} >
                {status.running ? <Status/> : <Tools/>}
            </Box>
        </Paper>
    )
}

const Status = () => { 
    const status = useSelector(selectRuntimeStatus)

    return ( 
        <Typography gutterBottom>
            Running iteration {status.iter}
        </Typography>
    )
}

const Tools = () => {

    const cfg = useSelector(selectCfg);
    const dispatch = useDispatch()
      
    return (
        <>
            <Typography id="input-slider" gutterBottom>
                Dataset Size:
            </Typography>
            <Box sx={{ display: 'flex' }}>
                <Typography marginRight={2}>
                    100
                </Typography>
                <Slider
                    value={cfg.numPoints}
                    step={100}
                    marks
                    min={100}
                    max={500}
                    valueLabelDisplay="auto"
                    onChange={(e) => dispatch(setNumPoints(e.target.value))}
                />
                <Typography marginLeft={2}>
                    500
                </Typography>
            </Box>

            <Typography id="input-slider" gutterBottom>
                Number of Clusters:
            </Typography>
            <Box sx={{ display: 'flex' }}>
                <Typography marginRight={2}>
                    3
                </Typography>
                <Slider
                    value={cfg.numClusters}
                    step={1}
                    marks
                    min={3}
                    max={10}
                    valueLabelDisplay="auto"
                    onChange={(e) => dispatch(setNumClusters(e.target.value))}
                />
                <Typography marginLeft={2}>
                    10
                </Typography>
            </Box>

            <Typography id="input-slider" gutterBottom>
                Number of Iterations:
            </Typography>
            <Box sx={{ display: 'flex' }}>
                <Typography marginRight={2}>
                    10
                </Typography>
                <Slider
                    value={cfg.numIter}
                    step={10}
                    marks
                    min={10}
                    max={100}
                    valueLabelDisplay="auto"
                    onChange={(e) => dispatch(setNumIterations(e.target.value))}
                />
                <Typography marginLeft={2}>
                    100
                </Typography>
            </Box>
            <Box textAlign='center' marginBottom={2}>
                <Button variant="contained" onClick={() => dispatch(start())}>Run Simulation</Button>
            </Box>
        </>
    )

}

export default Settings