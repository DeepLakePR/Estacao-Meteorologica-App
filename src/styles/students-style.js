import { StyleSheet } from 'react-native';

const StudentsStyle = StyleSheet.create({

    ////////////////////////
    // Main Container
    mainContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
        backgroundColor: '#DCE8FF',
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
    // List Wrapper
    studentsListWrapper: {
        paddingTop: 25,
        width: '100%',
        height: '100%',
    },

    ////////////////////////
    // Students Box Single
    studentsBoxSingle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: '90%',
        marginBottom: 16,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 6,
        backgroundColor: '#5C7FBF',
        position: 'relative',

        // Android Shadow
        elevation: 3,

        // IOs Shadow
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,

    },

    studentsBoxSingleText: {
        fontSize: 16,
        color: 'white',
    },

    studentsBoxSingleButton: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 12,
        paddingRight: 12,
        position: 'absolute',
        right: 8,
    },

    ////////////////////////
    // Create Student Button
    studentsCreateStudentButton: {
        position: 'absolute',
        right: 12,
        transform: [{ translateX: parseFloat('-12%') }],
        backgroundColor: '#668cd1',
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
    // Create & Edit Student Modal
    modalStudentsManagementContainer: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalStudentsManagementView: {
        width: '85%',
        backgroundColor: '#DCE8FF',
        borderRadius: 8,
        padding: 20,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalStudentsManagementExitButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 8,
    },

    modalStudentsManagementTitle: {
        fontSize: 16,
        marginBottom: 12,
    },

    modalStudentsManagementInput: {
        marginBottom: 10,
        width: '90%',
        paddingTop: 6,
        paddingBottom: 6,
        // paddingLeft: 8,
        // paddingRight: 8, 
        textAlign: 'center',
        color: 'white',
        backgroundColor: '#8daae0',
        borderRadius: 6,
        fontSize: 15
    },

    modalStudentsManagementSaveButton: {
        backgroundColor: '#668cd1',
        padding: 6,
        marginTop: 12,
        borderRadius: 8,
        width: '30%',
    },

    // Student Modal -> More Options
    modalStudentsManagementEditOptions: {
        position: 'absolute',
        bottom: 8,
        right: 0,
        padding: 10,
        flexDirection: 'row',
    },

    modalStudentsManagementEditOptionsButton: {
        padding: 8,
    }

});

export default StudentsStyle;
