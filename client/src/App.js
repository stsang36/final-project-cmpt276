import './global.css';
import RoutesManager from './app/routes-manager/RoutesManager';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="app">
      <RoutesManager/>
      <ToastContainer />
    </div>
  );
}

export default App;
