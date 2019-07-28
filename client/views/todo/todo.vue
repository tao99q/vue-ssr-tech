<template>
    <section>
        <input type="text"
               class="add-input"
               autofocus="autofocus"
               placeholder="接下要做什么?"
               @keyup.enter="addTodo"
        >
        <item :todo="todo"
              v-for="todo in filteredTodos"
              :key="todo.id"
              @del="deleteTodo"
        />

        <tabs :filter="filter"
              :todos="todos"
              @toggle="toggleFilter"
              @clearAll="clearAll"
        />
    </section>
</template>

<script>
  import Item from './item';
  import Tabs from './tabs';

  let id = 0;

  export default {
    data() {
      return {
        todos: [],
        filter: 'all',
      }
    },
    computed: {
      filteredTodos() {
        if (this.filter === 'all') {
          return this.todos;
        }
        const completed = this.filter === 'completed';
        return this.todos.filter(todo => todo.completed === completed);
      }
    },
    components: {
      Item,
      Tabs,
    },
    methods: {
      addTodo(e) {
        if (!e.target.value) {
          return;
        }
        this.todos.unshift({
          id: id++,
          content: e.target.value.trim(),
          completed: false,
        });
        e.target.value = '';
      },
      deleteTodo(id) {
        console.log(id);
        this.todos.splice(this.todos.findIndex(todo => todo.id === id), 1);
        // this.todos = this.todos.filter(todo => todo.id !== id);
      },
      toggleFilter(state) {
        this.filter = state;
      },
      clearAll() {
        this.todos = this.todos.filter(todo => !todo.completed);
      }
    }
  }
</script>

<style lang="stylus" scoped>
    .real-app {
        width 600px
        margin 50px auto 0
        box-shadow 0 0 5px #666666
    }

    .add-input {
        position: relative;
        margin: 0;
        width: 100%;
        font-size: 24px;
        font-family: inherit;
        font-weight: inherit;
        line-height: 1.4em;
        border: 0;
        outline: none;
        color: inherit;
        box-sizing: border-box;
        font-smoothing: antialiased;
        padding: 16px 16px 16px 36px;
        border: none;
        box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
    }

    .none-items {
        margin: 0;
        width: 100%;
        font-size: 24px;
        font-family: inherit;
        font-weight: inherit;
        text-align center
        line-height 6rem;
        background-color #fff;
    }

    .have-items {
        min-height 6rem
        background-color #fff;
    }
</style>