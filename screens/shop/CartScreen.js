import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';
import * as cartActions from '../../store/actions/cart';
import * as orderActions from '../../store/actions/orders';
import Cart from '../../components/UI/Card';

const CartScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const total = useSelector(state => state.cart.totalAmount);
    const cartItems = useSelector(state => {
        const transformedCartItems = [];
        for (const key in state.cart.items) {
            transformedCartItems.push({
                productId: key,
                productTitle: state.cart.items[key].productTitle,
                productPrice: state.cart.items[key].productPrice,
                quantity: state.cart.items[key].quantity,
                sum: state.cart.items[key].sum
            });
        }
        return transformedCartItems.sort((a, b) => a.productId > b.productId ? 1 : -1);
    });
    const dispatch = useDispatch();

    const addOrderHandler = async () => {
        setIsLoading(true);
        await dispatch(orderActions.addOrder(cartItems, total));
        setIsLoading(false);
    };

    return(
        <View style={styles.screen}>
            <Cart style={styles.summary}>
                <Text style={styles.summaryText}>Total: 
                    <Text style={styles.summaryTotal}> ${Math.round(total.toFixed(2) * 100) / 100}</Text>
                </Text>
                {isLoading 
                ? <ActivityIndicator size='small' color={Colors.secondary} /> 
                : <Button 
                    color={Colors.secondary} 
                    title='Order Now'
                    onPress={addOrderHandler}
                    disabled={cartItems.length === 0} />
            }
            </Cart>
            <View>
                <FlatList
                    data={cartItems}
                    keyExtractor={item => item.productId}
                    renderItem={itemData => (
                    <CartItem
                        quantity={itemData.item.quantity}
                        title={itemData.item.productTitle}
                        amount={itemData.item.sum}
                        deletable
                        onRemove={() => dispatch(cartActions.removeFromCart(itemData.item.productId))} />
                    )} />
            </View>
        </View>
    );
};

CartScreen.navigationOptions = {
    headerTitle: 'Your Cart'
};


const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    screen: {
        margin: 20,
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10
    },
    summaryText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    summaryTotal: {
        color: Colors.primary
    }
});

export default CartScreen;