import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import logo from "./../wwwroot/images/info.png";
import hamburger from "./../wwwroot/images/Hamburger.png";
import ReactSvgIcon from "./common/ReactSvgIcon";


const Frame = (props) => {
  const [dayNumber, setDayNumber] = useState(new Date().getDay() % 12);

  const getCss = (spriteType, dayNumber) => `transparent url('/images/Bootstrap${spriteType}Composed.jpg') 0 ${-81 * dayNumber}px`;
  const [todaysHeaderCss, setTodaysHeaderCss] = useState(getCss('Header', dayNumber));
  const [todaysFooterCss, setTodaysFooterCss] = useState(getCss('Footer', dayNumber));

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const elCollapseButton = useRef(null);
  const sidebarRef = useRef(null);
  const menuRefs = {
    homeLi: useRef(null),
    albumsLi: useRef(null),
    userLi: useRef(null),
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setSidebarOpen(false);
        document.getElementById('main-content').classList.remove('content-blur');
      }
    };


    if (elCollapseButton.current) {
      elCollapseButton.current.addEventListener('click', toggleSidebar);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      if (elCollapseButton.current) {
        elCollapseButton.current.removeEventListener('click', toggleSidebar);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [menuRefs]);

  const toggleSidebar = () => {
    setSidebarOpen(prevSidebarOpen => {
      const newState = !prevSidebarOpen;
      const mainContent = document.getElementById('main-content');
      if (newState) {
        mainContent.classList.add('content-blur');
      } else {
        mainContent.classList.remove('content-blur');
      }
      return newState;
    });
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    document.getElementById('main-content').classList.remove('content-blur');
  };

  return (
    <div>
      <header className="navbar navbar-expand-lg navbar-light bg-light" style={{ background: todaysHeaderCss, height: '81px', margin: '0' }}>
        <div className="container">
          <a className="navbar-brand pb-5 mb-3" href="/">
            <ReactSvgIcon text={'ReactHomepage'} icon={logo} iconClass={'logo'} />
          </a>
          <button ref={elCollapseButton} className="navbar-toggler" type="button">
            <span className="navbar-toggler-icon"><img src={hamburger} alt="Hamburger Icon" /></span>
          </button>
          <div className="collapse navbar-collapse navbar-nav-container">
            <ul className="navbar-nav navbar-nav-main spriteTabs">
              <li ref={menuRefs.homeLi} className="nav-item">
                <NavLink to="/" className="nav-link no-underline" onClick={closeSidebar}>Home<span /></NavLink>
              </li>
              <li ref={menuRefs.albumsLi} className="nav-item">
                <NavLink to="/albums" className="nav-link no-underline" onClick={closeSidebar}>Album<span /></NavLink>
              </li>
            </ul>
            <ul className="navbar-nav navbar-nav-right spriteTabs">
              <li className="nav-item">
                <a href="https://www.google.com/maps/place/Statue+of+Liberty/@40.688969,-113.0657959,4z/data=!4m10!1m2!2m1!1sstaue+of+liberty!3m6!1s0x89c25090129c363d:0x40c6a5770d25022b!8m2!3d40.6892494!4d-74.0445004!15sChFzdGF0dWUgb2YgbGliZXJ0eVoTIhFzdGF0dWUgb2YgbGliZXJ0eZIBE2hpc3RvcmljYWxfbGFuZG1hcmvgAQA!16zL20vMDcycDg?entry=ttu" target="_blank" rel="noopener noreferrer" className="nav-link no-underline"><span></span>&nbsp;&nbsp;<i className="fas fa-map-marker-alt"></i><span></span></a>
              </li>
              <li className="nav-item">
                <NavLink to="/user" className="nav-link no-underline"><span></span>&nbsp;<i className="fas fa-user"></i><span></span></NavLink>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
        <div className="sidebar-header">
          <a href="https://www.google.com/maps/place/Statue+of+Liberty/@40.688969,-113.0657959,4z/data=!4m10!1m2!2m1!1sstaue+of+liberty!3m6!1s0x89c25090129c363d:0x40c6a5770d25022b!8m2!3d40.6892494!4d-74.0445004!15sChFzdGF0dWUgb2YgbGliZXJ0eVoTIhFzdGF0dWUgb2YgbGliZXJ0eZIBE2hpc3RvcmljYWxfbGFuZG1hcmvgAQA!16zL20vMDcycDg?entry=ttu" target="_blank" rel="noopener noreferrer" className="nav-link no-underline"><span></span>&nbsp;&nbsp;<i className="fas fa-map-marker-alt"></i><span></span></a>
          <NavLink to="/user" className="nav-link" onClick={closeSidebar}><i className="fas fa-user"></i></NavLink>
        </div>
        <div className="nav-list">
          <ul className="navbar-nav">
            <li ref={menuRefs.homeLi} className="nav-item">
              <NavLink to="/" className="nav-link" onClick={closeSidebar}>Home</NavLink>
            </li>
            <li ref={menuRefs.albumsLi} className="nav-item">
              <NavLink to="/albums" className="nav-link" onClick={closeSidebar}>Album</NavLink>
            </li>
          </ul>
        </div>
      </div>

      <div id="main-content" className="content">
        {props.children}
      </div>

      <footer className="bg-light text-center text-lg-start" style={{ background: todaysFooterCss, height: '81px', margin: '0' }}>
        <div className="text-center p-3">
          © 2024 - React Starter Kit. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Frame;
