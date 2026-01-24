const { Song } = require('../models')

module.exports = {
    async index(req, res) {
        try {
            const songs = await Song.findAll({
                where: { userId: req.user.id },
                order: [['createdAt', 'DESC']]
            });
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
                difficulty: req.body.difficulty || 'beginner',
                tags: typeof req.body.tags === 'string' ? req.body.tags : [],
                isFavorite: req.body.isFavorite === 'true' || req.body.isFavorite === true,
                progress: Number(req.body.progress ?? 0) || 0,
                lastPracticedAt: req.body.lastPracticedAt ? new Date(req.body.lastPracticedAt) : null,

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

            if (song.userId !== req.user.id) {
                return res.status(403).send({ error: "You are not allowed to access this song." });
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

            if (song.userId !== req.user.id) {
                return res.status(403).send({ error: "You are not allowed to access this song." });
            }

            const nextPdfPath = req.file ? `/uploads/${req.file.filename}` : song.pdfPath;

            await song.update({
                title: req.body.title,
                artist: req.body.artist,
                tab: req.body.tab,
                pdfPath: nextPdfPath,
                difficulty: req.body.difficulty || song.difficulty,
                tags: typeof req.body.tags === 'string' ? req.body.tags : song.tags,
                isFavorite:
                    req.body.isFavorite === undefined
                        ? song.isFavorite
                        : (req.body.isFavorite === 'true' || req.body.isFavorite === true),
                progress: req.body.progress === undefined ? song.progress : Number(req.body.progress),
                lastPracticedAt:
                    req.body.lastPracticedAt === undefined
                        ? song.lastPracticedAt
                        : (req.body.lastPracticedAt ? new Date(req.body.lastPracticedAt) : null),

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

            const song = await Song.findByPk(req.params.id);
            if (!song) return res.status(404).send({ error: "Song not found." });

            if (song.userId !== req.user.id) {
                return res.status(403).send({ error: "You are not allowed to access this song." });
            }

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
    },

    async toggleFavorite(req, res) {
        try {
            const song = await Song.findByPk(req.params.id);
            if (!song) return res.status(404).send({ error: 'Song not found.' });

            if (song.userId !== req.user.id) {
                return res.status(403).send({ error: "You are not allowed to access this song." });
            }

            await song.update({ isFavorite: !song.isFavorite });
            res.send(song);
        } catch (e) {
            console.error('PATCH /songs/:id/favorite failed:', e);
            res.status(400).send({ error: 'Could not toggle favorite.' })
        }
    },

    async practiceNow(req, res) {
        try {
            const song = await Song.findByPk(req.params.id)
            if (!song) return res.status(404).send({ error: 'Song not found.' });

            if (song.userId !== req.user.id) {
                return res.status(403).send({ error: "You are not allowed to access this song." });
            }

            const bump = req.body?.bumpProgress ? Number(req.body.bumpProgress) : 0
            const nextProgress = Math.max(0, Math.min(100, (song.progress || 0) + bump))

            await song.update({
                lastPracticedAt: new Date(),
                progress: nextProgress,
            })

            res.send(song)
        } catch (e) {
            console.error('PATCH /songs/:id/practice failed:', e)
            res.status(400).send({ error: 'Could not save practice.' })
        }
    }

}