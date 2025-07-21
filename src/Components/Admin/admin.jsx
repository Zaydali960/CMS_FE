import React, { useState, useContext, useEffect } from 'react';
import AppContext from '../../Context/appContext';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export default function Admin() {
  const context = useContext(AppContext);
  const { signIn, user, getUser, siteData, getBasicSettings } = context;

  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginLoader, setLoginLoader] = useState(false);
  const history = useHistory();

  const color = siteData?.tertiaryColor || '#9e9e9eff';
const token = localStorage.getItem("authToken");

  if(token){
    history.push("/admin-dashboard/basic-settings")
  }
// useEffect(() => {
//   getBasicSettings();
// }, []);
const handleLogin = async(e)=>{
   e.preventDefault();
                  setLoginLoader(true);
                  await signIn(credentials.username, credentials.password);
                  setLoginLoader(false);
                  history.push('/admin-dashboard/basic-settings')
}

  return (
    <div className='my-5'>
      <div className="pt-5">
        <div className="d-flex justify-content-center">
          <div className="d-flex flex-column pt-5">
            <div className="card mx-3 shadow-sm" style={{ width: '400px', backgroundColor: "#fff", border: `1px solid ${color}` }}>
              <h1 className="text-center my-3" style={{ fontFamily: 'Montserret', color: color }}>Login</h1>
              <form
                onSubmit={handleLogin}
              >
                <div className="mb-3 mx-3">
                  <input
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    style={{ color: color, backgroundColor: '#fff', borderColor: color }}
                    type="text"
                    className="form-control my-2"
                    placeholder="Username"
                  />
                  <input
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    style={{ color: color, backgroundColor: '#fff', borderColor: color }}
                    type="password"
                    className="form-control"
                    placeholder="Password"
                  />
                </div>
                <div className="d-flex justify-content-center mt-2 mb-4">
                  <button
                    type='submit'
                    className="btn"
                    style={{ color: color, borderColor: color, backgroundColor: '#fff', minWidth: '100px' }}
                    disabled={loginLoader}
                  >
                    {loginLoader ? (
                      <div className={`spinner-border spinner-border-sm text-${color === '#000a62' ? 'primary' : 'dark'}`} role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      'Login'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
