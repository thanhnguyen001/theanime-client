
import { useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import RouterLinks from './routes';
import ScrollToTop from './ScrollToTop';


function App() {
  let viewMode = useSelector(state => state.viewMode);
  if (JSON.parse(localStorage.getItem('viewMode'))) viewMode = JSON.parse(localStorage.getItem('viewMode'));

  return (
    <Router>
      <div className="App" style={{ backgroundColor: `${viewMode.bgColor}` }}>
        <ScrollToTop>
          <Header />
          <div className="content">
            <div className="content-wrap">
              <RouterLinks />
            </div>
          </div>
          <Footer textColor={viewMode.textColor} />
        </ScrollToTop>
      </div>
    </Router>
  );
}

export default App;