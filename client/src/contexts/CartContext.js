import { createContext, useReducer, useContext, useEffect } from 'react'
import axios from '../utils/axios'

const CartContext = createContext();

export const useCartContext = () => {
    return useContext(CartContext)
}

function productsReducer(state, action){
    switch(action.type){
        case 'FETCH_CART':
            return { 
                loading: false,  
                data: { 
                    count: action.payload.reduce((total, product) => total += product.quantity, 0), 
                    products: action.payload,
                    totalAmount: action.payload.reduce((totalPrice, product) => totalPrice += product.quantity * product.price , 0)
                },
                error: null
            }
        case 'ERROR':
            return { ...state, error: action.payload }
        case 'ADD':
            return { 
                ...state,  
                data: { 
                    count: state.data.count + 1,
                    products: [action.payload , ...state.data.products],
                    totalAmount: state.data.totalAmount + action.payload.price
                }
            }
        case 'DELETE':
            const deletedProduct = state.data.products.find(product => product.id === action.payload);
            const quantity = deletedProduct.quantity;
            const price = quantity * deletedProduct.price;
            
            return {
                ...state,
                data: {
                    count: state.data.count - quantity,
                    products: state.data.products.filter(product => product.id !== action.payload),
                    totalAmount: state.data.totalAmount - price
                }
            }
        case 'INCREASE':
            const updateProductIncrease = state.data.products.find(product => product.id === action.payload);

            return {
                ...state,
                data: {
                    count: state.data.count + 1,
                    products: state.data.products.map(product => product.id === action.payload ? { ...product, quantity: product.quantity + 1 } : product),
                    totalAmount: state.data.totalAmount + updateProductIncrease.price
                }
            }
        case 'DECREASE':
            const updateProductDecrease = state.data.products.find(product => product.id === action.payload);

            return {
                ...state,
                data: {
                    count: state.data.count - 1,
                    products: state.data.products.map(product => product.id === action.payload ? { ...product, quantity: product.quantity - 1 } : product),
                    totalAmount: state.data.totalAmount - updateProductDecrease.price
                }
            }
        default:
            return state
    }
}

const CartContextProvider = ({ children }) => {
    const [cart, dispatch] = useReducer(productsReducer, {
        loading: true,
        data: { count: 0, products: [], totalAmount: 0 },
        error: null
    });

    useEffect(() => {
        axios.get('/cart')
            .then(res => dispatch({ type: 'FETCH_CART', payload: res.data }))
            .catch(err => dispatch({ type: 'ERROR', payload: err }))
    }, [dispatch])

    return (
        <CartContext.Provider value={{ cart, dispatch }}>
            { children }
        </CartContext.Provider>
    )
}

export default CartContextProvider
