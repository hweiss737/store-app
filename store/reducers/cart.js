import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import { ADD_ORDER } from '../actions/orders';
import { DELETE_PRODUCT } from '../actions/products';
import CartItem from '../../models/cart-item';

const initialState = {
    items: {},
    totalAmount: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const addedProduct = action.product;
            const price = addedProduct.price;
            const title = addedProduct.title;
            let cartItem;

            if (state.items[addedProduct.id]) {
                cartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    price,
                    title,
                    state.items[addedProduct.id].sum + price
                );
            } else {
                cartItem = new CartItem(1, price, title, price);    
            }
            return {
                ...state,
                items: {
                    ...state.items,
                    [addedProduct.id]: cartItem
                },
                totalAmount: state.totalAmount + price
            };
        case REMOVE_FROM_CART:
            const selectedCartItem = state.items[action.productId];
            let updatedCartItems;
            if (selectedCartItem.quantity > 1) {
                const updatedCartItem = new CartItem(
                    selectedCartItem.quantity - 1,
                    selectedCartItem.productPrice,
                    selectedCartItem.productTitle,
                    selectedCartItem.sum - selectedCartItem.productPrice
                );
                updatedCartItems = {...state.items, [action.productId]: updatedCartItem};
            } else {
                updatedCartItems = {...state.items};
                delete updatedCartItems[action.productId];
            }
            return {
                ...state,
                items: updatedCartItems,
                totalAmount: state.totalAmount - selectedCartItem.productPrice
            }
        case ADD_ORDER:
            return initialState;
        case DELETE_PRODUCT:
            if (!state.items[action.productId]) {
                return state;
            }
            const updatedItems = {...state.items};
            const itemTotal = updatedItems[action.productId].sum;
            delete updatedItems[action.productId];
            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal
            }
    }
    return state;
};