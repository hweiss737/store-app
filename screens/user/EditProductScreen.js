import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { StyleSheet, ScrollView, View, Text, Platform, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import CustomHeaderButton from '../../components/UI/HeaderButton';
import * as productActions from '../../store/actions/products';
import CustomInput from '../../components/UI/Input';
import Colors from '../../constants/Colors';

const FORM_UPDATE = 'FORM_UPDATE';

const formReducer = (state, action) => {
    if (action.type === FORM_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            inputValues: updatedValues,
            inputValidities: updatedValidities,
            formIsValid: updatedFormIsValid
        };
    }
    return state;
};

const EditProductScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();
    const productId = props.navigation.getParam('productId');
    const currentProduct = useSelector(state => state.products.userProducts.find(product => product.id === productId));

    const [formState, dispatchFormState] = useReducer(
        formReducer, 
        {
            inputValues: {
                title: currentProduct ? currentProduct.title : '',
                imageUrl: currentProduct ? currentProduct.imageUrl : '',
                price: '',
                description: currentProduct ? currentProduct.description : ''
            },
            inputValidities: {
                title: currentProduct ? true : false,
                imageUrl: currentProduct ? true : false,
                price: currentProduct ? true : false,
                description: currentProduct ? true : false
            },
            formIsValid: currentProduct ? true : false
    });

    useEffect(() => {
        if (error) {
            Alert.alert('An error occurred!', error, [{text: 'Okay'}])
        }
    }, [error]);

    const submitHandler = useCallback(async () => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong input!', 'Please check the errors in the form.', [{text: 'Okay'}])
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
        currentProduct 
            ? await dispatch(productActions.updateProduct(
                productId, 
                formState.inputValues.title, 
                formState.inputValues.description, 
                formState.inputValues.imageUrl
            ))
            : await dispatch(productActions.createProduct(
                formState.inputValues.title, 
                formState.inputValues.description, 
                formState.inputValues.imageUrl, 
                +formState.inputValues.price
            ));
            props.navigation.goBack();
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, productId, formState]);

    useEffect(() => {
        props.navigation.setParams({submit: submitHandler});
    }, [submitHandler]);

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_UPDATE, 
            value: inputValue, 
            isValid: inputValidity,
            input: inputIdentifier
        })
    }, [dispatchFormState]);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary}/>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            style={{flex: 1}}
            behavior='padding' 
            keyboardVerticalOffset={100}>
            <ScrollView>
                <View style={styles.form}>
                    <CustomInput
                        id='title'
                        label='Title'
                        errorText='Please enter a valid title!' 
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        returnKeyType='next'
                        required
                        initialValue={formState.inputValues.title}
                        initiallyValid={formState.inputValidities.title}
                        onInputChange={inputChangeHandler} />
                    <CustomInput
                        id='imageUrl'
                        label='Image URL'
                        errorText='Please enter a valid image URL!'
                        keyboardType='default'
                        returnKeyType='next'
                        required
                        initialValue={formState.inputValues.imageUrl}
                        initiallyValid={formState.inputValidities.imageUrl}
                        onInputChange={inputChangeHandler} />
                    {currentProduct ? null : <CustomInput
                        id='price'
                        label='Price'
                        errorText='Please enter a valid price!'
                        keyboardType='decimal-pad'
                        returnKeyType='next'
                        required
                        min={0.01}
                        initialValue={formState.inputValues.price}
                        initiallyValid={formState.inputValidities.price}
                        onInputChange={inputChangeHandler} />}
                    <CustomInput
                        id='description'
                        label='Description'
                        errorText='Please enter a valid description!'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        multiline
                        numberOfLines={3}
                        required
                        minLength={5}
                        initialValue={formState.inputValues.description}
                        initiallyValid={formState.inputValidities.description}
                        onInputChange={inputChangeHandler} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

EditProductScreen.navigationOptions = navigationOptions => {
    const submitFunction = navigationOptions.navigation.getParam('submit');
    return {
        headerTitle: navigationOptions.navigation.getParam('productId') ? 'Edit Product' : 'Add Product',
        headerRight: (() => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item 
                    title='Save' 
                    iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                    onPress={submitFunction} />
            </HeaderButtons>
        ))
    };
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    form: {
        margin: 20,
    }
});

export default EditProductScreen;