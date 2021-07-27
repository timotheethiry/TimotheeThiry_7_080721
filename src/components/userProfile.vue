<template>
    <div class="user__profile">
        <span class="user__avatar"><img src="" alt="User avatar"></span>
        <p class="user__name"> {{ user.name }} </p>
        <p class="user__email"> {{user.email }} </p>
        <button @click="deleteConfirm" class="user__delete"><span class="fas fa-trash-alt"></span>Supprimer mon compte</button>
    </div>
</template>

<script>
export default {
    name: 'userProfile',
    data() {
        return {
            user: {
                name: "John Smith",
                email: "john.smith@gmail.com",
                avatar: "fas fa-user-tie"
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.user {
    &__profile {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        padding: 2rem;
        width: 200px;
        height: 250px;    
    }
    &__avatar {
        font-size: 70px;
    }
    &__delete {
        border-radius: 10px;
        background-color: #ececec;
        color: #000;
        height: max-content;
    }
}

</style>