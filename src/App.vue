<template>
  <div id="app">
    <header class="header">
        <div class="header__container">
            <img class="header__logo" src="../src/assets/icon-left-font.png" alt="Gropomania logo">
            <img class="header__logo--small" src="../src/assets/icon.png" alt="Gropomania logo">
        </div>

        <div v-if="isLogged" class="header__container">
            <a @click="logout" class="header__link">Se déconnecter</a>
        </div>
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
      logoHeaderSmall: "",
      isLogged: this.checklogged(),
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      this.$router.push("/auth");
    },
    checklogged() {
      const token = localStorage.getItem('token');
      if (token) {
        return this.isLogged = true;
      } else {
        return this.isLogged = false;
      }
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
      max-height: 100px;
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
      &__link {
        &:hover {
            cursor: pointer;
            text-decoration: underline; 
          }
          &:active {
              font-weight: bold;
          }
      }
  }

  @media screen and (max-width: 700px) {

    .header {
      display: block;
      &__container {
        width: 100%;
      }
      &__logo {
          display: none;
      }
      &__logo--small {
          display: block;
      }
      &__link {
        display: none;
      }
    }
  }

</style>