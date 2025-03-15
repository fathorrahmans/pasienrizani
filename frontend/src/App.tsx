import "./App.css";

import { ChakraProvider } from "@chakra-ui/react";
import PatientList from "./pages/PatientList";

function App() {
  return (
    <ChakraProvider>
      <PatientList />
    </ChakraProvider>
  );
}

export default App;
