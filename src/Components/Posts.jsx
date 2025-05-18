import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { loginSuccess } from "../Store/User/UserSlice";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import '../css/styles.css';

function CreateorEditPosts() {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const [imageUrl, setImageUrl] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileError, setFileError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [post, setPost] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { username, userid } = useSelector((state) => state.user);
    const { postid } = useParams(); // Extract postid if editing

    useEffect(() => {
        const loginStatus = async () => {
            try {
                const res = await axios.post('http://localhost:8000/me', {}, { withCredentials: true });

                if (res.data.user) {
                    dispatch(loginSuccess(res.data.user));
                } else {
                    navigate('/login');
                }
            } catch (err) {
                console.log(err);
                navigate('/login');
            }
        };

        loginStatus();
    }, [dispatch, navigate]);

    // Fetch post data if postid exists (edit mode)
    useEffect(() => {
        if (userid > 0 && postid) {
            axios.post('http://localhost:8000/posts/editPost', { userid, postid }, { withCredentials: true })
                .then(res => {
                    setPost(res.data);
                    // Pre-fill form fields
                    setValue('title', res.data.title);
                    setValue('message', res.data.message);
                    setImageUrl(res.data.imageUrl); // Set preview image
                })
                .catch(err => console.log(err));
        }
    }, [userid, postid]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: async (acceptedFiles, rejectedFiles) => {
            if (acceptedFiles.length === 0) return;

            const imgFile = acceptedFiles[0];
            setSelectedFile(imgFile); // Store the actual file object

            if (rejectedFiles.length > 0) {
                setFileError('Only image files (JPEG, PNG, GIF) are allowed.');
                return;
            }

            setFileError('');

            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(imgFile);

            setFileName(imgFile.name);
        },
    });

    function onSubmit(data) {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('message', data.message);
        formData.append('userid', userid);

        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        if (postid)     // Edit 
        {
            formData.append('postid', postid);
            axios.post('http://localhost:8000/posts/updatePost', formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then(res => navigate('/my'))
                .catch(err => console.log(err));
        }
        else    // Create
        {
            axios.post('http://localhost:8000/posts/createPost', formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then(res => navigate('/posts'))
                .catch(err => console.log(err));
        }
    }

    return (
        <div>
            <h2 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">{postid ? "Edit Post" : "Create Post"}
                <button className="float-right text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" onClick={() => navigate('/my')}>Back</button>
            </h2>

            <form method="post" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <label htmlFor='title' className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                    <div>
                        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('title', { required: {value: true, message : "- Title is required"} })} type='text' placeholder="Enter a title" />
                        {errors.title && <p className="text-red-500 mt-3">{errors.title.message}</p>}
                    </div>

                    <label htmlFor='message' className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Message</label>
                    <div>
                        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('message', { required: {value: true, message : "- Message is required"} })} type='text' placeholder="Enter a message" />
                        {errors.message && <p className="text-red-500 mt-3">{errors.message.message}</p>}
                    </div>

                    <label htmlFor='image'>Image</label>
                    <div {...getRootProps()} className="dragdrop">
                        <input {...getInputProps()} />
                        {imageUrl ? <img src={imageUrl} alt="Preview" style={{ width: "100px" }} /> : <p>Drag and drop an image here, or click to select</p>}
                    </div>

                    {fileError && <div style={{ color: 'red' }}><strong>{fileError}</strong></div>}
                    {fileName && <div><strong>File Name:</strong> {fileName}</div>}

                    <div className="w-full flex justify-center">
                        <button type="submit" className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
                            {postid ? "Update Post" : "Submit"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

function ViewPosts() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userid } = useSelector((state) => state.user);
    const [postid, setPostid] = useState('');
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const loginStatus = async () => {
            try {
                const res = await axios.post('http://localhost:8000/me', {}, { withCredentials: true });

                if (res.data.user) {
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

    useEffect(() => {
        if (userid > 0) {
            axios.post('http://localhost:8000/posts/getPosts', { userid }, { withCredentials: true })
                .then(res => setPosts(res.data))
        }
    }, [userid])

    const redirect = (url, target) => {
        window.open(url, target);
    }

    useEffect(() => {

        const handleDelete = async (postid) => {
            if (postid != '') {
                const deletePost = await axios.post(`http://localhost:8000/posts/deletePost`, { postid, userid }, { withCredentials: true })
                    .then(res => setPosts(res.data))
            }
        }

        handleDelete(postid)

    }, [postid])

    return (
        <>
            <div class="mt-6">
                <button type='button' className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900" name='viewposts' onClick={() => navigate(`/create`)}>Create Post</button>
                <button className="float-right text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" onClick={() => navigate('/my')}>Back</button>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-center">S.No</th>
                            <th scope="col" className="px-6 py-3 text-center">Title</th>
                            <th scope="col" className="px-6 py-3 text-center">Message</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            posts.length > 0 ? posts.map((val, index) => {
                                return (
                                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                        <td className="px-6 py-4">{index + 1}</td>
                                        <td className="px-6 py-4">{val.title}</td>
                                        <td className="px-6 py-4">{val.message}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => redirect(`/posts/${val.postid}`, '_self')}
                                                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Edit
                                            </button>
                                            <button
                                                onClick={() => setPostid(val.postid)}
                                                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => redirect(val.imageUrl, '_blank')}
                                                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                                View Image
                                            </button>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="4" className="text-center px-6 py-4 text-gray-500">No posts available</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export { CreateorEditPosts, ViewPosts };  