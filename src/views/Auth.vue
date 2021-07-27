<template>

    <div class="auth__container">
        <form action="" method="post">
            <div v-if="endpoint == '/signup'">
                <h1 class="auth__heading">Rejoignez-nous !</h1>

                <label for="prenom">Prénom</label>
                <input class="form__control" type="text" name="prenom" id="prenom" v-model="prenom" required>
                <label for="nom" >Nom</label>
                <input class="form__control" type="text" name="nom" id="nom" v-model="nom" required>
                <label for="email">Email</label>
                <input class="form__control" type="email" name="email" id="email" v-model="email" placeholder=" utilisateur@domaine.com" pattern="[a-zA-Z0-9][a-zA-Z0-9_\-\.]*@[a-zA-Z0-9][a-zA-Z0-9_\-\.]*\.[a-zA-Z]{2,5}" maxlength="100" required>
                <label for="password">Mot de passe</label>
                <input class="form__control" type="password" name="password" id="password" v-model="password" required>
                <button class="form__button" @click="postSignup">Bouton</button>
            </div>
            <div v-else>
                <h1 class="auth__heading">Ravis de vous revoir !</h1>

                <label for="email">Email</label>
                <input class="form__control" type="email" name="email" id="email" v-model="email" placeholder=" utilisateur@domaine.com" pattern="[a-zA-Z0-9][a-zA-Z0-9_\-\.]*@[a-zA-Z0-9][a-zA-Z0-9_\-\.]*\.[a-zA-Z]{2,5}" maxlength="100" required>
                <label for="password">Mot de passe</label>
                <input class="form__control" type="password" name="password" id="password" v-model="password" required>
                <button class="form__button" @click="postLogin">Bouton</button>
            </div>
        </form>
    </div>

</template>

<script>
// @ is an alias to /src

export default {
    name: 'Home',
    data() {
        return {
            endpoint: "",
            uri: "http://localhost:3000/api/auth",
            api: "localhost",
            prenom: "",
            nom: "",
            email: "",
            password: ""
        }
    },
    methods: {
        loginForm() {
            this.endpoint = "/login";
            this.api = this.uri + this.endpoint;
        },
        signupForm() {
            this.endpoint = "/signup";
            this.api = this.uri + this.endpoint;
        },
        postSignup() {
            fetch(this.api, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'prenom': this.prenom, 'nom': this.nom, 'email': this.email, 'password': this.password})
            })
            .then(function(result) {
                if (result.ok) {
                return result.json();
                }
            })
            .then(() => { 
                location.href="home.html"; 
            })
            .catch(() => {
                alert("There was a server issue, account creation failed !");
            });
        },
        postLogin() {
            fetch(this.api, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'email': this.email, 'password': this.password})
            })
            .then(function(result) {
                if (result.ok) {
                return result.json();
                }
            })
            .then(() => { 
                location.href="home.html"; 
            })
            .catch(() => {
                console.log("There was a server issue, connexion failed !");
            });
        }
    }
}
</script> 

<style scoped lang="scss">

.auth__container {
    width: 300px;
    max-height: 350px;
    margin: 0 auto;
    padding: 0 1rem;
    border: solid #cdcdcd;
    border-radius: 15px;
    background-color: #f2f2f2;
    &__heading {
        width: max-content;
        margin: 1rem auto;
    }
}

.form {
    &__control {
        width: 100%;
    }
    &__button {
        display: block;
        width: 100px;
        margin: 1rem auto 1.5rem;
        background-color: #fff;
        border: 3px solid #cdcdcd;
        border-radius: 10px;
    }
}
</style>
