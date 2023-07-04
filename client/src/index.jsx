import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './pages/Login';
import UserPage from './pages/UserPage';
import FavoritesPage from './pages/FavoritesPage';
import AllPage from './pages/AllPage';
import DataSharingPage from './pages/DataSharingPage';
import SongRecPage from './pages/SongRecPage';
import Menu from './components/Menu'
import { Route, Link, BrowserRouter, Router, Routes } from 'react-router-dom'

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="" element={ <Login /> } />
            <Route path="/" element={ <Menu /> }>
                <Route path="profile" element={ <UserPage /> } />
                <Route path="dashboard" element={ <FavoritesPage /> } />
                <Route path="all/">
                    <Route path="songs"    element={ <AllPage type="songs"    /> } />
                    <Route path="genres"   element={ <AllPage type="genres"   /> } />
                    <Route path="artists"  element={ <AllPage type="artists"  /> } />
                    <Route path="albums"   element={ <AllPage type="albums"   /> } />
                </Route>

                <Route path="premium/">
                    <Route path="recommendations" element={<SongRecPage />} ></Route>
                    <Route path="sharing/:key" element={<DataSharingPage />} ></Route>
                    <Route path="sharing/" element={<DataSharingPage />} ></Route>
                </Route>
            </Route>
        </Routes>
    </BrowserRouter>,
    document.getElementById('root')
);