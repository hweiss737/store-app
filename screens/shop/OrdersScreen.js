import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Platform, Text, View, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch  } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as orderActions from '../../store/actions/orders';
import Colors from '../../constants/Colors';

const OrdersScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();

    const loadOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await dispatch(orderActions.fetchOrders());
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        loadOrders();
    }, [dispatch, loadOrders]);

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>An error occurred.</Text>
                <Button title='Try Again' onPress={loadOrders} color={Colors.primary} />
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary}/>
            </View>
        );
    }

    if (!isLoading && orders.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No orders found.</Text>
            </View>
        );
    }

    return (
        <FlatList 
            data={orders}
            renderItem={itemData => (
                <OrderItem 
                    items={itemData.item.items}
                    amount={itemData.item.totalAmount}
                    date={itemData.item.readableDate} />
            )} />
    );
};

OrdersScreen.navigationOptions = navigationOptions => {
    return {
        headerTitle: 'Your Orders',
        headerLeft: (() => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item 
                    title='Menu' 
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {navigationOptions.navigation.toggleDrawer()}} />
            </HeaderButtons>
        )),
    };
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default OrdersScreen;