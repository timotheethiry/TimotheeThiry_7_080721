<template>
    <div class="comment">
        <div v-for="(comment, key) in comments" :key="key" class="comment__item">
            <h3 class="comment__title"> {{ comment.title }} </h3>
            <p class="comment__details"> {{  }} </p>
            <p class="comment__content"> {{ comment.body }} </p>
            <button>Supprimer le commentaire</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Comments',
    data() {
        return {
            comments: [],
            commentInfo: ""
        }
    },
    methods: {
        getToken() {
            return localStorage.getItem('token');
        },
    },
    created() {
        const token = this.getToken();
        const authValue = 'Bearer ' + token;
        fetch('http://localhost:3000/api/posts/2', { // get post id and pass it
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': authValue
            }
        })
        .then(res => res.json())
        .then((json) => {this.comments = json});
    }
    // recupérer les posts avec leurs commentaires et le writer des comments, récupère le profil logged user
    // trier les posts par date de publication
    // donner au logged user la possibilité de put et delete son post, et à admin le droit de delete les comments
    // gestion des images, quand on crée un post possibilité ajouter ou non une image
}
</script>

<style scoped lang="scss">

.post {
    margin: 1rem 0;
    padding: 1rem 0 2rem;
    //display: flex;
    //flex-wrap: wrap;
    //justify-content: space-around;
    box-shadow: 0px 0px 5px #bdbdbd;
    background-color: #f8f8f8;
    &__item {
        background-color: #fff;
        box-shadow: 0px 0px 5px #bdbdbd;
        margin: 1rem;    
    }
    &__title {
        font-weight: bold;
    }
}
</style>