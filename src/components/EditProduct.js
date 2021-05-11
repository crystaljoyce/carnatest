import React from 'react';
import {Redirect, useHistory} from 'react-router-dom';

const EditProduct = ({user, token, product, setProduct, getProducts}) => {
    const {id, name, description, price, category, imageURL} = product;

    const history = useHistory();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response  = await fetch(`/api/products/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'Application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(product)
        })
        const data = await response.json();
        getProducts();
        history.push(`/products/${id}`);
    }

    const handleOnChange = async (event) => {
        if (event.target.name === 'price') {
            setProduct({...product, [event.target.name]: Number(event.target.value)});
        } else {
            setProduct({...product, [event.target.name]: event.target.value});
        }
    }

    if (user.isAdmin) {
        return (<div >
            <h3>Edit Product</h3>
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
                    <div>Image URL</div>
                    <input type='text' name='imageURL' value={imageURL} onChange={handleOnChange}></input>
                </div>
                <button type='submit' >Update Product</button>
            </form>
        </div>)
    } else {
        return <Redirect to='/' />
    }
}

export default EditProduct;