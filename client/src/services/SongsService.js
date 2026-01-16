import Api from "./Api.js";

export default {
    fetchAll() {
        return Api().get('/songs');
    },
    getById(id) {
        return Api().get(`/songs/${id}`);
    },
    create(song) {
        return Api().post('/songs', song);
    },
    update(id, payload) {
        return Api().put(`/songs/${id}`, payload);
    },
    remove(id) {
        return Api().delete(`/songs/${id}`);
    }
}