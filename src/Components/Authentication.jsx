import {useForm} from 'react-hook-form';
import axios from 'axios'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from '../Store/User/UserSlice';

function Login()
{
    const {register, handleSubmit, formState: {errors}} = useForm();
    const { userid } = useSelector((state) => state.user);
    const [dbError, setDBError] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch();
    
    useEffect(() => {
        const loginStatus = async () => {
            try {
                const res = await axios.post('http://localhost:8000/me', {}, { withCredentials: true });

                if (res.data.user) {
                    navigate('/my');
                } else {
                    navigate('/login');
                }
            } catch (err) {
                navigate('/login');
            }
        };

        loginStatus();
    }, [dispatch, navigate]);

    function onSubmit(data)
    {
        setDBError('')
        axios.post('http://localhost:8000/login', data, { withCredentials: true })
        .then(res => {
            dispatch(loginSuccess(res.data.user));
            if(res.data.status == 'success') navigate('/my')
        })
        .catch(err => setDBError(err.response.data))
    }

    return (
    <>
        <div className='flex items-center justify-center min-h-screen w-full'>
            <form method="POST" onSubmit={handleSubmit(onSubmit)} className='w-full max-w-xl mx-auto p-8 rounded-lg shadow-md'>
                <div className='text-red-500 mb-5 text-center'>{dbError}</div>

                <div className='relative z-0 w-full mb-6 group'>
                    <input className="block py-3 px-4 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" {...register('username', {required: {value: true, message: '- Please enter your username'}, minLength: {value: 4, message: "- Invalid username"}})} type='text' name='username' placeholder=" " autoComplete="off"/>
                    <label htmlFor='username' className="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Username</label>
                </div>

                {errors.username && <p className='text-red-500 mb-6'>{errors.username.message}</p>}

                <div className='relative z-0 w-full mb-6 group'>
                    <input className="block py-3 px-4 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" {...register('password', {minLength: 4})} type='text' name='password' placeholder=" " autoComplete="off" value='test' disabled/>
                    <label htmlFor='password' className="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                </div>

                <div className='flex justify-center'>
                    <button type='submit' name="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm sm:text-base w-auto px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
                </div>

                <div className='mt-5'>
                    Don't have an account? <a href='/signup'>Signup here</a>
                </div>
            </form>
        </div>
    </>
)
}

function Signup()
{
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [dbError, setDBError] = useState('')
    const navigate = useNavigate()
     
    function onSubmit(data)
    {
        setDBError('')

        axios.post('http://localhost:8000/signup', data)
        .then(res => {
            if(res.data.status == 'success') navigate('/my')
        })
        .catch(err => setDBError(err.response.data))
    }

    return (
        <>
        <div className='flex items-center justify-center min-h-screen w-full'>
            <form method="POST" onSubmit={handleSubmit(onSubmit)} className='w-full max-w-xl mx-auto p-8 rounded-lg shadow-md'>
                <div className='text-red-500'>{dbError}</div>

                    <div className='relative z-0 w-full mb-6 group'>
                        <label htmlFor='username' className='peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Username</label>
                        <input className="block py-3 px-4 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" {...register('username', {required: {value: true, message: '- Please enter your username'}, minLength: {value: 4, message: "- Invalid username"}})} type='text' name='username' placeholder=" " autoComplete="off"/>
                    </div>

                    <div className='mb-5 text-red-500'>
                        {errors.username && <p>{errors.username.message}</p>}
                    </div>

                    <div className='relative z-0 w-full mb-6 group'>
                        <label htmlFor='email' className='peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Email</label>
                        <input className="block py-3 px-4 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" {...register('email', {required: {value: true, message: '- Please enter your email'} }, {pattern: {
                            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                            message: "- Invalid email address"
                        }})} type='text' name='email' placeholder=" " autoComplete="off"/>
                    </div>

                    <div className='mb-5 text-red-500'>
                        {errors.email && <p>{errors.email.message}</p>}
                    </div>

                    <div className='relative z-0 w-full mb-6 group'>
                        <label className='peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6' htmlFor='password'>Password</label>
                        <input className="block py-3 px-4 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" {...register('password')} type='text' name='password' placeholder="test" autoComplete="off" value='test' disabled/>
                    </div>

                    <div className="flex justify-center">
                        <button type='submit' name="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm sm:text-base w-auto px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Signup</button>
                    </div>

                    <div className='mt-5'>
                        Already have an account? <a href='/login'>Login here</a>
                    </div>
            </form>
            </div>
        </>
    )
}

function Logout()
{
    const dispatch = useDispatch();
    const navigate = useNavigate()

    useEffect(() => {
        axios.get('http://localhost:8000/logout', { withCredentials: true })   
        .then(res => {
            if(res.data == 'success')
            {
                dispatch(logout);
                navigate('/login')
            }
        })
    }, [])
}

export {Login, Signup, Logout}  