<template>
    <div class="user__profile">
        <span class="user__avatar"><img src="" alt="User avatar"></span>
        <p class="user__name"> Prénom : {{ user.prenom }} {{ user.nom }} </p>
        <p class="user__name"> Nom :{{ user.nom }} </p>
        <p class="user__email"> Email : {{user.email }} </p>
        <button @click="deleteConfirm" class="user__delete"><span class="fas fa-trash-alt"></span>Supprimer mon compte</button>
    </div>
</template>

<script>
export default {
    name: 'userProfile',
    data() {
        return {
            user: {}
        }
    },
    methods: {
        deleteConfirm() {
            confirm("Vous voulez vraiment nous quitter ? 😢");
        },
        getToken() {
            return localStorage.getItem('token');
        },
        getUserId() {
            return localStorage.getItem('user_id');
        }
    },
    created() {
        const token = this.getToken();
        const user_id = this.getUserId();
        const uri = "http://localhost:3000/api/auth/users/";
        const api = uri + user_id
        const authValue = 'Bearer ' + token;
        fetch(api, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': authValue
            }
        })
        .then(res => res.json())
        .then((json) => {this.user = json});
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.user {
    &__profile {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        padding: 2rem;
        width: 200px;
        height: 250px;    
    }
    &__avatar {
        font-size: 70px;
    }
    &__delete {
        border-radius: 10px;
        background-color: #ececec;
        color: #000;
        height: max-content;
    }
}

</style>