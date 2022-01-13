import React from 'react';
import { FlatList, Platform, Button, Alert, View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

// Components
import ProductItem from '../../components/shop/ProductItem';
import CustomHeaderButton from '../../components/UI/HeaderButton';

// Constants
import Colors from '../../constants/Colors';
import * as productActions from '../../store/actions/products';

const UserProductsScreen = props => {
    const userProducts = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch();
    
    const onSelectHandler = (id) => {
        props.navigation.navigate('EditProduct', {productId: id});
    };
    const deleteHandler = (id) => {
        Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
            {text: 'No', style: 'default'},
            {text: 'Yes', style: 'destructive', onPress: () => dispatch(productActions.deleteProduct(id))}
        ]);
    };

    if (userProducts.length === 0) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>No products found. Maybe start creating some?</Text>
            </View>
        );
    }

    return (
        <FlatList 
            data={userProducts} 
            renderItem={itemData => (
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => onSelectHandler(itemData.item.id)}>
                        <Button 
                            color={Colors.primary} 
                            title="Edit Details" 
                            onPress={() => onSelectHandler(itemData.item.id)} />
                        <Button 
                            color={Colors.primary} 
                            title="Delete" 
                            onPress={() => deleteHandler(itemData.item.id)} />
                </ProductItem>
            )}/>
    );
};

UserProductsScreen.navigationOptions = navigationOptions => {
    return {
        headerTitle: 'Your Products',
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
                    title='Add' 
                    iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                    onPress={() => {navigationOptions.navigation.navigate('EditProduct')}} />
            </HeaderButtons>
        ))
    };
};

export default UserProductsScreen;