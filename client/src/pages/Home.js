import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; 
import axios from '../utils/axios'
import { useCartContext } from './../contexts/CartContext'

function Home() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    const { dispatch } = useCartContext();

    useEffect(() => {
        setLoading(true);
        axios.get('/products')
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                console.log(err.message);
            })
    }, [])

    const addToCart = ({ id, title, price, image }) => {
        const newCartProduct = { id: uuidv4(), productId: id, title, price, image, quantity: 1 };

        axios.post('http://localhost:3004/cart', newCartProduct)
            .then(res => {
                dispatch({ type: 'ADD', payload: newCartProduct });
            })
            .catch(err => console.log(err.message))
    }

    if(loading){
        return <p className="text-center text-3xl mt-4">Loading...</p>
    }

    return (
        <div className="mx-auto p-6 grid grid-cols-3 gap-5">
            {products.map(product => (
                <article key={product.id} className="border bg-white p-4 rounded text-gray-800">
                    <img src={product.image} alt={product.title} className="h-36 mx-auto" />
                    <h2 className="mt-4 truncate">{product.title}</h2>
                    <div className="flex justify-between items-center mt-2 text-sm">
                        <p>₹{product.price}</p>
                        <button  
                            className="text-xs bg-blue-400 text-white py-1 px-2 rounded"
                            onClick={() => addToCart(product)}
                        >
                            Add to Cart
                        </button>
                    </div>
                </article>
            ))}
        </div>
    )
}

export default Home
