// styles/formStyles.js

const formStyles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center',
        marginBottom: '2rem',
    },


    fieldGroup: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '200px',
    },

    label: {
        fontWeight: 'bold',
        fontSize: '1rem',
        marginBottom: '0.3rem',
        textAlign: 'center',
    },

    input: {
        padding: '0.6rem',
        fontSize: '1rem',
        borderRadius: '6px',
        border: '1px solid #ccc',
        width: '200px',
        backgroundColor: '#fff',
        color: '#333',
    },

    button: {
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: '#fff',
    },
};

export default formStyles;
