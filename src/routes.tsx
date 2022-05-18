import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/about";
import App from "./pages/_app";
import Help from "./pages/Help";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/profile";
import AppAdmin from "./pages/admin/_app";
import UnverifiedUsers from "./pages/admin/UnverifedUsers";
import Users from "./pages/admin/users";
import Dashboard from "./pages/admin/dashboard";
import Requests from "./pages/admin/requests";
import Voters from "./pages/admin/voters";
import SettingsPage from "./pages/admin/settings";
import Terms from "./pages/terms";
import Privacy from "./pages/privacy";
import Forgot from "./pages/forgot";

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="help" element={<Help />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="profile" element={<Profile />} />
        <Route path="terms" element={<Terms />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="forgot" element={<Forgot />} />
      </Route>
      <Route path="/admin" element={<AppAdmin />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="verify" element={<UnverifiedUsers />} />
        <Route path="users" element={<Users />} />
        <Route path="requests" element={<Requests />} />
        <Route path="voters" element={<Voters />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default Routing;
