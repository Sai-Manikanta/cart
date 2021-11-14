import axios from "axios";
import { useHistory } from 'react-router-dom'
import CartItem from "../components/CartItem";
import { useCartContext } from '../contexts/CartContext';

function Cart() {
    const { cart } = useCartContext();
    const history = useHistory();

    if(cart.loading) {
        return <p className="text-center text-2xl mt-8">Loading...</p>
    }

    // (cartProducts Array) -> all cart products
     // (cartProducts loop for each) -> loop through cart products
      // (request) -> get product in prodcuts collection -> we need original quantity, (original quantity - cart quantity = available quantity)
       // (request) -> update product quantity: product.quantity - cartProduct.quantity
        // (request) -> delete product from cart 
         //  (request) -> create product related to user in orders collection

    const checkOut = (cartProducts) => {
        const cartProductsCount = cartProducts.length;
        let iterateCount = 0;

        cartProducts.forEach(cartProduct => {
            // get product in prodcuts collection -> we need original quantity, (original quantity - cart quantity = available quantity)
            axios.get(`http://localhost:3004/products/${cartProduct.productId}`)
                .then(({ data: product }) => {
                    // now we have product, we have original quantity
                    // update product quantity: product.quantity - cartProduct.quantity
                    axios.patch(`http://localhost:3004/products/${cartProduct.productId}`, {
                        quantity: product.quantity - cartProduct.quantity
                    })
                        .then(res => {
                            // delete product from cart 
                            axios.delete(`http://localhost:3004/cart/${cartProduct.id}`)
                                .then(res => {
                                    // after deleting cart product in above we create that product in orders collection
                                    axios.post('http://localhost:3004/orders', {
                                        userId: 'userId here',
                                        ...cartProduct,
                                    })
                                    .then(res => {
                                        iterateCount++;

                                        if(iterateCount === cartProductsCount){
                                            history.replace('/payment-success');
                                        }
                                    })
                                    .catch(err => console.log(err.message))
                                })
                                .catch(err => console.log(err.message))
                        })
                        .catch(err => console.log(err.message))
                })
                .catch(err => console.log(err.message))
        });
    }

    return (
        <section className="max-w-2xl mx-auto py-16 px-4">
            <p className="text-3xl text-center mb-6 font-bold text-gray-800 tracking-wider">
                Your Bag
            </p>
            
            {cart.data.products.length === 0 ? (
                <p className="text-center text-2xl">is currently empty</p>
            ) : (
                <>
                    {cart.data.products.map(product => <CartItem key={product.id} {...product} /> )}
                    <div className="flex justify-between items-center border-t-2 py-3 border-blue-400">
                        <span>Total</span>
                        <span>₹{Math.ceil(cart.data.totalAmount)}</span>
                        <button onClick={() => checkOut(cart.data.products)} className="bg-green-500 text-white px-2 py-1 rounded-sm">
                            Check out
                        </button>
                    </div>
                </>
            )}
        </section>
    )
}

export default Cart
