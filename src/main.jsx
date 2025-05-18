import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { store } from './Store/Store'; 
import './index.css'
import {Login, Signup, Logout } from './Components/Authentication'
import { Dashboard } from './Components/Dashboard'
import { CreateorEditPosts, ViewPosts } from './Components/Posts'
import { Provider } from 'react-redux'

function Error()
{
    return (
        <>
            <div>The requested page cannot be found</div>
        </>
    )
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
        <Router>
            <Routes>
                <Route path='/login' element={<Login/>}/>
                <Route path='/signup' element={<Signup/>}/>
                <Route path='/my' element={<Dashboard/>}/>
                <Route path='/create/:postid?' element={<CreateorEditPosts/>}/>
                <Route path='/posts' element={<ViewPosts/>}/>
                <Route path='/posts/:postid' element={<CreateorEditPosts/>}/>
                <Route path='/logout' element={<Logout/>}/>
                <Route path='*' element={<Error/>}/>
            </Routes>
        </Router>
        </Provider>
    </StrictMode>,
)
