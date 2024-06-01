import { StyleSheet } from 'react-native';

const HomeStyle = StyleSheet.create({

    ////////////////////////
    // Main Container
    mainContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e3e3e3',
    },

    // Background Image
    homeBackgroundImage:{
        position: 'absolute',
        bottom: 0,
        objectFit: 'cover',
        flex: 1,
        width: '100%',
        height: '100%',
        opacity: 0.8
    },

    homeHeader:{
        width: '100%',
        height: 50,
        paddingLeft: 15,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: '#262626',
    },

    headerText:{
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    },

    ////////////////////////
    // Wrapper
    homeWrapper:{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },

    ////////////////////////
    // Create Prevision Button
    homeCreatePrevisionButton:{
        position: 'absolute',
        right: 15,
        bottom: 15,
        backgroundColor: '#f7f7f7',
        padding: 6,
        borderRadius: 8,

        // Android Shadow
        elevation: 4,

        // IOs Shadow
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },

    ////////////////////////
    // Previsions List
    homePrevisionsList:{
        width: '100%', 
        height: '100%',
        paddingTop: 20
    },

    ////////////////////////
    // Prevision Single Box
    homePrevisionBox:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: '90%',
        marginBottom: 15,
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
        position: 'relative',

        // Android Shadow
        elevation: 7,

        // IOs Shadow
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },

    homePrevisionBoxIcon:{
        marginRight: 15,
        width: 44,
        height: 44,
    },

    homePrevisionBoxTitle:{
        fontSize: 17,
    },

    homePrevisionBoxButton:{
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        position: 'absolute',
        right: 8,
    },

    ////////////////////////
    // Modal Create Prevision
    modalCreatePrevisionContainer:{
        backgroundColor: 'rgba(0,0,0,0.3)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalCreatePrevisionView:{
        width: '80%',
        padding: 15,
        paddingTop: 25,
        paddingBottom: 25,
        borderRadius: 6,
        backgroundColor: 'white',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalCreatePrevisionCloseButton:{
        position: 'absolute',
        top: 0,
        right: 5,
        padding: 10
    },

    modalCreatePrevisionTitle:{
        fontSize: 21,
        textAlign: 'center',
    },

    modalCreatePrevisionText:{
        fontSize: 19,
        textAlign: 'center',
    },

    modalCreatePrevisionInput:{
        width: '80%',
        borderRadius: 4,
        padding: 8,
        fontSize: 16,
        backgroundColor: '#e8e8e8',
        marginTop: 15,
        marginBottom: 30,
        textAlign: 'center',
    },

    modalCreatePrevisionSubmit:{
        width: '60%',
        padding: 8,
        textAlign: 'center',
        backgroundColor: '#e3e3e3',
        borderRadius: 4,
    },

});

export default HomeStyle;
