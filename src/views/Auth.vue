<template>
    <a @click="signupForm"><li class="header__li">S'inscrire</li></a>
    <a @click="loginForm"><li class="header__li">Se connecter</li></a>

    <div class="auth__container">
        <div v-if="endpoint == '/signup'">
            <form @submit.prevent="postSignup">
                <h1 class="auth__heading">Rejoignez-nous !</h1>

                <label for="prenom">Prénom</label>
                <input class="form__control" type="text" name="prenom" id="prenom" v-model="prenom" required>
                <span v-if="errors.prenom">{{ errors.prenom }}</span>

                <label for="nom" >Nom</label>
                <input class="form__control" type="text" name="nom" id="nom" v-model="nom" required>
                <span v-if="errors.nom">{{ errors.nom }}</span>

                <label for="email">Email</label>
                <input class="form__control" type="email" name="email" id="email" v-model="email" placeholder="utilisateur@domaine.com" maxlength="100" required>
                <span v-if="errors.email">{{ errors.email }}</span>
                
                <label for="password">Mot de passe</label>
                <input class="form__control" type="password" name="password" id="password" v-model="password" required>
                <span v-if="errors.password">{{ errors.password }}</span>
                
                <button type="submit" class="form__button" :disabled="isDisabled">Bouton</button>
            </form>
        </div>
        
        <div v-else>
            <form @submit.prevent="postLogin">
                <h1 class="auth__heading">Ravis de vous revoir !</h1>

                <label for="email">Email</label>
                <input class="form__control" type="email" name="email" id="email" v-model="email" placeholder="utilisateur@domaine.com" pattern="[a-zA-Z0-9][a-zA-Z0-9_\-\.]*@[a-zA-Z0-9][a-zA-Z0-9_\-\.]*\.[a-zA-Z]{2,5}" maxlength="100" required>
                <span v-if="errors.email">{{ errors.email }}</span>
                
                
                <label for="password">Mot de passe</label>
                <input class="form__control" type="password" name="password" id="password" v-model="password" required>
                <span v-if="errors.password">{{ errors.password }}</span>
                
                <button type="submit" class="form__button" :disabled="isDisabled">Bouton</button>
            </form>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src

export default {
    name: 'Auth',
    data() {
        return {
            endpoint: "/login",
            uri: "http://localhost:3000/api/auth",
            api: "http://localhost:3000/api/auth/login",
            prenom: "",
            nom: "",
            email: "",
            password: "",
            errors: {},
            isDisabled: true,
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
            .then(() => { alert("Account created. Please login to your account.")})
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
            .then(result => {
                if (result.ok) {
                    return result.json();
                }
            })
            .then(value => {
                const userToken = value.token;
                const user_id = value.user_id;
                localStorage.setItem("token", userToken);
                localStorage.setItem("user_id", user_id);
                this.$router.push("/Home");
            })
            .catch(() => {
                localStorage.removeItem("token"); // if request fails, remove any possible user token
                alert("There was a server issue, connexion failed !");
            }); 
        },
        validateName(value, title, name, min, max) {
            if(value.length < min || value.length > max ) {
                this.errors[name] = 'Le '+title+' doit faire entre 3 et 50 caractères';
                this.isDisabled = true;
            } else {
                this.errors[name] = '';
                this.isDisabled = false;
            }
        }
    },
    watch: {
        email(newValue) {
            if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(newValue)) {
                this.errors['email'] = '';
                this.isDisabled = false;
            } else {
                this.errors['email'] = 'L\'adresse email n\'a pas un bon format';
                this.isDisabled = true;
            }
        },
        prenom(newValue) {
            this.validateName(newValue, 'prénom', 'prenom', 3, 50);
        },
        nom(newValue) {
            this.validateName(newValue, 'nom', 'nom', 3, 50);
        },
        password(newValue) {
            if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*[!@#$%^&*])(?=.{6,})(?!.{17,})(?!.*[!@#$%^&*])/.test(newValue)) {
                this.errors['password'] = '';
                this.isDisabled = false;
            } else {
                this.errors['password'] = 'Le mot de passe doit contenir entre 6 et 16 caractères, au moins 1 chiffres, pas de symboles';
                this.isDisabled = true;
            }
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
        background-color: #fff0f0;
        border: 3px solid #cdcdcd;
        border-radius: 10px;
        box-shadow: 1px 2px 3px #909090;
        color: #ff0000;
        &:disabled {
            box-shadow: none;
            color: #000;
            background-color: #ffffff;
        }
    }
}
</style>