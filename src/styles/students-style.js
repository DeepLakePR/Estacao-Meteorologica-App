import { StyleSheet } from 'react-native';

const StudentsStyle = StyleSheet.create({

    ////////////////////////
    // Main Container
    mainContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
        backgroundColor: '#e3e3e3',
    },

    studentsHeader: {
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
    studentsWrapper: {
        paddingBottom: 50,
        width: '100%',
        height: '100%',
    },

    studentsWrapperHeader:{
        position: 'relative',
        width: '100%',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    ////////////////////////
    // Previsions List
    studentsPrevisionsList: {
        width: '100%',
        height: '100%',
        paddingTop: 16,
    },

    ////////////////////////
    // Prevision Single Box
    studentsPrevisionBox: {
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

    studentsPrevisionBoxCollapseBody: {
        paddingBottom: 12,
        paddingLeft: 12, 
        paddingRight: 12, 
        flexGrow: 0, 
        flexShrink: 1
    },

    studentsPrevisionBoxIcon: {
        marginRight: 16,
        width: 34,
        height: 34,
    },

    studentsPrevisionBoxTitle: {
        fontSize: 16,
    },

    studentsPrevisionBoxButton: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        position: 'absolute',
        right: 8,
    },

    ////////////////////////
    // Create Prevision Button
    studentsCreatePrevisionButton: {
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

});

export default StudentsStyle;
