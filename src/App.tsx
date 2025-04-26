// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Home from './Home.tsx';
import Output from './Output.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/output" element={<Output />} />
    </Routes>
  );
}

export default App;