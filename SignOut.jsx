
import axios from "axios";
import { useEffect } from "react";


function SignOut(){
    useEffect(() => {
        const csrf = document
          .querySelector('meta[name="csrf-token"]')
          .getAttribute("content");
    
        axios.defaults.headers["X-CSRF-Token"] = csrf;
    
        axios
          .delete("http://localhost:3000/users/sign_out")
          .then(response => {
            console.log("Logout successful");
            window.location.href = "/";
            
          })
          .catch(error => {
            console.error("Logout failed", error);
          });
      }, []); 
return null;

}

export default SignOut;