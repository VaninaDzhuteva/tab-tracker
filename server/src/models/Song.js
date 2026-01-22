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
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        pdfPath: {
            type: DataTypes.STRING,
            allowNull: true
        },
        difficultydifficulty: {
            type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
            allowNull: false,
            defaultValue: 'beginner',
        },
        tags: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '[]',
        },
        isFavorite: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },

    })

    return Song
}
