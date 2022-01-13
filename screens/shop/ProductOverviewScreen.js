import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, Text, StyleSheet, Platform, Button, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productActions from '../../store/actions/products';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';

const ProductOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const loadProducts = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(productActions.fetchProducts());
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        setIsLoading(true);
        loadProducts().then(() => {
            setIsLoading(false);
        });
    }, [dispatch, loadProducts]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadProducts);
        return () => {
            willFocusSub.remove();
        };
    }, [loadProducts])

    const onSelectHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {productId: id, title: title});
    };

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>An error occurred.</Text>
                <Button title='Try Again' onPress={loadProducts} color={Colors.primary} />
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

    if (!isLoading && products.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No products found. Manage products in Admin section.</Text>
            </View>
        );
    }

    return (
        <FlatList
            onRefresh={loadProducts}
            refreshing={isRefreshing}
            data={products} 
            renderItem={itemData => <ProductItem 
                title={itemData.item.title} 
                price={itemData.item.price}
                image={itemData.item.imageUrl}
                onSelect={() => onSelectHandler(itemData.item.id, itemData.item.title)}>
                    <Button 
                        color={Colors.primary} 
                        title="View Details" 
                        onPress={() => onSelectHandler(itemData.item.id, itemData.item.title)} />
                    <Button 
                        color={Colors.primary} 
                        title="Add To Cart" 
                        onPress={() => {dispatch(cartActions.addToCart(itemData.item))}} />
                </ProductItem> }
            />
    );
};

ProductOverviewScreen.navigationOptions = navigationOptions => {
    return {
        headerTitle: 'All Products',
        headerLeft: (() => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item 
                    title='Menu' 
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {navigationOptions.navigation.toggleDrawer()}} />
            </HeaderButtons>
        )),
        headerRight: (() => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item 
                    title='Cart' 
                    iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                    onPress={() => {navigationOptions.navigation.navigate('Cart')}} />
            </HeaderButtons>
        ))
    };
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default ProductOverviewScreen;