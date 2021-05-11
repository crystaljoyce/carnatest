import React from 'react';
import {Link} from 'react-router-dom';

const Admin = () => { 

    return <> 
    <div> Welcome to the admin panel </div>
    <Link to='/products/add'><button>Add A New Product</button></Link><br/> 
    <Link to='/users/add'><button>Add A New User</button></Link>
    <div>To edit or delete a specific product or user, please visit the product or user tabs above
         and click on the product or user you would like to modify.</div>
    </> 
}; 

export default Admin; 