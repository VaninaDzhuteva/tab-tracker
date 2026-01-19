const { Song } = require('../models')

module.exports = {
    async index(req, res) {
        try {
            const songs = await Song.findAll({ order: [['createdAt', 'DESC']] })
            res.send(songs);
        } catch (err) {
            res.status(500).send({ error: 'Failed to fetch songs' })
        }
    },

    async create(req, res) {
        try {
            const pdfPath = req.file ? `/uploads/${req.file.filename}` : null;

            const song = await Song.create({
                title: req.body.title,
                artist: req.body.artist,
                tab: req.body.tab,
                userId: req.user.id,
                pdfPath,
                difficulty: req.body.difficulty || 'beginner'
            });

            res.send(song);
        } catch (error) {
            res.status(400).send({ error: 'Could not create song.' })
        }
    },

    async show(req, res) {
        try {
            const song = await Song.findByPk(req.params.id);

            if (!song) {
                return res.status(404).send({ error: 'Song not found!' });
            }

            res.send(song);
        } catch (e) {
            console.error('GET /songs/:id failed:', e);
            res.status(500).send({ error: "Failed to load song." });
        }
    },

    async update(req, res) {
        try {
            const song = await Song.findByPk(req.params.id);
            if (!song) return res.status(404).send({ error: 'Song not found.' });

            const nextPdfPath = req.file ? `/uploads/${req.file.filename}` : song.pdfPath;

            await song.update({
                title: req.body.title,
                artist: req.body.artist,
                tab: req.body.tab,
                pdfPath: nextPdfPath,
                difficulty: req.body.difficulty || song.difficulty,
            });

            res.send(song);
        } catch (e) {
            console.error('PUT /songs/:id failed:', e)
            res.status(400).send({ error: 'Could not update song.' })
        }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;

            const deletedCount = await Song.destroy({
                where: { id, userId: req.user.id }
            });

            if (!deletedCount) {
                return res.status(404).send({ error: 'Song not found.' })
            }

            res.send({ od: true })

        } catch (error) {
            res.status(400).send({ error: 'Could not delete song.' })
        }
    }
}