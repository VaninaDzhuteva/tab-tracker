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

        progress: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: { min: 0, max: 100 },
        },

        lastPracticedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

    });

    Song.associate = (models) => {
        Song.belongsTo(models.User, { foreignKey: 'userId'});
    }

    return Song
}
