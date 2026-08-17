/* 
author: Saul Ramirez Barragan
course: COMP229 - Web Application Development
Date: June 02
Week2 Lab1
*/
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <section id="home">
            <div className="hero-section">
                <span className="hero-eyebrow">Portfolio</span>
                <h1>Welcome</h1>
                <p>
                    This is my portfolio, here you will find evidence of projects that I've worked on.
                    This is an ongoing project, the design and format of this web page may change in the future.
                </p>
                <h2>Welcome to the final version of my portfolio</h2>
                <p>This project has been really fun to develop, I hope you like the end result!!!</p>
            </div>

            <div className="content-card">
                <h2>Mission</h2>
                <p>
                    My mission is to contribute to the development of innovative hardware and software technologies.
                    I strive to expand my knowledge every day and apply my skills to create high-quality projects.
                </p>
            </div>

            <div className="home-buttons">
                <Link to="/about" className="btn">About Me</Link>
                <Link to="/education" className="btn btn-secondary">Education</Link>
                <Link to="/project" className="btn btn-secondary">Projects</Link>
                <Link to="/services" className="btn btn-secondary">Services</Link>
                <Link to="/contact" className="btn">Contact Me</Link>
            </div>
        </section>
    );
}
