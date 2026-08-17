/* 
author: Saul Ramirez Barragan
course: COMP229 - Web Application Development
Date: June 02
Week2 Lab1
*/
import { BrowserRouter as Router } from 'react-router-dom';
import MainRouter from '../MainRouter';
import { AuthProvider } from './auth';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <MainRouter />
      </Router>
    </AuthProvider>
  );
};

export default App;
