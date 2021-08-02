<template>
    <div class="newPost">
        <h2 class="newPost__subheading">Faites parler votre clavier</h2>

        <form ref="form" name="form" class="newPost__form">
            <input class="newPost__title" v-model="title" type="text" max="150" name="title" id="title" >
            <textarea class="newPost__content" v-model="content" name="content" id="content" rows="3" cols="100" max="2000" placeholder="Quoi de neuf ?"></textarea>
            
            <span v-if="errors.title">{{ errors.title }}</span>
            <span v-if="errors.content">{{ errors.content }}</span>

            <div class="newPost__handleButtons">
                <div v-if="!file">
                    <label class="newPost__button newPost__button-image" for="file">Ajouter une image</label>
                    <input type="file" ref="file" id="file" @change="fileUpload" hidden>
                </div>
                <div v-else>
                    <label class="newPost__button newPost__button-image newPost__button-image--modify" for="file">Modifier l'image</label>
                    <input type="file" ref="file" id="file" @change="fileUpload" hidden>
                    <button class="newPost__button newPost__button-image newPost__button-image--remove" @click.prevent="removeFile">Retirer l'image</button>
                </div>
                <button class="newPost__button" @click.prevent="newPost">Poster</button>
            </div>
            
        </form>
    </div>
</template>

<script>
    export default {
        name: 'newPost',
        data() {
            return {
                title: "",
                content: "",
                errors: {},
                file:'',
                showFileInput: false
            }
        },
        methods: {
            getToken() {
                return localStorage.getItem('token');
            },

            /* format the inputs data in form-data before sending it to the backend */
            newPost() {
                const uri = "http://localhost:3000/api/posts/";
                const token = this.getToken();
                const authValue = 'Bearer ' + token;

                let formData = new FormData();
                formData.append('title', this.title);
                formData.append('content', this.content);
                if (this.file !== '') {
                    formData.append('file', this.file);
                }

                fetch(uri, {
                    method: "POST",
                    headers: {
                        // doesn't use the 'Content-Type': multipart-formData header which would troncate the boundary parameter
                        'Authorization': authValue
                    },
                    body: formData
                })
                .then(res => res.json())
                .then(() => { location.reload(); });
                
            },

            /* check inputs and give an error message accordingly */
            validatePost(value, title, name, max) {
                if(value.length > max ) {
                    this.errors[name] = 'Le '+title+' doit faire moins de '+max+' caractères';
                } else {
                    this.errors[name] = '';
                }
            },

            /* handle file input onChange event */
            fileUpload() {
                this.file = this.$refs.file.files[0];
            },
            removeFile() {
                this.file = '';
            }
        },
        watch: {
            title(newValue) {
                this.validatePost(newValue, 'titre', 'title', 150);
            },
            content(newValue) {
                this.validatePost(newValue, 'contenu', 'content', 2000);
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

    .newPost {
        width: 100%;
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
        &__form {
            width: 100%;
        }
        &__title {
            height: 30px;
            width: 90%;
            max-width: 90%;
            border: 1px solid #b2b2b2;
            padding: 0 0 0 10px;
            margin-bottom: 1rem;
        }
        &__content {
            height: 90px;
            max-height: 90px;
            width: 90%;
            max-width: 90%;
            resize: none;
            border: 1px solid #b2b2b2;
            padding: 10px 0 0 10px;
            margin-bottom: 1rem;
        }
        &__handleButtons {
            display: flex;
            justify-content: space-evenly;
        }
        &__button {
            border: 2px solid #828282;
            border-radius: 10px;
            background-color: #fff;
            height: 30px;
            cursor: pointer;
            &-image {
                display: inline-block;
                box-sizing: border-box;
                padding: 5px 5px 0;
                background-color: #ff8080;
                font-size: 13.33px;
                margin: 0 1rem;
                &--modify {
                    background-color: #00ff80;
                }
                &--remove {
                    background-color: #0080ff;
                    padding: 0 5px;
                }
            }
        }
    }

    @media screen and (max-width: 700px) {
        .newPost {
            &__subheading {
            margin: 0 0 1rem;
            font-size: 20px;
            }
            &__title {
                height: 30px;
                max-width: 630px;
                border: 1px solid #b2b2b2;
                margin-bottom: 1rem;
            }
            &__content {
                max-width: 630px;
            }
            &__button {
                &-image {
                    margin: 0 0.5rem 0 0;
                }
            }
        }
    }
</style>