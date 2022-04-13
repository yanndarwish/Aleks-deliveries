import { useEffect, useState } from 'react';
import './App.css';
import Home from './components/Home';
import Admin from './components/Admin'
import Clients from './components/Clients'

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHome, setIsHome] = useState(true);
  const [isClients,setIsClients] = useState(false);

  const handleAdmin = () => {
    if (!isAdmin) {
      setIsAdmin(!isAdmin);
      setIsHome(false);
      setIsClients(false)
    }
  }

  const handleHome = () => {
    if (!isHome) {
      setIsAdmin(false);
      setIsHome(!isHome);
      setIsClients(false)
    }
  }

  const handleClient = () => {
    if (!isClients) {
      setIsClients(!isClients);
      setIsAdmin(false);
      setIsHome(false);
    }
  }

  //set dom is loaded after the dom is loaded


const openNav = () => {
  const nav = document.querySelector('.primary-navigation')
  const navToggle = document.querySelector('.mobile-nav-toggle')
  navToggle.addEventListener('click', () => {
    const visibility = nav.getAttribute("data-visible")
    if (visibility === "false") {
        nav.setAttribute("data-visible", true)
        navToggle.setAttribute("aria-expanded", true)
    } else {
        nav.setAttribute("data-visible", false)
        navToggle.setAttribute("aria-expanded", false)
    }
})
}



  return (
    <div className="App">
      <div className="home flex">
      <header className="">

        <nav className="nav">
          <div className="nav-header flex">
            <div className="img"></div>
          </div>
          <ul id="" data-visible="false" className="menu">
            <li><a className="menu_li flex" href="#" onClick={handleHome}><i className="fas fa-house-user"></i>Accueil</a></li>
            <li><a className="menu_li flex" href="#" onClick={handleAdmin}><i className="fas fa-database"></i>Admin</a></li>
            <li><a className="menu_li flex" href="#" onClick={handleClient}><i className="fas fa-database"></i>Clients</a></li>
          </ul>
        </nav>
      </header>
        <main className="main">
          {isHome ? <Home /> : null}
          {isAdmin ? <Admin /> : null}
          {isClients ? <Clients /> : null}
        </main>
      </div>
    </div>
  );
}

export default App;
