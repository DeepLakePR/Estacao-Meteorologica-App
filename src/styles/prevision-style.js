import { StyleSheet } from 'react-native';

const PrevisionStyle = StyleSheet.create({

    ////////////////////////
    // Main Container
    mainContainer: {
        flex: 1,
        backgroundColor: '#DCE8FF',
    },

    // Prevision Header
    header: {
        padding: 10,
        marginBottom: 15,
        position: 'relative',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#3B6BA5'
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
        color: 'white',
        fontSize: 21,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    // Prevision Table
    previsionTableWrapper:{
        width: '95%', 
        minHeight: 250, 
        maxHeight: 500, 
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

    ////////////////////////
    // Prevision Monthly Average
    previsionMonthlyAverage:{
        padding: 20,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 20,
        marginBottom: 10,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },

    previsionMonthlyAverageTitle:{
        fontSize: 22,
        marginBottom: 7,
        width: '100%',
        textAlign: 'center'
    },

    previsionMonthlyAverageText:{
        width: '50%',
        fontSize: 16,
        textAlign: 'left',
        marginTop: 10,
        marginBottom: 10,
        paddingBottom: 3,
        borderBottomColor: 'black',
        borderBottomWidth: 1
    },

    previsionMonthlyAverageTextBold: {
        fontWeight: '900'
    },

    ////////////////////////
    // Buttons Wrapper
    buttonsWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    createAnotationButton: {
        width: '70%',
        backgroundColor: '#38BDF8',
        padding: 8,
        marginBottom: 30,
    },

    buttonsGenerateTitle: {
        fontSize: 18,
        marginBottom: 15
    },

    // Buttons Generate
    buttonsGenerate: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 50,
        paddingLeft: 10,
        paddingRight: 10,
    },

    buttonPrevision: {
        padding: 6,
        width: '30%',
        backgroundColor: '#3B6BA5',
        color: 'white',
        borderRadius: 5
    },

    buttonPrevisionText: {
        color: 'white',
        textAlign: 'center'
    },

    ////////////////////////
    // Modal Anotation
    modalAnotationContainer:{
        backgroundColor: 'rgba(0,0,0,0.3)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalAnotationView:{
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

    modalAnotationCloseButton:{
        position: 'absolute',
        top: 0,
        right: 5,
        padding: 10
    },

    modalAnotationTitle:{
        fontSize: 21,
        textAlign: 'center',
    },

    modalAnotationText:{
        fontSize: 19,
        textAlign: 'center',
    },

    // Modal Inputs Wrapper 
    modalAnotationInputsWrapper:{
        marginTop: 20,
        marginBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row'
    },

    modalAnotationInput:{
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

    // Modal Anotation Submit Button
    modalAnotationSubmit:{
        width: '60%',
        padding: 8,
        textAlign: 'center',
        backgroundColor: '#38BDF8',
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
