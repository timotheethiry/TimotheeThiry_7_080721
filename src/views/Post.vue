<template>
    <section class="main__container">
        <div class="user">
            <userProfile />
        </div>

        <div class="posts">
            <Posted />
        </div>
    </section>
</template>

<script>

import userProfile from '@/components/userProfile.vue'
import Posted from '@/components/posted.vue'

export default {
    name: 'Post',
    components: {
        Posted,
        userProfile
    },
    data() {
        return {
            post: {},
            postInfo: "",
            toModify: false,
        }
    },
}
</script> 

<style scoped lang="scss">

.main__container {
    display: flex;
    padding: 1rem;
    background-color: #ffeeee;
}

.user {
    width: 20%;
    height: 500px;
    margin: 2.5rem 2rem 0 8rem;
    background-color: #fff;
    text-align: center;
    box-shadow: 0px 0px 5px #bdbdbd;
    position: relative;
}

.posts {
    width: 60%;
    margin: auto;
}

</style>
