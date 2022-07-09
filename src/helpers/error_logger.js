module.exports = (turboTrace, err) => {
    console.log(`
        \n${turboTrace} ${err.name}
        \n${err.message}
        \n${err.stack}
        \n /* ---------- */
    `);
};
