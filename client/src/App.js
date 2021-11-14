import { Switch, Route } from 'react-router-dom';
import Header from './components/Header';

import Home from './pages/Home';
import Cart from './pages/Cart';

function App() {
    return (
        <>
            <Header />
            <div className="max-w-5xl mx-auto">
                <Switch>
                    <Route path="/" component={Home} exact /> 
                    <Route path="/cart" component={Cart} />
                </Switch>
            </div>
        </>
    )
}

export default App
