import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';

function SignInButton(){
  return <Link to="/users/sign_in" className="btn btn-text-dark mb-2">Sign in </Link>
}


export default SignInButton;