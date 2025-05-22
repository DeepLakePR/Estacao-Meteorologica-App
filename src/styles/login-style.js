import { StyleSheet } from 'react-native';

const LoginStyle = StyleSheet.create({

    mainContainer:{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#DCE8FF',
    },

    loginIcon:{
        marginTop: 60,
        width: 170,
        height: 170,
        marginBottom: 15,
    },

    loginTitle:{
        fontSize: 25,
        fontWeight: 'normal',
        textAlign: 'center',
        marginBottom: 10,
    },

    loginInput:{
        width: 250,
        height: 36,
        borderRadius: 5,
        backgroundColor: 'white',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 5,
        marginBottom: 5
    },
    
    loginSubmitButton:{
        width: 125,
        height: 38,
        backgroundColor: '#262626',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },

    loginLoadingView:{
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        width: '100%',
        height: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    loginLoadingIcon:{
        zIndex: 999,
    }

});

export default LoginStyle;
