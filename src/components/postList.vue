<template>
    <div class="post">
        <div v-for="post in posts" :key="post.id">
            <div class="post__item">
                <h3 class="post__title"> {{ post.title }} </h3>
                <p class="post__details"> {{ post.writer.prenom }} {{ post.writer.nom }} || {{ post.date_issue }} </p>
                <p class="post__content"> {{ post.content }} </p>
                <button class="post__button" @click="showUpdate">Modifier l'article</button> <!--show button if logged user is writer-->
                <button class="post__button" @click="deletePost(post)">Supprimer l'article</button>
                
                <div class="newComment">
                    <input class="newComment__content" type="text" max="255" name="comment" id="comment" v-model="commentContent" placeholder="Pour commenter c'est ici">
                    <button class="post__button post__button--newComment" @click="postComment(post)">Poster un commentaire</button>
                    <span v-if="errors.commentContent">{{ errors.commentContent }}</span>
                </div> 
                
                <div class="comments" v-if="post.comments.length > 0">
                    <div v-for="comment in post.comments" :key="comment.id" class="comments__item">
                        <p class="comments__details"> {{comment.writer.prenom }} {{ comment.writer.nom }} || {{ comment.createdAt }} </p>
                        <p class="comments__content"> {{ comment.content }} </p>
                        <button class="post__button" @click="deleteComment(comment)">Supprimer le commentaire</button>
                    </div>
                </div> 
            </div>

            <div v-if="toModify" class="post__item"> <!-- bind  to post.id -->
                <h2 class="post__subheading">Vous avez fait une faute d'orthographe ? On va rectifier ça 😉</h2>
                
                <input class="modify-post__title" v-model="modifiedPostTitle" type="text" max="150" name="title" id="title"  :placeholder="post.title">
                <textarea class="modify-post__content" v-model="modifiedPostContent" type="textarea" name="content" id="content" rows="3" cols="100" :placeholder="post.content"></textarea>
    
                <button class="modify__button" @click="modifyPost(post)">Modify post</button>
                <button class="modify__button modify__button--cancel" @click="showUpdate">Annuler</button>

                <span v-if="errors.modifiedPostTitle">{{ errors.modifiedPostTitle }}</span>
                <span v-if="errors.modifiedPostContent">{{ errors.modifiedPostContent }}</span>
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
                commentContent: "",
                modifiedPostTitle: "",
                modifiedPostContent: "",
                errors: {}
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
            showUpdate() {
                if (this.toModify == false) {
                    this.toModify = true;
                } else {
                    this.toModify = false;
                }
            },
            modifyPost(post) {
                const post_id = post.id;
                const uri = "http://localhost:3000/api/posts/";
                const api = uri + post_id;
                const token = this.getToken();
                const authValue = 'Bearer ' + token;
                fetch(api, {
                    method: "PUT",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': authValue
                    },
                    body: JSON.stringify({'title': this.modifiedPostTitle, 'content': this.modifiedPostContent })
                })
                .then(res => res.json())
                .then(value => {
                    if (value.message === "Post modified !") {
                        location.reload();
                    }
                });
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
                    body: JSON.stringify({'content': this.commentContent })
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
            validateInput(value, title, name, max) {
                if(value.length > max ) {
                    this.errors[name] = 'Le '+title+' doit faire moins de '+max+' caractères';
                } else {
                    this.errors[name] = '';
                }
            }
        },
        watch: {
            commentContent(newValue) {
                this.validateInput(newValue, 'contenu', 'commentContent', 255);
            },
            modifiedPostTitle(newValue) {
                this.validateInput(newValue, 'titre', 'modifiedPostTitle', 255);
            },
            modifiedPostContent(newValue) {
                this.validateInput(newValue, 'contenu', 'modifiedPostContent', 2000);
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
            .then((json) => { this.posts = json; })
            .then(() => {
                this.getPostWriter(authValue);
                this.getComments(authValue);
            });
        }
        //donner à admin le droit de delete les comments
        // gestion des images, quand on crée un post possibilité ajouter ou non une image
    };
</script>

<style scoped lang="scss">
    .post {
        margin: 1rem 0;
        padding: 1rem 0 2rem;
        &__item {
            width: auto;
            background-color: #fff;
            box-shadow: 0px 0px 5px #bdbdbd;
            margin: 1rem 0;
            padding: 1rem 1rem 1rem;    
        }
        &__title {
            font-weight: bold;
            margin: 0;
        }
        &__button {
            height: 30px;
            margin: 0 1rem 1rem;
            border: 2px solid #828282;
            border-radius: 10px;
            background-color: #fff;
            cursor: pointer;
            &--newComment {
            margin: 1rem 1rem 0;
            }
        }
    }

    .newComment {
        text-align: left;
        &__content {
            height: 30px;
            width: 95%;
            max-width: 95%;
            border: 1px solid #b2b2b2;
            padding: 0 0 0 10px;
        }
    }

    .comments {
        width: 100%;
        margin: 1rem 0;
        padding: 1rem 0 2rem;
        &__item {
            width: 100%;
            //margin: 1rem;  
            //background-color: #f8f8f8;
            //box-shadow: 0px 0px 5px #bdbdbd;
            border-bottom: 1px solid #000;;
            text-align: left;
        }
        &__details {
            font-size: 14px;
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
        cursor: pointer;

    }

    .modify__button--cancel {
        border: 2px solid #ca0000;
        background-color: #ff0000;
    }

</style>