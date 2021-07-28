<template>
    <div class="post">
        <div v-for="(post, key) in posts" :key="key" class="post__item">
            <a href="post.html"><h3 class="post__title"> {{ post.title }} </h3></a>
            <p class="post__details"> {{  }} </p>
            <p class="post__content"> {{ post.body }} </p>
            <button>Supprimer le post</button>
        </div>
      </div>
</template>

<script>
export default {
    name: 'PostList',
    data() {
        return {
            posts: [],
            postInfo: ""
        }
    },
    methods: {
        getToken() {
            return localStorage.getItem('token');
        }
    },
    created() {
        const token = this.getToken();
        const authValue = 'Bearer ' + token;
        fetch('http://localhost:3000/api/posts', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': authValue
            }
        })
        .then(res => res.json())
        .then((json) => {this.posts = json});
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
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
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