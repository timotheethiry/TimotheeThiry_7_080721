<template>
    <div class="newPost">
        <h2 class="newPost__subheading">Faites parler votre clavier</h2>

        <input class="newPost__title" type="text" max="150" name="title" id="title">
        <textarea class="newPost__content" type="textarea" name="content" id="content" rows="3" cols="100" placeholder="Quoi de neuf ?"></textarea>
        
        <button class="newPost__button newPost__button--addImage">Ajouter une image</button>
        <button class="newPost__button">Post<span class="fas fa-paper-plane"></span></button>
    </div>
</template>

<script>
export default {
    name: 'newPost'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.newPost {
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
</style>