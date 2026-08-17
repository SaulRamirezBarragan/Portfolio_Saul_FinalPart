/* 
author: Saul Ramirez Barragan
course: COMP229 - Web Application Development
Date: June 02
Week2 Lab1
*/

import Programming from './assets/Programming.jpg';
import Web from './assets/Web_dev.jpg';
import SQL from './assets/SQL.jpg';
import Robotics from './assets/Robotics.jpg';

export default function Services() {
    return (
        <section id="services">
            <div className="page-header">
                <h1>My Services</h1>
            </div>
            <div className="service-list">
                <div className="service-card">
                    <img src={Programming} width="340" height="200" alt="General programming" />
                    <h4>General progamming</h4>
                </div>
                <div className="service-card">
                    <img src={Web} width="340" height="200" alt="Web development" />
                    <h4>Web Development</h4>
                </div>
                <div className="service-card">
                    <img src={SQL} width="340" height="200" alt="SQL databases" />
                    <h4>SQL</h4>
                </div>
                <div className="service-card">
                    <img src={Robotics} width="340" height="200" alt="Robotics" />
                    <h4>Robotics</h4>
                </div>
            </div>
        </section>
    );
}
