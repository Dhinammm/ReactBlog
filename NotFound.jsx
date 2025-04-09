import React from 'react';
import {Link} from 'react-router-dom';
import Home  from "./Home"
function NotFound(){
    return(
        <>
       <h1>
        
        <img src={require(`./not_found.png`)}/>
            Sorry page not found!!!</h1>
            <Link to={`/`} className="btn btn-outline-dark mt-2" >Back</Link>
            <Link to={`/`} className="btn btn-outline-dark mt-2" >Home</Link>
</>
    );

}

export default NotFound;