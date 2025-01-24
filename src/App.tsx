import { Routes, Route } from "react-router-dom";
import ChildPage from "./components/ChildPage";
import ParentPage from "./components/ParentPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ParentPage />} />
      <Route path="/child-page" element={<ChildPage />} />
    </Routes>
  );
};

export default App;