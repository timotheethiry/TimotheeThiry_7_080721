<template>
    <div class="post">
        <div class="post__item">
            <h1 class="post__title"> {{ post.title }} </h1>
            <p> {{ post.body }} </p>
            <p> {{  }} || {{  }} </p>
        </div>
        <button class="post__button" @click="modifyPost">Modifier l'article</button>
    </div>

    <div v-if="toModify" class="post">
        <h2 class="post__subheading">Vous avez fait une faute d'orthographe ? On va rectifier ça 😉</h2>
        
        <input class="modify-post__title" type="text" max="150" name="title" id="title">
        <textarea class="modify-post__content" type="textarea" name="content" id="content" rows="3" cols="100" placeholder="Quoi de neuf ?"></textarea>
        
        <button class="modify__button">Modify post</button>
        <button class="modify__button modify__button--cancel" @click="modifyPost">Annuler</button>
    </div>

    <a class="post__button" href="home.html">&lt;- Tous les posts</a>
</template>

<script>
export default {
    name: 'Posted',
    data() {
        return {
            post: {},
            postInfo: "",
            toModify: false,
        }
    },
    methods: {
        deleteConfirm() {
            confirm("Vous voulez vraiment nous quitter ? 😢");
        },
        modifyPost() {
            if (this.toModify == false) {
                this.toModify = true;
            } else {
                this.toModify = false;
            }
        }
    },
    created() {
        fetch('https://jsonplaceholder.typicode.com/posts/1')
        .then(res => res.json())
        .then((json) => {this.post = json});
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.post {
    margin: 1rem 0;
    padding: 1rem 0 2rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    box-shadow: 0px 0px 5px #bdbdbd;
    background-color: #f8f8f8;
    padding-bottom: 1rem;
    &__subheading {
        width: 100%;
        margin: 0 0 1rem 1rem;
    }
    &__title {
        height: 30px;
        width: 95%;
        max-width: 95%;
        border: 1px solid #b2b2b2;
        padding: 10px;
        margin-bottom: 1rem;
    }
    &__content {
        height: 90px;
        max-height: 90px;
        max-width: 95%;
        resize: none;
        border: 1px solid #b2b2b2;
        padding: 10px;
        margin-bottom: 1rem;
    }
    &__button {
        border: 2px solid #828282;
        border-radius: 10px;
        background-color: #fff;
        height: 30px;
        &--addImage {
            background-color: #ff8080;
        }
    }
}

.modify-post__title {
    height: 30px;
    width: 95%;
    max-width: 95%;
    border: 1px solid #b2b2b2;
    padding: 10px;
    margin-bottom: 1rem;
}

.modify-post__content {
    height: 90px;
    max-height: 90px;
    max-width: 95%;
    resize: none;
    border: 1px solid #b2b2b2;
    padding: 10px;
    margin-bottom: 1rem;
}

.modify__button {
    border: 2px solid #14ca00;
    border-radius: 10px;
    background-color: #38e100;
    height: 30px;
}

.modify__button--cancel {
    border: 2px solid #ca0000;
    background-color: #ff0000;
}
</style>