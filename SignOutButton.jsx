import React, { useState, useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import axios from "axios";
import Home from "./Home"


function SignOutButton(){

    return (
        <Link to="/users/sign_out">SignOut</Link>
    );
}

export default SignOutButton;