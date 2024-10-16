import { Routes, Route, } from "react-router-dom";
import Home from "./components/Home";

import { NoteProvider } from "./context/notes/NoteContext";
import { AlertProvider } from "./context/AlertContext";

import PageNotFound from "./components/PageNotFound";

import Login from "./components/Login";
import Register from "./components/Register";
// index.js
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  return (
    <>
      <NoteProvider>
        <AlertProvider>
          <Routes>
          
            <Route path="/home" index element={<Home />} />
            <Route path="/register" index element={<Register />} />
            <Route path="/login" index element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </AlertProvider>
      </NoteProvider>
    </>
  );
}

export default App;
