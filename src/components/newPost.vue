<template>
    <div class="newPost">
        <h2 class="newPost__subheading">Faites parler votre clavier</h2>
        <form ref="form" name="form" class="newPost__form">
            <input class="newPost__title" v-model="title" type="text" max="150" name="title" id="title" >
            <textarea class="newPost__content" v-model="content" type="textarea" name="content" id="content" rows="3" cols="100" max="2000" placeholder="Quoi de neuf ?"></textarea>
            <span v-if="errors.title">{{ errors.title }}</span>
            <span v-if="errors.content">{{ errors.content }}</span>

            <div class="newPost__flexbox">
                <div v-if="!image">
                    <label class="newPost__button newPost__button--addImage" for="file">Ajouter une image</label>
                    <input type="file" ref="file" id="file" @change="fileUpload" hidden>
                </div>
                <div v-else>
                    <img :src="this.file.name" />
                    <button @click="removeImage">Enlever l'image</button>
                </div>
                <button class="newPost__button" @click="newPost">Poster l'article</button>
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
            newPost() {
                const uri = "http://localhost:3000/api/posts/";
                const token = this.getToken();
                const authValue = 'Bearer ' + token;

                if (this.file) {
                    let formData = new FormData(this.$refs.form);
                    //formData.append('title', this.title);
                    //formData.append('content', this.content);
                    //formData.append('file', this.file, this.title, this.content);
                    fetch(uri, {
                        method: "POST",
                        headers: {
                            //'Accept': 'multipart/form-data',
                            //'Content-Type': 'multipart/form-data',
                            'Authorization': authValue
                        },
                        body: formData
                    })
                    .then(res => res.json());
                } 
            },
            validatePost(value, title, name, max) {
                if(value.length > max ) {
                    this.errors[name] = 'Le '+title+' doit faire moins de '+max+' caractères';
                } else {
                    this.errors[name] = '';
                }
            },
            fileUpload() {
                this.file = this.$refs.file.files[0];
                console.log(this.file);
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
        &__flexbox {
            display: flex;
            justify-content: space-evenly;
        }
        &__button {
            border: 2px solid #828282;
            border-radius: 10px;
            background-color: #fff;
            height: 30px;
            cursor: pointer;
            &--addImage {
                display: inline-block;
                box-sizing: border-box;
                padding: 5px 5px 0;
                background-color: #ff8080;
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
        }
    }
</style>