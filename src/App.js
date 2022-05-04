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
import store from './store'
import { Provider } from 'react-redux'
import { useSelector, useDispatch } from 'react-redux';

import { selectRuntimeStatus, step} from "./features/kmeansSlice";

import Graph from './Graph'
import Settings from './Settings'

const theme = createTheme({
  palette: { 
    background: {
      default: "#fafafa"
    }
  }
});

const Wrapper = ({children}, ...props) => { 
  const status = useSelector(selectRuntimeStatus)
  const dispatch = useDispatch()

  const timerRef = React.createRef()

  const iter = () => { 
    dispatch(step())
    timerRef.current = setTimeout(iter, 300)
  }

  // check to see if timer is already scheduled?
  React.useEffect(() => { 
    if(status.running === true && !timerRef.current) { 
      timerRef.current = setTimeout(iter, 300)
    }
    return () => clearTimeout(timerRef.current)
  }, [status.running])
  return (
    <>
    {children}
    </>
  )
}

function App() {

  return (
    <Provider store={store}>
      <Wrapper>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container>
            <Box marginY={2}>
              <Typography variant="h5">K-Means Convergence</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item sm={12} md={8}>
                <Paper><Graph/></Paper>
              </Grid>
              <Grid item sm={12} md={4}>
                <Settings/>
              </Grid>
            </Grid>
          </Container>
        </ThemeProvider>
      </Wrapper>
    </Provider>
  );
}

export default App;
