import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import Box from '@mui/material/Box';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';

import { SnackbarProvider } from 'notistack';
import { DojoProvider } from "./contexts/dojoContext";
import { routes } from './helpers/routes';
import { mainTheme } from './helpers/themes';
import Header from "./components/header";

function App() {
  return (
    <BrowserRouter>
      <Box className='background'>
        <StyledEngineProvider injectFirst>

          <ThemeProvider theme={mainTheme}>
            <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'center' }} preventDuplicate>

              <DojoProvider>

                <Box className='main'>

                  <Header />

                  <Routes>
                    {routes.map((route, index) => {
                      return <Route key={index} path={route.path} element={route.content} />
                    })}
                  </Routes>

                </Box>

              </DojoProvider>

            </SnackbarProvider>
          </ThemeProvider>

        </StyledEngineProvider>
      </Box>
    </BrowserRouter >
  );
}

export default App
