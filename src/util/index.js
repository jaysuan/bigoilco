function padID(id) {
    const strId = id.toString();
    return strId.padStart(12, "0");
}

module.exports = {
    padID
}
