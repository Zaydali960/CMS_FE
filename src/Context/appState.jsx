import React, { useState, useEffect } from 'react'
import AppContext from './appContext'

const AppState = (props) => {
  

const [getPages, setGetPages]= useState([])
const [newPage, setNewPage] = useState({})
const [categoryUpdatePages, setCategoryUpdatePages] = useState({})
const [siteData, setSiteData] = useState()
const [loading , setLoading] = useState(false)
const token = localStorage.getItem('authToken');

const signIn = async (email, password) => {  // Change parameter name
  try {
    const res = await fetch(`http://localhost:5000/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })  // Send "email"
    });
    // ... rest of code

    const data = await res.json();

    if (!res.ok || !data.token) {
      // Optional: log full response for debugging
      console.warn('Login response:', data);
      throw new Error(data.message || 'Login failed');
    }

    // ✅ Only runs if login is successful
    console.log('Login success:', data);

    localStorage.setItem('authToken', data.token);
    return data;

  } catch (error) {
    console.error('Login error:', error.message);
    alert("Login failed: " + error.message);
    return { error: error.message };
  }
};







  const fetchPages = async () => {
    setLoading(true)
    
    try {
      const res = await fetch(`http://localhost:5000/api/home/get`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Update failed');
      }
  
      setGetPages(data)
  
      // console.log('All Categories Get:', data);
    } catch (error) {
      console.error('Error getting category:', error.message);
    }
    finally{
      setLoading(false)
    }
  };
  
  useEffect(() => {
  fetchPages();
}, []);


const addCategory = async ({ slug, metaTitle, metaDesc }) => {
  try {
    const response = await fetch('http://localhost:5000/api/category/add-category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: {
          slug,
          metaTitle,
          metaDesc
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add category');
    }

    console.log('Category added successfully:', data.category);
    return data.category;
  } catch (error) {
    console.error('Error adding category:', error.message);
    throw error;
  }
};



const updatePages = async (id, updatePage ) => {
  setLoading(true)
  try {
    const response = await fetch(`http://localhost:5000/api/home/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        updatePage
      )
    });

    const data = await response.json();
    console.log("backend page", updatePage)
    if (!response.ok) {
      throw new Error(data.message || 'Update failed');
    }

    console.log('Block updated successfully:', data);
  } catch (error) {
    console.error('Error updating block:', error.message);
  }finally{

    setLoading(false)
  }
};




const updateComponents = async (id, newComponents) => {
  try {
    const response = await fetch(`http://localhost:5000/api/home/update-components/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ components: newComponents })
    });

    const data = await response.json();
    console.log('Updated:', data);
  } catch (error) {
    console.error('Update failed:', error.message);
  }
};




const deletePageById = async (pageId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/home/delete-page/${pageId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete page');
    }

    console.log('✅ Page deleted:', result);
    return result;
  } catch (error) {
    console.error('❌ Delete error:', error.message);
    throw error;
  }
};


const getBasicSettings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/basics/get-basic-settings');
      const data = await res.json();
      setSiteData(data);
    } catch (err) {
      console.error('Error fetching settings:', err.message);
    }
  };
useEffect(() => {
  getBasicSettings()
}, [])




 const updateBasicSettings = async (newSettings) => {
    try {
      const res = await fetch('http://localhost:5000/api/basics/update-basic-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });

      const data = await res.json();
      if (data?.success) {
        setSiteData(data.settings);
      }
      return data;
    } catch (err) {
      console.error('Error updating settings:', err.message);
    }
  };
  

  const updateMetaDetails = async (id, metaTitle, metaDescription) => {
  try {
    const response = await fetch(`http://localhost:5000/api/home/update-meta-details/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metaTitle,
        metaDescription,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error updating:", data.message);
    } else {
      console.log("Meta details updated successfully:", data);
      // Optionally: show success message to user
    }
  } catch (error) {
    console.error("Fetch error:", error.message);
  }
};





     return (
    <AppContext.Provider value={{signIn,loading,updateMetaDetails, token, updateBasicSettings, siteData, categoryUpdatePages, deletePageById, setCategoryUpdatePages, fetchPages, addCategory, updatePages, updateComponents, getPages, setGetPages,newPage, setNewPage}}>
      {props.children}
    </AppContext.Provider>
  )
}


export default AppState