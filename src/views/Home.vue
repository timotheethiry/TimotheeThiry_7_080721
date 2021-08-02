<template>
    <section class="main__container">
        <div class="user">
            <userProfile />
        </div>

        <div class="posts">
            <h1 class="posts__heading">Lorem ipsum dolor sit amet.</h1>
            <newPost />
            <postList />
        </div>
    </section>
</template>

<script>
// @ is an alias to /src
import newPost from '@/components/newPost.vue'
import userProfile from '@/components/userProfile.vue'
import postList from '@/components/postList.vue'

export default {
  name: 'Home',
  components: {
    newPost,
    userProfile,
    postList
  }
}
</script> 

<style scoped lang="scss">

    .main__container {
        display: flex;
        justify-content: space-evenly;
        padding: 1rem;
        background-color: #ffeeee;
    }

    .user {
        width: 40%;
        max-width: 330px;
        height: 500px;
        margin: 0 1rem 0 0;
        background-color: #fff;
        text-align: center;
        box-shadow: 0px 0px 5px #bdbdbd;
        position: relative;
    }
        
    .posts {
        width: 60%;
    }

    @media screen and (max-width: 700px) {

        .main__container {
            flex-direction: column;
        }

        .user {
            width: 100%;
            max-width: 330px;
            margin: 0 auto;
            height: max-content;
        }

        .posts {
            width: 100%;
        }
    }

</style>
