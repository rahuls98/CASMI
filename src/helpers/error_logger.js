const errorLogger = (turboTrace, err) => {
    console.log(`
        \n${turboTrace} ${err.name}
        \n${err.message}
        \n${err.stack}
        \n /* ---------- */
    `);
};

module.exports = errorLogger;
