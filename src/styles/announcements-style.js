import { StyleSheet } from 'react-native';

const AnnouncementsStyle = StyleSheet.create({

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
    // Create Message
    announcementsCreateMessage:{
        padding: 12,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 16,
    },

    announcementsCreateMessageInput: {
        width: '90%',
        color: 'white',
        fontSize: 16,
        height: 100,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 8,
        marginBottom: 12,
        textAlignVertical: 'top',
        backgroundColor: '#668cd1',

        // Android Shadow
        elevation: 4,

        // IOs Shadow
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    
    announcementsCreateMessageButton: {
        backgroundColor: '#668cd1',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 12,
        paddingRight: 12,
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
    // List Wrapper
    announcementsListWrapper: {
        paddingTop: 15,
        width: '100%',
        height: '100%',
    },

    announcementsListWrapperTitle: {
        fontSize: 16,
        marginBottom: 16,
    },

    ////////////////////////
    // Announcements Box Single
    announcementsBoxSingle: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '85%',
        marginBottom: 16,
        paddingTop: 14,
        paddingBottom: 30,
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

    announcementsBoxSingleHeader:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },

    announcementsBoxSingleHeaderText:{
        color: '#e6e6e6',
    },

    announcementsBoxSingleHeaderDate:{
        color: '#e6e6e6',
    },

    announcementsBoxSingleMessage: {
        fontSize: 17,
        textAlign: 'left',
        width: '100%',
        color: 'white',
    },

    announcementsBoxSingleButton: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 12,
        paddingRight: 12,
        position: 'absolute',
        bottom: 2,
        right: 0,
    },

    ////////////////////////
    // Create & Edit Student Modal
    modalAnnouncementsManagementContainer: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalAnnouncementsManagementView: {
        width: '85%',
        backgroundColor: '#DCE8FF',
        borderRadius: 8,
        padding: 20,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalAnnouncementsManagementExitButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 8,
    },

    modalAnnouncementsManagementTitle: {
        fontSize: 16,
        marginBottom: 12,
    },

    modalAnnouncementsManagementInput: {
        marginBottom: 10,
        width: '90%',
        height: 100,
        paddingTop: 6,
        paddingBottom: 6,
        // paddingLeft: 8,
        // paddingRight: 8, 
        textAlign: 'center',
        textAlignVertical: 'top',
        color: 'white',
        backgroundColor: '#8daae0',
        borderRadius: 6,
        fontSize: 15
    },

    modalAnnouncementsManagementSaveButton: {
        backgroundColor: '#668cd1',
        padding: 6,
        marginTop: 12,
        borderRadius: 8,
        width: '30%',
    },

    modalAnnouncementsManagementDeleteButton: {
        position: 'absolute',
        bottom: 16,
        right: 4,
        padding: 8,
    }

});

export default AnnouncementsStyle;
