import React from "react";
import Main from "./main.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
