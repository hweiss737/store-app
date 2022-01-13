import Product from '../../models/product';

import { DELETE_PRODUCT, CREATE_PRODUCT, UPDATE_PRODUCT, SET_PRODUCTS } from '../actions/products';

const initialState = {
    availableProducts: [],
    userProducts: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_PRODUCTS:
            return {
                ...state,
                availableProducts: action.products,
                userProducts: action.userProducts
            }
        case DELETE_PRODUCT: 
            return {
                ...state,
                availableProducts: state.availableProducts.filter(product => product.id !== action.productId),
                userProducts: state.userProducts.filter(product => product.id !== action.productId)
            };
        case CREATE_PRODUCT:
            const newProduct = new Product(
                action.productData.id,
                action.productData.ownerId, 
                action.productData.title, 
                action.productData.imageUrl, 
                action.productData.description, 
                action.productData.price
            );
            return {
                ...state,
                availableProducts: state.availableProducts.concat(newProduct),
                userProducts: state.userProducts.concat(newProduct)
            }
        case UPDATE_PRODUCT:
            const userProductIndex = state.userProducts.findIndex(product => product.id === action.productData.id);
            const availableProductIndex = state.availableProducts.findIndex(product => product.id === action.productData.id);
            const updatedProduct = new Product(
                action.productData.id, 
                state.userProducts[userProductIndex].ownerId, 
                action.productData.title, 
                action.productData.imageUrl, 
                action.productData.description, 
                state.userProducts[userProductIndex].price
            );
            const updatedAvailableProducts = [...state.availableProducts];
            updatedAvailableProducts[availableProductIndex] = updatedProduct;
            const updatedUserProducts = [...state.userProducts];
            updatedUserProducts[userProductIndex] = updatedProduct;
            return {
                ...state,
                availableProducts: updatedAvailableProducts,
                userProducts: updatedUserProducts
            };
        default:
            return state;
    }
};