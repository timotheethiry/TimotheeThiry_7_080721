<template>
  <div id="app">
    <header class="header">
        <div class="header__container">
            <img class="header__logo" src="../src/assets/icon-left-font.png" alt="Gropomania logo">
            <img class="header__logo--small" src="../src/assets/icon.png" alt="Gropomania logo">
        </div>
        <router-link to="/">Home</router-link>
        <router-link to="/auth">Auth</router-link>
        <router-link to="/post">Post</router-link>

        <nav class="header__container">
            <ul class="header__ul">
                <a href="index.html"><li class="header__li">Se déconnecter<span class="fas fa-power-off"></span></li></a>
            </ul>
        </nav>
    </header>
    <router-view />
  </div>  
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      logoHeader: "",
      logoHeaderSmall: ""
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.header {
    height: 100px;
    display: flex;
    align-items: center;
    &__container {
        width: 50%;
    }
    &__logo {
        margin: 0 auto;
        width: 300px;
        height: 100px;
        object-fit: cover;
    }
    &__logo--small {
        display: none;
        margin: 0 auto;
        width: 60px;
        height: 60px;
    }
    &__ul {
        display: flex;
        justify-content: center;
    }
    &__li {
        width: 100px;
        text-align: center;
    }
}

</style>
