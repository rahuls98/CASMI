const errorLogger = (turboTrace, err) => {
    console.log(`\n\n${turboTrace} ${err.name}`);
    console.log(`\n${err.message}`);
    console.log(`\n${err.stack}`);
    console.log(`\n /* ---------- */`);
};

module.exports = errorLogger;
