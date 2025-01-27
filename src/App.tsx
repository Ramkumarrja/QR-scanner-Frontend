import { Routes, Route } from "react-router-dom";
import ChildPage from "./components/ChildPage";
import ParentPage from "./components/ParentPage";
import Login from "./components/Login";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/child-page" element={<ChildPage />} />
      <Route path="/parent-page" element={<ParentPage />} />
    </Routes>
  );
};

export default App;