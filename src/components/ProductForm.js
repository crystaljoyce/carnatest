import React, {useState, useEffect} from 'react';
import {Redirect, useLocation} from 'react-router-dom';

const ProductForm = ({user, token, getProducts, product, setProduct}) => {
    const {name, price, category, description, imageURL} = product;
    const [addMessage, setAddMessage] = useState('');

    const location = useLocation();
    useEffect( () => {
        if (location.pathname === '/products/add') {
            setProduct({id: null, name: '', description: '', price: '', imageURL: '', category: ''})
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(product)
        })
        const data = await response.json();
        setProduct(data);
        setAddMessage(data ? 'Product has been added' : '');
        setProduct({id: null, name: '', description: '', price: '', imageURL: '', category: ''})
        getProducts();
    }

    const handleOnChange = async (event) => {
            setProduct({...product, [event.target.name]: event.target.value});
        }
    

    if (user.isAdmin) {
        return (<div>
            <h2>Add Product</h2>
            {addMessage}
            <form onSubmit={handleSubmit}>
                <div>
                    <div>Name</div>
                    <input required type='text' name='name' value={name} onChange={handleOnChange}></input>
                </div>
                <div>
                    <div>Description</div>
                    <textarea required type='text' name='description' value={description} onChange={handleOnChange}></textarea>
                </div>
                <div>
                    <div>Price</div>
                    <input required type='number' name='price' value={price} onChange={handleOnChange}></input>
                </div>
                <div>
                    <div>Category</div>
                    <input required type='text' name='category' value={category} onChange={handleOnChange}></input>
                </div>
                <div>
                    <div>Image</div>
                    <input type='text' name='imageURL' value={imageURL} onChange={handleOnChange}></input>
                </div>
                <button type='submit'>Add Product</button>
            </form>
        </div>)
    } else {
        return <Redirect to='/' />
    }
}

export default ProductForm;