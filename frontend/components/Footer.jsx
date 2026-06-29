import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <img src="/images/logo.png" alt="Mountain Breeze Villa" className="footer-logo-img" />
          <p>Eco-friendly luxury in the heart of Ella, Sri Lanka</p>
        </div>
        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#rooms">Rooms</a>
          <a href="#activities">Activities</a>
          <a href="#contact">Contact</a>
        </div>
        <p className="footer-copy">
          © {year} Mountain Breeze Villa. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
