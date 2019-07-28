<template>
  <div id="app">
    <div id="cover"></div>
    <Header></Header>
    <todo></todo>
    <Footer></Footer>
  </div>
</template>
<script>
import Header from './layout/header';
import Footer from './layout/footer';
import Todo from './views/todo/todo';

export default {
  components: {
    Header,
    Footer,
    Todo
  }
};
</script>
<style lang="stylus" scoped>
#app {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

/* 背景虚化 */
#cover {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #999;
  opacity: 0.8;
  z-index: -1;
}
</style>
