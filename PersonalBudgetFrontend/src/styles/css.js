import theme from './theme.js';

const css = {
    // 🌐 Layout
    appWrapper: {
        backgroundColor: theme.colors.background,
        minHeight: '100vh',
    },
    mainCard: {
        backgroundColor: theme.colors.background,
        padding: '1rem',
        borderRadius: '0.5rem',
    },

    // 🧭 Navbar
    navbar: {
        backgroundColor: theme.colors.primary,
        color: '#fff',
        fontFamily: theme.font.family,
    },

    // 📋 Form
    formWrapper: {
        backgroundColor: theme.colors.background,
        padding: theme.spacing.padding,
        borderRadius: '8px',
        fontFamily: theme.font.family,
        maxWidth: '800px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    formTitle: {
        color: theme.colors.primary,
        textAlign: 'center',
        marginBottom: '1.5rem',
    },
    formSubtitle: {
        textAlign: 'center',
        marginBottom: '1.5rem',
    },
    formGroup: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: theme.spacing.gap,
        marginBottom: theme.spacing.margin,
    },
    formField: {
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing.sm,
        marginBottom: theme.spacing.margin,
    },
    formLabel: {
        textAlign: 'center',
        fontWeight: '500',
        color: theme.colors.text,
        marginBottom: '0.4rem',
    },
    formInput: {
        padding: '0.4rem 0.6rem',
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '6px',
        fontSize: theme.font.size,
        textAlign: 'center',
        backgroundColor: '#fff',
        appearance: 'none',
    },
    formSelect: {
        padding: '0.6rem',
        fontSize: '1rem',
        borderRadius: '6px',
        border: `1px solid ${theme.colors.border}`,
        width: '200px',
        marginTop: '0.3rem',
    },
    formButton: {
        backgroundColor: theme.colors.primary,
        color: '#fff',
        padding: theme.spacing.sm,
        border: 'none',
        borderRadius: '6px',
        fontSize: theme.font.size,
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        minWidth: '160px',
        marginTop: theme.spacing.margin,
    },

    // 📊 Table
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#fff',
        boxShadow: theme.shadow.light,
    },
    tableHeader: {
        backgroundColor: theme.colors.primary,
        color: '#fff',
    },
    tableCell: {
        padding: '0.75rem',
        border: `1px solid ${theme.colors.border}`,
        textAlign: 'center',
    },
    deleteButton: {
        backgroundColor: theme.colors.danger,
        color: '#fff',
        border: 'none',
        padding: '0.4rem 0.8rem',
        borderRadius: '4px',
        cursor: 'pointer',
    },

    // 📈 Charts
    chartsWrapper: {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: theme.colors.background,
        fontFamily: theme.font.family,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    chartsTitle: {
        marginBottom: '1.5rem',
        color: theme.colors.primary,
        textAlign: 'center',
    },

    // 💰 Highlighted Values
    highlightBox: {
        backgroundColor: '#fff',
        fontFamily: theme.font.family,
        padding: '1rem',
        marginBottom: '1rem',
        textAlign: 'center',
        borderRadius: '0.25rem',
        boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)',
    },
    highlightTitle: {
        fontWeight: 'bold',
        marginBottom: '1rem',
    },
    highlightValue: {
        fontSize: '3rem',
        fontWeight: 'bold',
    },

    // 🧮 Filters
    filterGroup: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '2rem',
        marginBottom: '2rem',
    },
    filterField: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    filterLabel: {
        fontWeight: 'bold',
        marginBottom: '0.2rem',
        fontSize: '1rem',
        textAlign: 'center',
    },

    // 🧾 Empty State
    emptyMessage: {
        textAlign: 'center',
        marginTop: '1rem',
    },

    // 📂 Categories
    categoriesWrapper: {
        padding: '2rem',
        fontFamily: theme.font.family,
        backgroundColor: theme.colors.background,
    },
    categoriesTitle: {
        textAlign: 'center',
        color: theme.colors.primary,
        marginBottom: '1.5rem',
        fontSize: '1.5rem',
    },

    // 🔐 Modal
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1050,
    },
    modalBox: {
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)',
        width: '100%',
        maxWidth: '400px',
        fontFamily: theme.font.family,
    },
    modalTitle: {
        color: theme.colors.primary,
        textAlign: 'center',
        marginBottom: '1.5rem',
        fontSize: '1.25rem',
        fontWeight: 'bold',
    },

    // 📊 Ratio Box
    ratioBox: {
        backgroundColor: '#fff',
        fontFamily: theme.font.family,
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    ratioTitle: {
        fontWeight: 'bold',
        marginBottom: '1rem',
    },
    ratioValue: {
        fontSize: '3rem',
        fontWeight: 'bold',
    },
};

export default css;
