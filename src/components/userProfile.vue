<template>
    <div>
        <div class="user__profile">
            <span class="user__avatar fas fa-user-circle"></span>
            <p class="user__name"> Prénom: {{ user.prenom }} </p>
            <p class="user__name"> Nom: {{ user.nom }} </p>
            <p class="user__email"> Email: {{user.email }} </p>

            <button @click="deleteConfirm" class="user__button">Supprimer mon compte</button>
            <button @click="logout" class="user__button">Se déconnecter</button> 
        </div>

        <div class="user__profile--small">
            <span class="user__avatar fas fa-user-circle"></span>
            <div class="user__infos"> 
                <p> {{ user.prenom }} {{ user.nom }} </p>
                <p> {{ user.email }} </p>
                <button @click="deleteConfirm" class="user__button"><span class="fas fa-trash-alt"></span></button>
                <button @click="logout" class="user__button"><span class="fas fa-power-off"></span></button> 
            </div>
        </div>
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
                const userToDelete = confirm("Vous voulez vraiment nous quitter ? 😢");
                if (userToDelete == true) {
                    const token = this.getToken();
                    const user_id = this.getUserId();
                    const uri = "http://localhost:3000/api/auth/users/";
                    const api = uri + user_id
                    const authValue = 'Bearer ' + token;

                    /* need to send fetch request two times to delete associated posts and comments */
                    fetch(api, {
                        method: "DELETE",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': authValue
                        }
                    })
                    .then(res => res.json());

                    fetch(api, {
                        method: "DELETE",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': authValue
                        }
                    })
                    .then(res => res.json())
                    .then(() => { this.$router.push("/auth"); });
                }
            },
            getToken() {
                return localStorage.getItem('token');
            },
            getUserId() {
                return localStorage.getItem('user_id');
            },
            logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            location.reload();
            this.$router.push("/auth");
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
            &--small {
                display: none;
            }  
        }
        &__avatar {
            font-size: 70px;
        }
        &__button {
            height: 30px;
            margin: 0 1rem 1rem;
            color: #000;
            border: 2px solid #828282;
            border-radius: 10px;
            background-color: #fff;
            cursor: pointer;
        }
    }

    @media screen and (max-width: 700px) {

        .user {
            &__profile {
                display: none;
                &--small {
                    display: flex;
                    justify-content: ce;
                    flex-wrap: wrap;
                    position: unset;
                    margin: auto;
                    padding: 0;
                    width: 100%;
                    height: 120px;
                }  
            }
            &__avatar {
                font-size: 50px;
                height: 50px;
                margin: 0 0 0 1rem;
                transform: translateY(35px);
            }
            &__infos {
                width: 215px;
                margin: 0 0 0 1rem;
                padding: 1rem 0 0;
                text-align: left;
                & p {
                    margin: 0 0 0.7rem;
                }
            }
            &__button {
                height: 30px;
                width: 50px;
                margin: 0 1rem;
                border-radius: 10px;
                background-color: #ececec;
                color: #000;
            }
        }
    }

</style>