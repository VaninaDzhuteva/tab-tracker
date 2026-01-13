const {Song} = require ('../models')

module.exports = {
    async index(req, res) {
        try {
            const songs = await Song.findAll({ order: [['createAt', 'DESC']]})
            res.send(songs);
        } catch (err) {
            res.status(500).send({error: 'Failed to fetch songs'})
        }
    },

    async create(req, res) {
        try {
            const song = await Song.create({
                title: req.body.title,
                artist: req.body.artist,
                tab: req.body.tab
            });

            res.send(song);
        } catch (error) {
            res.status(400).send({ error: 'Could not create song.' })
        }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;
            await Song.destroy({where: {id}});
            res.send({ok: true})
        } catch(error) {
            res.status(400).send({ error: 'Could not delete song.' })
        }
    }
}