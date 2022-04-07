import { useEffect, useState } from 'react';
import './App.css';
import Home from './components/Home';
import Admin from './components/Admin'

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHome, setIsHome] = useState(true);

  const handleAdmin = () => {
    if (!isAdmin) {
      setIsAdmin(!isAdmin);
      setIsHome(!isHome);
    }
  }

  const handleHome = () => {
    if (!isHome) {
      setIsAdmin(!isAdmin);
      setIsHome(!isHome);
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
    <a className="skip-to-content" href="#main">Skip to content</a>
      <div className="home">
      <header className="primary-header flex">
      <button className="mobile-nav-toggle" aria-controls="primary-navigation" onClick={() => openNav()}><span aria-expanded="false">Menu</span></button>
        <nav>
          <ul id="primary-navigation" data-visible="false" className="primary-navigation underline-indicators flex">
            <li><a className="uppercase ff-sans-cond text-white letter-spacing-2" href="#" onClick={handleHome}>Home</a></li>
            <li><a className="uppercase ff-sans-cond text-white letter-spacing-2" href="#" onClick={handleAdmin}>Admin</a></li>
          </ul>
        </nav>
      </header>
        <main>
          {isHome ? <Home /> : null}
          {isAdmin ? <Admin /> : null}
        </main>
      </div>
    </div>
  );
}

export default App;
