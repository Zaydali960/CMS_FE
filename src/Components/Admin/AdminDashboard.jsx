import React from 'react';
import Sidebar from './sidebar';
import { Switch, Route, Link, useLocation } from "react-router-dom";
import BasicSettings from './BasicSettings'
import CreatePages from './CreatePages'
import Pages from './Pages'

const AdminDashboard = () => {
  return (
    <div className="container-fluid p-0">
  <div className="row g-0">
    
    {/* Mobile Sidebar */}
    <div className="d-lg-none">
      <Sidebar />
    </div>

    {/* Desktop Sidebar */}
    <div className="d-none d-md-block col-md-3 col-xl-2 p-0">
      <div
        className="bg-dark text-white vh-100"
        style={{ position: "sticky", top: 0, overflowY: "auto" }}
      >
        <Sidebar />
      </div>
    </div>

    {/* ✅ Main Content */}
    <div className="col-12 col-md-9 col-xl-10 p-3">
      <Switch>
        <Route exact path="/admin-dashboard/basic-settings" component={BasicSettings} />
        <Route exact path="/admin-dashboard/pages" component={Pages} />
        <Route exact path="/admin-dashboard/create-pages" component={CreatePages} />
      </Switch>
    </div>
    
  </div>
</div>

  );
};

export default AdminDashboard;
