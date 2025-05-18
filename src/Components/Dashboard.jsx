import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { loginSuccess } from "../Store/User/UserSlice";
import axios from "axios";

function Welcome({username, userid})
{
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                {`Welcome, ${username}`}
            </h1>
            
            <div class="mt-6">
                <button type='button' className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900" name='viewposts' onClick={() => navigate(`/posts`)}>View Posts</button>
                <button type='button' className="ml-5 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900" name='logout' onClick={() => navigate(`/logout`)}>Logout</button>
            </div>
        </div>
    )
}

function Dashboard() 
{
    const { username, userid } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const loginStatus = async () => {
            try {
                const res = await axios.post('http://localhost:8000/me', {}, { withCredentials: true });
                if (res.data.status == 'success') {
                    dispatch(loginSuccess(res.data.user))
                }
                else {
                    navigate('/login')
                }
            }
            catch (err) {
                navigate('/login');
            }
        }

        loginStatus();
    }, [dispatch, navigate]);

    return (
        <>
            <Welcome username={username}/>
        </>
    )
}

export { Dashboard };
