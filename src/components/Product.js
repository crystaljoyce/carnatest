import React, { useEffect } from 'react';
import axios from 'axios';
import {
  useParams,
  Link,
  useHistory
} from 'react-router-dom';

import {
  getProductById
} from '../api';

const SmallProduct = ({product}) => {
  const {id,name,price,imageURL} = product;

  return (<>
    <Link to={`/products/${id}`}><img src={imageURL ? imageURL : ""} alt={name}/> </Link> 
    <h1>{name}<br/> ${price}</h1>
    </>
  )
}

const Product = ({product}) => {
  const {name, price, category, description} = product;


    return (<div>
      <div>

        <div>
          <h1>{name}</h1>
          <h2>${price}</h2>
          <h3>{category}</h3>
          <p>{description}</p>
        </div>

      </div>
    </div>
  )
}

const ProductsView = ({token, user, products, getProducts}) => {

  useEffect(() => {
    getProducts();
  },[]);

  return (<>
    <br/>
    {user.isAdmin ? <Link to='/products/add'><button>Add A New Product</button></Link> : ''} <br/>
    <div>
      {products.map(product => (
          <SmallProduct key={id} user={user} key={product.id} product={product} token={token} />
      ))}
    </div>
    </>
  )
}

const ProductView = ({user, token, product, setProduct, getProducts}) => {
  const {productId} = useParams();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const _product = await getProductById(productId);

        setProduct(_product);
      } catch (err) {
        console.error(err);
      }
    }

    getProduct();
  }, [productId]);

  let history = useHistory();
  const goToPreviousPath = () => {
    history.push('/products') }

  const handleDelete = async (id) => {
    if (user.isAdmin) {
      try {
        const response = await axios.delete(`/api/products/${id}`, {
          headers: {
            'Content-Type': 'Application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const {data} = await response;
        setProduct(data);
        getProducts();
        history.push('/products');
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (<>
    <button onClick={goToPreviousPath} >  Return To Shop</button> <br/> 
    {user.isAdmin ? <Link to={`/products/edit/${product.id}`}><button >Edit Product</button></Link> : ''} <br/>
    {user.isAdmin ? <button onClick={() => handleDelete(product.id)} >Delete Product</button> : ''}
    
    <Product user={user} product={product} token={token} key={product.id}  />
    </>
  )
}

export {SmallProduct,Product,ProductsView,ProductView};
