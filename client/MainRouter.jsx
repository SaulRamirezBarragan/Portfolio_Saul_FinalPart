/* 
author: Saul Ramirez Barragan
course: COMP229 - Web Application Development
Date: June 02
Week2 Lab1
*/
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import About from './src/about'
import Contact from './src/contact'
import Education from './src/education'
import Project from './src/project'
import Services from './src/services'
import Layout from './components/Layout'
import Login from './src/Login'
import Signup from './src/Signup'
import Admin from './src/Admin'

const MainRouter = () => {
    return (
        <Layout>
            <main className="page-content">
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/about" element={<About />} />
                    <Route exact path="/education" element={<Education />} />
                    <Route exact path="/project" element={<Project />} />
                    <Route exact path="/contact" element={<Contact />} />
                    <Route exact path="/services" element={<Services />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </main>
        </Layout>
    )
}
export default MainRouter
