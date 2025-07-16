import React, { useContext, useState } from 'react';
import AppContext from '../Context/appContext';

const AdminBar = ({ blocks, slug }) => {
  const { updateComponents, newPage, setNewPage, categoryUpdatePages, setCategoryUpdatePages } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      if (newPage?._id && newPage?.components?.length > 0) {
        await updateComponents(newPage._id, newPage.components);
        setNewPage({});
      }

      if (categoryUpdatePages?._id && categoryUpdatePages?.components?.length > 0) {
        await updateComponents(categoryUpdatePages._id, categoryUpdatePages.components);
        setCategoryUpdatePages({});
      }

      console.log("Update successful");
    } catch (error) {
      console.error("Error during update:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="navbar bg-body-tertiary px-3">
        <div className="ms-auto d-flex gap-2">
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleUpdate} disabled={loading}>
            {loading && (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            )}
            {loading ? "Updating..." : "Update"}
          </button>
          {/* <button className="btn btn-danger">Logout</button> */}
        </div>
      </nav>
    </div>
  );
};

export default AdminBar;
