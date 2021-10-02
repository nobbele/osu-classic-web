module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            backgroundImage: (_theme) => ({
                'hero-image': "url('/bg.jpg')"
            })
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}