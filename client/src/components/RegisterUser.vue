<template>
    <div>
        <h1>Register</h1>

        <input type="email" name="email" placeholder="email" v-model="email">

        <input type="password" name="password" placeholder="password" v-model="password">

        <button @click="registerUser">Register</button>
    </div>
</template>

<script>
import AuthenticationServise from '../services/AuthenticationService.js'
export default {
    data() {
        return {
            email: '',
            password: ''
        }
    },

    methods: {
        async registerUser() {
            const response = await AuthenticationServise.register({
                email: this.email,
                password: this.password
            })
            console.log(response.data);
        }
    }

}
</script>