/* 
author: Saul Ramirez Barragan
course: COMP229 - Web Application Development
Date: June 02
Week2 Lab1
*/
import { useState } from 'react';
import { api } from './api';

export default function Contact() {
    const [form, setForm] = useState({ firstname: '', lastname: '', email: '', message: '' });
    const [status, setStatus] = useState('');
    const info = async (e) => {
        e.preventDefault();
        setStatus('Sending...');
        try {
            await api('/api/contacts', { method: 'POST', body: JSON.stringify(form) });
            setStatus('Message sent successfully.');
            setForm({ firstname: '', lastname: '', email: '', message: '' });
        } catch (err) {
            setStatus(err.message);
        }
    };

    return (
        <section id="contact">
            <div className="page-header">
                <h1>Contact Me</h1>
                <p>Get in touch — I'd love to hear from you.</p>
            </div>

            <div className="contact-layout">
                <div className="panel">
                    <h2>Saul Ramirez</h2>
                    <p>Number: +1 (647) 779-0494</p>
                    <p>Email: saulramirez@hotmail.com</p>
                    <a href="https://www.linkedin.com/in/sa%C3%BAl-ram%C3%ADrez-barrag%C3%A1n-999b972bb/?locale=en-US" target="_blank" rel="noreferrer">LinkedIn</a>
                </div>

                <form className="contact-form" onSubmit={info}>
                    <label htmlFor="firstname">First Name</label>
                    <input type="text" id="firstname" value={form.firstname} onChange={e => setForm({ ...form, firstname: e.target.value })} placeholder="Enter your name" required />

                    <label htmlFor="lastname">Last Name</label>
                    <input type="text" id="lastname" value={form.lastname} onChange={e => setForm({ ...form, lastname: e.target.value })} placeholder="Enter your last name" required />

                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Enter your email" required />

                    <label htmlFor="message">Message</label>
                    <textarea id="message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows="4" placeholder="Write your message here..." required></textarea>

                    <button type="submit">Send Message</button>
                    {status && <p className={status.includes('successfully') ? 'success' : 'error'}>{status}</p>}
                </form>
            </div>
        </section>
    );
}
