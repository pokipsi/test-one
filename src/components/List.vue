<template>
  <div class="list-wrapper">
    <div class="list-header">
      <strong>Gists</strong>
      <div class="list-filter">
        <span class="mr-8">Filter by date:</span> 
        <Datetime v-model="dateSince" type="datetime"></Datetime>
        <button class="btn-blue ml-8" v-show="dateSince" @click="() => dateSince = null">Clear</button>
      </div>
    </div>
    <div v-if="loading" class="loader-wrapper">
      <Spinner />
    </div>
    <ul ref="list">
      <ListItem
        v-for="item in items"
        :key="item.id"
        :text="item.file"
        :imgUrl="item.avatar"
        :active="selected && item.id == selected.id"
        :onClick="() => itemClicked(item)"
      />
    </ul>
    <Pagination :pagesCount="pagesCount" :page="page" :paginate="paginate" v-model="resultsPerPage" />
    <img :src="animation.avatar" class="animated-avatar" v-for="animation in activeAvatars" :key="animation.id" />
  </div>
</template>

<script>

import ListItem from "./ListItem";
import Spinner from "./Spinner";
import parse from "parse-link-header";
import Pagination from "./Pagination";

import { Datetime } from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'

export default {
  name: "List",
  components: {
    ListItem,
    Spinner,
    Datetime,
    Pagination
  },
  data: () => {
    return {
      items: [],
      selected: null,
      showAvatar: false,
      activeAvatars: {},
      loading: false,
      page: 1,
      resultsPerPage: 30,
      dateSince: null,
      pagesCount: 0
    };
  },
  beforeMount() {
    this.getItems();
  },
  methods: {
    itemClicked(item) {
      this.selected = this.selected && this.selected.id == item.id ? null : item;
      if(this.selected) {
        this.activeAvatars[item.id] = { ...item };
      }
      setTimeout(() => {
        delete this.activeAvatars[item.id];
      }, 1300);
    },
    endpoint() {
      return `https://api.github.com/gists/public?page=${this.page}&per_page=${this.resultsPerPage}${ this.dateSince ? '&since=' + this.dateSince : '' }`;
    },
    paginate(page) {
      if (page > 0 && page <= this.pagesCount) {
        this.page = page;
      }
    },
    getPaginationData(data) {
      let found = false;
      data.headers.forEach((value, name) => {
        if(name == "link") {
          found = true;
          this.paginationData = value ? parse(value) : null;
        }
      });
      if (! found) { 
        this.paginationData = null;
        this.pagesCount = 1; 
      }
      if(this.paginationData && this.paginationData.last) {
        this.pagesCount = Number(this.paginationData.last.page);
      }
    },
    getItems() {
      this.loading = true;
      fetch(this.endpoint())
        .then(data => {
          this.getPaginationData(data);
          return data.json();
        })
        .then(data => {
          this.items = data.map(item => {
            return {
              id: item.id,
              avatar: item.owner.avatar_url,
              file: Object.values(item.files).length ? Object.values(item.files)[0].filename : '<UNKNOWN>'
            };
          });
        })
        .finally(() => {
          this.loading = false;
          if(this.$refs.list) this.$refs.list.scrollTop = 0;
        });
    }
  },
  watch: {
    page: function() {
      this.getItems();
    },
    dateSince: function() {
      this.page = 1;
      this.getItems();
    },
    resultsPerPage: function() {
      this.page = 1;
      this.getItems();
    }
  }
};
</script>

<style scoped lang="scss">
.list-wrapper {
  position: relative;
  
  .list-header {
    font-size: 15px;
    background-color: #f3f3f3;
    padding: 6px 16px;
    display: flex;
    align-items: center;
    .list-filter {
      align-items: center;
      display: flex;
      margin-left: auto;
    }
  }
  ul {
    padding: 0 16px;
    overflow-y: scroll;
    scroll-behavior: smooth;
  }
  ul {
    height: calc(100vh - 200px);
  }
}

.loader-wrapper {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}
.animated-avatar {
  position: absolute;
  width: 400px;
  height: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  animation: avatar 1.25s;
  animation-fill-mode: forwards;
}

@keyframes avatar {
  0% {
    opacity: 0;
    width: 300px;
    height: 300px;
  }
  20% {
    opacity: 0.9;
    width: 400px;
    height: 400px;
  }
  80% {
    opacity: 1;
    width: 400px;
    height: 400px;
  }
  90% {
    opacity: 0;
    width: 300px;
    height: 300px;
  }
  100% {
    opacity: 0;
    width: 0;
    height: 0;
  }
}

.loader-wrapper {
  background-color: fade-out(#fff, 0.2);
  transition: "background-color" 1s ease-in;
}
  
</style>

