import React from 'react'
import { Link } from 'react-router-dom';

const Collection = ({collections = []}) => {

  return (
    <div>
          <div className="container-fluid py-5" style={{background: '#f8f9fa'}}>
      <div className="row g-4">
        {/* Leather Belts Card */}

        <h1 className='text-center'>Collections</h1>
       {collections.map((collection, index)=>( <div className="col-md-6" key={index}>
         <Link to={`/category/${collection.slug}`} className="text-decoration-none">
          <div className="card border-0 shadow-lg h-100">
            <div className="position-relative">
             <img 
                src={collection.img}
                className="card-img-top" 
                alt="Leather Belts"
                style={{height: '400px', objectFit: 'cover'}}
              />
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                   style={{background: 'rgba(0,0,0,0.4)'}}>
                <h2 className="text-white fs-1 fw-light" style={{letterSpacing: '2px'}}>
                  {collection.name}
                </h2>
              </div>
            </div>
          </div>
          </Link>
        </div>))}

    </div>
    </div>
    </div>
  )
}

export default Collection
