<template>
    <div class="post">
        <div v-for="post in posts" :key="post.id">
            <div class="post__item">
                <h3 class="post__title"> {{ post.title }} </h3>
                <p class="post__details"> {{ post.writer.prenom }} {{ post.writer.nom }} || {{ post.date_issue }} </p>
                <p class="post__content"> {{ post.content }} </p>
                <button class="post__button" @click="modifyPost">Modifier l'article</button> <!--show button if logged user is writer-->
                <button @click="deletePost(post)">Supprimer le post</button>
                
                <div class="newComment">
                    <input class="newComment" type="text" max="150" name="comment" id="comment" v-model="newComment.content">
                    <button class="newPost__button" @click="postComment(post)">Post a comment<span class="fas fa-paper-plane"></span></button>
                </div>
                
                <div class="comment" v-if="post.comments.length > 0">
                    <div v-for="comment in post.comments" :key="comment.id" class="comment__item">
                        <p class="comment__details"> {{comment.writer.prenom }} {{ comment.writer.nom }} || {{ comment.createdAt }} </p>
                        <p class="comment__content"> {{ comment.content }} </p>
                        <button @click="deleteComment(comment)">Supprimer le commentaire</button>
                    </div>
                </div> 
            </div>

            <div v-if="toModify" class="post"> <!-- bind  to post.id -->
                <h2 class="post__subheading">Vous avez fait une faute d'orthographe ? On va rectifier ça 😉</h2>
                
                <input class="modify-post__title" type="text" max="150" name="title" id="title" :placeholder="post.title">
                <textarea class="modify-post__content" type="textarea" name="content" id="content" rows="3" cols="100" :placeholder="post.content"></textarea>
                
                <button class="modify__button">Modify post</button>
                <button class="modify__button modify__button--cancel" @click="modifyPost">Annuler</button>
            </div>
        </div>        
    </div>
</template>

<script>

    export default {
        name: 'PostList',
        data() {
            return {
                posts: [],
                postInfo: "",
                toModify: false,
                newComment: {
                    content: ""
                }
            }
        },
        methods: {
            getToken() {
                return localStorage.getItem('token');
            },
            update() {
                this.$forceUpdate();
            },
            deletePost(post) {
                const post_id = post.id;
                const uri = "http://localhost:3000/api/posts/";
                const api = uri + post_id;
                const token = this.getToken();
                const authValue = 'Bearer ' + token;
                fetch(api, {
                    method: "DELETE",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': authValue
                    }
                })
                .then(res => res.json())
                .then(() => { location.reload(); });
            },
            deleteComment(comment) {
                const comment_id = comment.id;
                const post_id = comment.PostId;
                const uri = "http://localhost:3000/api/posts/";
                const api = uri + post_id + "/comments/" + comment_id;
                const token = this.getToken();
                const authValue = 'Bearer ' + token;
                fetch(api, {
                    method: "DELETE",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': authValue
                    }
                })
                .then(res => res.json())
                .then(() => { location.reload(); });
            },
            modifyPost() {
                if (this.toModify == false) {
                    this.toModify = true;
                } else {
                    this.toModify = false;
                }
            },
            postComment(post) {
                const post_id = post.id;
                const uri = "http://localhost:3000/api/posts/";
                const api = uri + post_id + "/" + "comments";
                const token = this.getToken();
                const authValue = 'Bearer ' + token;
                fetch(api, {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': authValue
                    },
                    body: JSON.stringify({'content': this.newComment.content })
                })
                .then(res => res.json())
                .then(() => { location.reload(); });
            },

            /* loop through the posts array, request the post writer details, append post object propriety 'writer', 
            assign result to each post.writer */
            getPostWriter(authValue) {
                this.posts.forEach(post => {
                    const writer_id = post.UserId;
                    const uri = "http://localhost:3000/api/auth/users/";
                    const apiWriter = uri + writer_id;
                    fetch(apiWriter, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': authValue
                        }
                    })
                    .then(res => res.json())
                    .then((value) => { 
                        post.writer = value; 
                    });
                });
            },

            /* loop through the posts array, request the post comments details, append post object propriety 'comments', 
            assign result to each post.comments, loop through the post.comments array, call another method */
            getComments(authValue) {
                this.posts.forEach(post => {
                    const post_id = post.id;
                    const uri = "http://localhost:3000/api/posts/";
                    const api = uri + post_id + "/comments";
                    fetch(api, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': authValue
                        }
                    })
                    .then(res => res.json())
                    .then((value) => { 
                        post.comments = value;
                        post.comments.forEach(comment => {
                            this.getCommentWriter(comment, authValue);
                        });
                    });
                });  
            },

            /* request the post comment writer details, append comment object propriety 'writer', 
            assign result to each comment.writer */
            getCommentWriter(comment, authValue) {
                const writer_id = comment.UserId;
                const uri = "http://localhost:3000/api/auth/users/";
                const apiWriter = uri + writer_id;
                fetch(apiWriter, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': authValue
                    }
                })
                .then(res => res.json())
                .then((value) => { 
                    comment.writer = value; 
                });
            },
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
            .then((json) => { this.posts = json; })
            .then(() => {
                this.getPostWriter(authValue);
                this.getComments(authValue);
            });
        }
        // donner au logged user la possibilité de put et delete son post, et à admin le droit de delete les comments
        // gestion des images, quand on crée un post possibilité ajouter ou non une image
    };
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

    .comment {
        margin: 1rem 0;
        padding: 1rem 0 2rem;
        //display: flex;
        //flex-wrap: wrap;
        //justify-content: space-around;
        //box-shadow: 0px 0px 5px #bdbdbd;
        //background-color: #f8f8f8;
        &__item {
            //background-color: #fff;
            background-color: #f8f8f8;
            box-shadow: 0px 0px 5px #bdbdbd;
            margin: 1rem;    
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