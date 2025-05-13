export const environment = {
    production: false,

    // admob banner
    adsShowBanner: true,
    adsAdId: 'ca-app-pub-7682466066834889/9968280932',
    adsIsTesting: true,

    // counter presets
    presets: {
        'preset#1': {
            name: '🏢 Office Visits',
            defaultIncrement: 1,
        },
        'preset#2': {
            name: '🏃🏻 Weekly Workouts',
            defaultIncrement: 1,
            goal: 3,
        },
        'preset#3': {
            name: '📚 Books read',
            defaultIncrement: 1,
        },
        'preset#4': {
            name: '💧 Glasses of Water',
            defaultIncrement: 1,
            goal: 6,
        },
        'preset#5': {
            name: '⚖️ Weight',
            defaultIncrement: -0.5,
            initialValue: 70,
            goal: 60,
        },
        'preset#6': {
            name: '🚫 Days without Alcohol',
            defaultIncrement: 1,
            initialValue: 0,
            goal: 30,
        },
    },
};
