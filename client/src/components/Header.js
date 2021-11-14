import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Link } from 'react-router-dom'
import { useCartContext } from '../contexts/CartContext';

function Header() {
    const { cart: { data: { count } } } = useCartContext();

    return (
        <header className="bg-blue-500 shadow">
            <div className="flex justify-between items-center text-3xl px-6 py-4 text-white max-w-4xl mx-auto">
                <Link to="/">
                    <h1>Cart</h1>
                </Link>
                <div className="relative">
                    <Link to="/cart">
                        <AiOutlineShoppingCart />
                        <span className="w-6 h-6 rounded-full flex justify-center items-center bg-white text-sm text-blue-500 absolute -top-2 -right-3">
                            {count}
                        </span>
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default Header
