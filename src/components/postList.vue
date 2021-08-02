<template>
    <div class="post">
        <div v-for="post in posts" :key="post.id">
            <div class="post__item">
                <img class="post__image" v-if="post.image_url" :src="post.image_url" alt="Image de l'article">
                <h3 class="post__title"> {{ post.title }} </h3>
                <p class="post__details"> {{ post.User.prenom }} {{ post.User.nom }} || {{ post.date_issue }} </p>
                <p class="post__content"> {{ post.content }} </p>
                <button class="post__button" @click="showUpdate">Modifier l'article</button> <!--show button if logged user is writer-->
                <button class="post__button" @click="deletePost(post)">Supprimer l'article</button>
                
                <div class="newComment">
                    <label for="comment" class="newComment__label">&Eacute;crire un commentaire</label>
                    <input class="newComment__content" type="text" max="255" name="comment" id="comment" v-model="commentContent" placeholder="Pour commenter c'est ici">
                    <button class="post__button post__button--newComment" @click="postComment(post)">Poster un commentaire</button>
                    <span v-if="errors.commentContent">{{ errors.commentContent }}</span>
                </div> 
                
                <div class="comments" v-if="post.Comments.length > 0">
                    <div v-for="comment in post.Comments" :key="comment.id" class="comments__item">
                        <p class="comments__details"> {{comment.User.prenom }} {{ comment.User.nom }} || {{ comment.createdAt }} </p>
                        <p class="comments__content"> {{ comment.content }} </p>
                        <button class="post__button" @click="deleteComment(comment)">Supprimer le commentaire</button>
                    </div>
                </div> 
            </div>

            <div v-if="toModify" class="post__item"> <!-- bind  to post.id -->
                <h2 class="post__subheading">Vous avez fait une faute d'orthographe ? On va rectifier ça 😉</h2>
                
                <form ref="form2" name="form" class="modifyPost__form">
                    <input class="modifyPost__title" v-model="modifiedPostTitle" type="text" max="150" name="title" id="title"  :placeholder="post.title">
                    <textarea class="modifyPost__content" v-model="modifiedPostContent" name="content" id="content" :placeholder="post.content"></textarea>

                    <div class="modifyPost__handleButtons">
                        <!--<div v-if="!modifiedFile">
                            <label class="modifyPost__button modifyPost__button-image" for="modifyFile">Ajouter une image</label>
                            <input type="file" ref="file2" id="modifyFile" @change="fileUpdate" hidden>
                        </div>
                        <div v-else>
                            <label class="modifyPost__button modifyPost__button-image modifyPost__button-image--modify" for="modifyFile">Modifier une image</label>
                            <input type="file" ref="file2" id="modifyFile" @change="fileUpdate" hidden>
                            <button class="modifyPost__button modifyPost__button-image modifyPost__button-image--remove" @click.prevent="removeFile">Retirer l'image</button>
                        </div>-->
                        <button class="modifyPost__button" @click.prevent="modifyPost(post)">Modifier l'article</button>
                        <button class="modifyPost__button modifyPost__button--cancel" @click="showUpdate">Annuler</button>
                    </div>
                </form>

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
                errors: {},
                modifiedFile: ''
            }
        },
        methods: {
            getToken() {
                return localStorage.getItem('token');
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

            /* method to open/close the post modification div */
            showUpdate() {
                if (this.toModify == false) {
                    this.toModify = true;
                } else {
                    this.toModify = false;
                }
            },

            /* format the inputs data in form-data, send it to the back end, update the posts array */
            modifyPost(post) {
                const post_id = post.id;
                const uri = "http://localhost:3000/api/posts/";
                const api = uri + post_id;
                const token = this.getToken();
                const authValue = 'Bearer ' + token;

                let formData = new FormData();
                formData.append('title', this.modifiedPostTitle);
                formData.append('content', this.modifiedPostContent);
                if (post.image_url !== '') {
                    const image_name = post.image_url.split('images/')[1];
                    formData.append('file', image_name);
                }
                
                fetch(api, {
                    method: "PUT",
                    headers: {
                        'Authorization': authValue
                    },
                    body: formData
                })
                .then(res => res.json())
                .then(value => {
                    if (value.message === "Post modified !") {
                        this.getAllPosts();
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
                .then(() => { 
                    this.getAllPosts(); 
                });
            },
            validateInput(value, title, name, max) {
                if(value.length > max ) {
                    this.errors[name] = 'Le '+title+' doit faire moins de '+max+' caractères';
                } else {
                    this.errors[name] = '';
                }
            },
            getAllPosts() {
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
                .then((json) => { 
                    this.posts = json;
                });
            }
            /* handle file input onChange event
            fileUpdate() {
                this.modifiedFile = this.$refs.file2.files[0];
            },
            removeFile() {
                this.modifiedFile = '';
            }*/
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
            this.getAllPosts();
        }
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
        &__image {
            width: 100%;
            max-width: 500px;
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
        &__label {
            display: inline-block;
            width: 100%;
        }
    }

    .comments {
        width: 100%;
        margin: 1rem 0;
        padding: 1rem 0 2rem;
        &__item {
            width: 100%;
            border-bottom: 1px solid #000;;
            text-align: left;
        }
        &__details {
            font-size: 14px;
        }
    }

    .modifyPost {
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
            width: 95%;
            max-width: 95%;
            resize: none;
            border: 1px solid #b2b2b2;
            padding: 10px;
            margin-bottom: 1rem;
        }
        &__handleButtons {
            display: flex;
            justify-content: space-evenly;
        }
        &__button {
            border: 2px solid #14ca00;
            border-radius: 10px;
            background-color: #38e100;
            height: 30px;
            cursor: pointer;
            margin: 0 0 0 0.5rem;
            min-width: max-content;
            &-image {
                display: inline-block;
                box-sizing: border-box;
                padding: 5px 5px 0;
                border: 2px solid #828282;
                background-color: #f2f2f2;
                font-size: 13.33px;
                margin: 0;
                &--modify {
                    background-color: #00ff80;
                }
                &--remove {
                    background-color: #0080ff;
                    padding: 0 5px;
                }
            }
            &--cancel {
                border: 2px solid #ca0000;
                background-color: #ff0000;
            }
        }  
    }
</style>