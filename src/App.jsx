import React, { useState, useContext } from 'react';
import {
  Switch,
  Route,
  useLocation
} from 'react-router-dom';

import Home from './Components/Home';
import CategoryPage from './Components/CategoryPage';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import AdminBar from './Components/AdminBar';
import Admin from './Components/Admin/admin';
import AdminDashboard from './Components/Admin/AdminDashboard';
import FullScreenLoader from './Components/fullScreenLoader';
import AppContext from './Context/appContext';

function App() {
  const [blocks, setBlocks] = useState([]);
const { getPages, fetchPages, loading, siteData } = useContext(AppContext);
  // ✅ useLocation works here because App is inside <BrowserRouter> in index.js
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
const token = localStorage.getItem('authToken');
  return (
    <>
    {loading && <FullScreenLoader/>}
      {!isAdmin && <Navbar />}
      {token && !isAdmin &&<AdminBar blocks={blocks} />}
      <Switch>
        <Route exact path="/">
          <Home setBlocks={setBlocks} blocks={blocks} />
        </Route>
        <Route  path="/admin">
          <Admin />
        </Route>
        <Route  path="/admin-dashboard">
          <AdminDashboard />
        </Route>
        <Route exact path="/:slug">
          <CategoryPage />
        </Route>
      </Switch>
      {!isAdmin && <Footer />}
    </>
  );
}

export default App;
