<template>
  <div id="app">
    <div class="container">
      <List />
    </div>
  </div>
</template>

<script>
import List from './components/List.vue'

export default {
  name: 'App',
  components: {
    List
  }
}
</script>

<style lang="scss">

  ::-webkit-scrollbar {
      width: 12px;
      height: 12px;
  }

  ::-webkit-scrollbar-track {
      background: #eee;
  }

  ::-webkit-scrollbar-thumb {
      background: #aaa;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  #app {
    display: flex;
    justify-content: center;
    padding-top: 64px;
    height: calc(100vh - 64px);
  }

  .container {
    width: 1000px;
  }

  .mr-8 {
    margin-right: 8px !important;
  }
  .ml-8 {
    margin-left: 8px !important;
  }
  .ml-auto {
    margin-left: auto !important;
  } 
  .mr-auto {
    margin-right: auto !important;
  } 

  a {
    text-decoration: none;
    color: #06A9F6;
    &:hover {
      color: #055c85;
    }
  }

  button {
    border: none;
    color: white;
    border-radius: 2px;
    padding: 4px 8px;
    &.btn-blue {
      background-color: #055c85;
      &:hover {
        background-color: darken(#055c85, 5%);
        cursor: pointer;
      }
    }
  }

  select {
    background-color: white;
    border: 1px solid #ddd;
    cursor: pointer;
  }

  

</style>