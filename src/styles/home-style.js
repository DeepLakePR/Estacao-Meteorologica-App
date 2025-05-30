import { StyleSheet } from 'react-native';

const HomeStyle = StyleSheet.create({

    ////////////////////////
    // Main Container
    mainContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
        backgroundColor: '#DCE8FF',
    },

    // Background Image
    homeBackgroundImage: {
        position: 'absolute',
        bottom: 0,
        objectFit: 'cover',
        flex: 1,
        width: '100%',
        height: '100%',
        opacity: 0.8
    },

    header: {
        width: '100%',
        height: 50,
        paddingLeft: 15,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: '#3B6BA5',
    },

    headerText: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    },

    ////////////////////////
    // Wrapper
    homeWrapper: {
        paddingBottom: 50,
        width: '100%',
        height: '100%',
    },

    homeWrapperHeader:{
        position: 'relative',
        width: '100%',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    homeWrapperTitle:{
        fontSize: 18,
        margin: 16,
        color: 'white',
        fontWeight: 500
    },

    ////////////////////////
    // Previsions List
    homePrevisionsList: {
        width: '100%',
        height: '100%',
        paddingTop: 16,
    },

    ////////////////////////
    // Prevision Single Box
    homePrevisionBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: '90%',
        marginBottom: 16,
        padding: 12,
        borderRadius: 6,
        backgroundColor: '#DCE8FF',
        position: 'relative',

        // Android Shadow
        elevation: 3,

        // IOs Shadow
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,

    },

    homePrevisionBoxCollapseBody: {
        paddingBottom: 12,
        paddingLeft: 12, 
        paddingRight: 12, 
        flexGrow: 0, 
        flexShrink: 1
    },

    homePrevisionBoxIcon: {
        marginRight: 16,
        width: 34,
        height: 34,
    },

    homePrevisionBoxTitle: {
        fontSize: 16,
    },

    homePrevisionBoxButton: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        position: 'absolute',
        right: 8,
    },

    ////////////////////////
    // Create Prevision Button
    homeCreatePrevisionButton: {
        position: 'absolute',
        right: 12,
        transform: [{ translateX: parseFloat('-12%') }],
        backgroundColor: '#3B6BA5',
        padding: 6,
        borderRadius: 8,

        // Android Shadow
        elevation: 4,

        // IOs Shadow
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },

    ////////////////////////
    // Modal Create Prevision
    modalCreatePrevisionContainer: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalCreatePrevisionView: {
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

    modalCreatePrevisionCloseButton: {
        position: 'absolute',
        top: 0,
        right: 5,
        padding: 10
    },

    modalCreatePrevisionTitle: {
        fontSize: 21,
        textAlign: 'center',
    },

    modalCreatePrevisionText: {
        fontSize: 19,
        textAlign: 'center',
    },

    modalCreatePrevisionInput: {
        width: '80%',
        borderRadius: 4,
        padding: 8,
        fontSize: 16,
        backgroundColor: '#e8e8e8',
        marginTop: 15,
        marginBottom: 30,
        textAlign: 'center',
    },

    modalCreatePrevisionSubmit: {
        width: '60%',
        padding: 8,
        textAlign: 'center',
        backgroundColor: '#38BDF8',
        borderRadius: 4,
    },

});

export default HomeStyle;
