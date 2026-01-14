import Api from "./Api.js";

export default {
    fetchAll() {
        return Api().get('/songs');
    },
    remove(id) {
        return Api().delete(`/songs/${id}`);
    }
}