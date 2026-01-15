import Api from "./Api.js";

export default {
    fetchAll() {
        return Api().get('/songs');
    },
    create(song) {
        return Api().post('/songs', song);
    },
    remove(id) {
        return Api().delete(`/songs/${id}`);
    }
}