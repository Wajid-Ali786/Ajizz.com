// Home page component
// frontend/src/pages/customer/HomePage.js
import React from 'react';

const HomePage = () => (
  <section className="hero-section text-center py-5 bg-light">
    <div className="container">
      <h1 className="display-4 animate__animated animate__fadeInDown">Welcome to Ajizz Scents</h1>
      <p className="lead">Discover exclusive fragrances tailored for you.</p>
      <a href="#products" className="btn btn-cta mt-3 animate__animated animate__pulse animate__infinite">Shop Now</a>
    </div>
  </section>
);

export default HomePage;
