export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cyan: {
                    300: '#33ccff',
                },
                indigo: {
                    900: '#1a237e',
                },
            },
            animation: {
                fadeInUp: "fadeInUp 1s ease-out",
            },
            keyframes: {
                fadeInUp: {
                    "0%": {
                        opacity: 0,
                        transform: "translateY(20px)"
                    },
                    "100%": {
                        opacity: 1,
                        transform: "translateY(0)"
                    },
                },
            },
        },
    },
    plugins: [],
};
