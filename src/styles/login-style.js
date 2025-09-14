import { StyleSheet } from 'react-native';

const LoginStyle = StyleSheet.create({

    mainContainer:{
        flex: 1,
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
        color: "#003366"
    },

    loginInput:{
        width: 250,
        height: 36,
        paddingTop: 6,
        paddingBottom: 6,
        borderRadius: 5,
        backgroundColor: '#B3D1FF',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 5,
        marginBottom: 5,
        color: '#002B5B'
    },
    
    loginSubmitButton:{
        width: 125,
        height: 38,
        backgroundColor: '#0066CC',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },

    loginLoadingView:{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        width: '100%',
        height: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
    },

    loginLoadingIcon:{
        zIndex: 99999,
    }

});

export default LoginStyle;
