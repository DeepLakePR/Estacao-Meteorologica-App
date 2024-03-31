import { StyleSheet } from 'react-native';

const PrevisionStyle = StyleSheet.create({

    ////////////////////////
    // Main Container
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#e3e3e3',
        paddingTop: 15,
    },

    // Prevision Header
    previsionHeader: {
        padding: 10,
        position: 'relative',
        alignItems: 'center',
        width: '100%',
    },

    // Back To Home Button
    backToHomeButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        padding: 12,
    },

    // Prevision Title
    previsionTitle: {
        fontSize: 21,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    // Prevision Table
    previsionTableWrapper:{
        width: '95%', 
        minHeight: '20%', 
        maxHeight: '55%', 
        marginTop: 20, 
        padding: 6,
        paddingTop: 12,
        paddingBottom: 12,
        overflow: 'scroll',
        backgroundColor: '#383838', 
        borderRadius: 5,

        // Android Shadow
        elevation: 5,

        // IOs Shadow
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },

    previsionTableScrollView:{
        width: '95%', 
        height: 'auto', 
        backgroundColor: '#525252', 
        borderRadius: 5,
    },

    previsionTableHead: {
        alignContent: "center",
        justifyContent: 'center',
        backgroundColor: '#454545',
    },

    previsionTableText: {
        margin: 7,
        color: 'white'
    },

    // Generate Buttons Wrapper
    generateButtonsWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0
    },

    createAnotationButton: {
        width: '70%',
        backgroundColor: '#2da2cc',
        padding: 8,
        marginBottom: 30,
    },

    generateButtonsTitle: {
        fontSize: 18,
        marginBottom: 15
    },

    // Buttons
    generateButtonsView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 30,
        paddingLeft: 10,
        paddingRight: 10,
    },

    generateButton: {
        padding: 6,
        width: '30%',
        backgroundColor: '#252525',
        color: 'white',
        borderRadius: 5
    },

    generateButtonText: {
        color: 'white',
        textAlign: 'center'
    },

    ////////////////////////
    // Modal Create Anotation
    modalCreateAnotationContainer:{
        backgroundColor: 'rgba(0,0,0,0.3)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalCreateAnotationView:{
        width: '95%',
        padding: 4,
        paddingTop: 30,
        paddingBottom: 30,
        borderRadius: 6,
        backgroundColor: 'white',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalCreateAnotationCloseButton:{
        position: 'absolute',
        top: 0,
        right: 5,
        padding: 10
    },

    modalCreateAnotationTitle:{
        fontSize: 21,
        textAlign: 'center',
    },

    modalCreateAnotationText:{
        fontSize: 19,
        textAlign: 'center',
    },

    // Modal Inputs Wrapper 
    modalCreateAnotationInputsWrapper:{
        marginTop: 20,
        marginBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row'
    },

    modalCreateAnotationInput:{
        width: '42.5%',
        height: 36,
        backgroundColor: '#e8e8e8',
        color: 'black',
        textAlign: 'center',
        padding: 9,
        fontSize: 16,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 8,
        marginRight: 8,
        borderRadius: 4,
    },

    // Modal Create Anotation Submit Button
    modalCreateAnotationSubmit:{
        width: '60%',
        padding: 8,
        textAlign: 'center',
        backgroundColor: '#e3e3e3',
        borderRadius: 4,
    },

    // Loading View
    previsionLoadingView:{
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        width: '100%',
        height: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
    },

    previsionLoadingIcon:{
        zIndex: 999,
    }

});

export default PrevisionStyle;
