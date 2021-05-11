import React, { useState, useEffect } from 'react';

import {
  Switch,
  Link,
  Route,
  useHistory,
  useLocation
} from 'react-router-dom';

import {
  getAllProducts
} from '../api';

import {
  ProductView,
  ProductsView,
  AccountForm,
  Users,
  SingleUser,
  AddUser,
  ProductForm,
  EditProduct,
  Admin
} from './';

const App = () => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [singleUser, setSingleUser] = useState({id: null, username: '', isAdmin: false, firstName: '', lastName: '', email: '', address: '', city: '', state: '', zip: null});
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({id: null, name: '', description: '', price: '', image: '', category: ''});

  const history = useHistory();
  const location = useLocation();

  useEffect( () => {

  setToken(localStorage.getItem('token'));

    if (token) {
      const captureToken = async () => {
        const response = await fetch(`/api/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const meData = await response.json();
        setUser(meData);
      }
      captureToken();

    }
  }, [token]);

  const handleLogout = (event) => {
    event.preventDefault();
    setUser({});
    setToken('');
    localStorage.clear();
    history.push('/');
  }

  const getUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'Application/json',
            'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      data.sort((a, b) => (a.id > b.id) ? 1 : -1);
      setUsersList(data);

    } catch (error) {
      console.error(error);
    }
  }

  const getProducts = async () => {
    try {
      const _products = await getAllProducts();
      setProducts(_products);
    } catch (err) {
      console.error(err);
    }
  }

  return (<>

    <nav>
      <Link to="/products">Shop</Link>
      <Link to='/admin' id={user.isAdmin ? '' : 'users-is-not-admin'}>Admin</Link>
      <Link to='/users' id={user.isAdmin ? '' : 'users-is-not-admin'}>Users</Link>
      <Link to="/" id={token ? '' : 'loggedOut-logout'} onClick={handleLogout}>Logout</Link>
      <Link to="/login" id={!token ? '' : 'loggedOut-login'}>Login</Link>
    </nav>
 
      <div>

        <Switch>

          <Route exact path='/admin'> 
            <Admin user={user} token={token} /> 
          </Route>

          <Route exact path ='/products/add'>
            <ProductForm user={user} token={token} getProducts={getProducts} product={product} setProduct={setProduct} />
          </Route>

          <Route exact path='/products/edit/:productId'>
            <EditProduct user={user} token={token} product={product} setProduct={setProduct} getProducts={getProducts} />
          </Route>

          <Route path="/products/:productId">
            <ProductView user={user} token={token} product={product} setProduct={setProduct} getProducts={getProducts} />
          </Route>

          <Route exact path="/products">
            <ProductsView token={token} user={user} products={products} getProducts={getProducts} />
          </Route>

          <Route path ='/login'>
            <AccountForm type={'login'} setToken={setToken} setUser={setUser} />
          </Route>

          <Route path='/register'>
            <AccountForm  type={'register'} setToken={setToken} setUser={setUser} />
          </Route>

          <Route exact path='/users' >
            <Users user={user} setSingleUser={setSingleUser} getUsers={getUsers} usersList={usersList} />
          </Route>

          <Route exact path='/users/add'>
            <AddUser user={user} getUsers={getUsers} />
          </Route>

          <Route exact path='/users/:userId'>
            <SingleUser token={token} user={user} singleUser={singleUser} setSingleUser={setSingleUser} getUsers={getUsers} />
          </Route>

        </Switch>

      </div>
    </>
  );
}

export default App;
