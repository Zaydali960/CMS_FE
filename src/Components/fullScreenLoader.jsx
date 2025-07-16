import React, {useContext} from 'react';
import AppContext from '../Context/appContext';

const FullScreenLoader = () => {
  const { siteData } = useContext(AppContext);
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-white"
      style={{ zIndex: 9999 }}
    >
      <img
        src={siteData?.logo}
        alt="Loading..."
        className="img-fluid mb-4 rounded-circle"
        style={{ maxWidth: '200px' , maxHeight:'200px'}}
      />
      <div className="spinner-border " role="status" style={{color:siteData?.tertiaryColor}}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default FullScreenLoader;
