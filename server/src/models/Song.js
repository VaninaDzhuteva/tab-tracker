module.exports = (sequelize, DataTypes) => {
    const Song = sequelize.define('Song', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        artist: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        tab: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    })

    return Song
}
