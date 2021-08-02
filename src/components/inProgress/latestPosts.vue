<template>
    <div class="posts__section">
        <h2 class="posts__subheading">Posts récents</h2>
        <div v-for="(post, key) in latestPosts" :key="key" class="latest__item">
            <a href="post.html"><h3 class="post__title"> {{ latestPosts[key].title }} </h3></a>
            <p> {{ latestPosts[key].postedBy }} || {{ latestPosts[key].issued }} </p>
        </div>
      </div>
</template>

<script>
</script>

<style>
</style>