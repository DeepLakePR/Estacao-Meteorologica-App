import { StyleSheet } from 'react-native';

const HomeStyle = StyleSheet.create({

    mainContainer:{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#e3e3e3',
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
    },

    homeExcelGeneratorView:{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.8,
    },

    homeInput:{
        width: 250,
        height: 36,
        backgroundColor: 'white',
        color: 'black',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 10,
        marginBottom: 8,
        borderRadius: 4,
    },

    homeGenerateExcel:{
        width: 200,
        height: 38,
        backgroundColor: '#262626',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    }

});

export default HomeStyle;
