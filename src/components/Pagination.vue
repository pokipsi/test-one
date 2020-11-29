<template>
  <div class="pagination" v-if="paginationStructure">
    <span v-for="num in paginationStructure.nums" :key="num.page">
      <a href="javascript:void(0)"
        @click.prevent="paginate(num.page)"
        :class="{ active: num.current }"
        v-if="num.type == 'button'">{{ num.page }}</a>
      <a v-if="num.type == 'delimiter'">...</a>
    </span>

    <span>
      <a href="javascript:void(0)"
        :class="{ 'disabled': page == 1 }"
        class="btn-pagination ml-8"
        v-if="pagesCount > 2"
        @click.prevent="paginate(page - 1)">
        <img src="../assets/img/chevron-left.svg" />
      </a>
    </span>

    <span>
      <a href="javascript:void(0)"
        :class="{ 'disabled': page == pagesCount }"
        class="btn-pagination ml-8"
        v-if="pagesCount > 2"
        @click.prevent="paginate(page + 1)">
        <img src="../assets/img/chevron-right.svg" />
      </a>
    </span>
  </div>
</template>

<script>

import { Pagination as PaginationLinksStructure } from '../pagination';

export default {
  props: {
    paginate: {
      type: Function,
      default: () => {}
    },
    pagesCount: {
        type: Number,
        required: true
    },
    page: {
        type: Number,
        required: true
    },
    paginationLength: {
        type: Number,
        default: 10
    },
  },
  computed: {
    paginationStructure() {
      const p = new PaginationLinksStructure({
        pagesCount: this.pagesCount,
        currentPage: this.page,
        paginationLength: this.paginationLength
      });
      return p.getStructure();
    }
  }
};
</script>

<style scoped lang="scss">
.pagination {
    padding: 8px;
    display: flex;
    align-items: center;
    >*:first-child {
      margin-left: auto;
    }
    a {
      padding: 0 4px;
      font-size: 12px;
      &.active {
        color: #333;
        cursor: default;
      }
    }
    .btn-pagination {
      border: 1px solid #ddd;
      font-size: 32px;
      border-radius: 3px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      &.disabled {
        background-color: #eee;
        cursor: default;
      }
      img {
        height: 18px;
      }
    }
  }
</style>