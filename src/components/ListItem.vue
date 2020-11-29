<template>
  <li :class="{ 'active': active }" @click="onClick">
    <img :src="imgUrl" />
    {{ text }}
  </li>
</template>

<script>
export default {
  props: {
    text: {
      type: String
    },
    imgUrl: {
      type: String
    },
    active: {
      type: Boolean,
      default: false
    },
    onClick: {
      type: Function,
      default: () => {}
    }
  }
};
</script>

<style scoped lang="scss">
li {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eaeaea;
  img {
    width: 74px;
    height: 74px;
    margin: 12px 16px 12px 0;
  }
  &:hover {
    cursor: pointer;
  }
  &.active {
    color: #06a9f6;
    img {
      filter: brightness(50%);
    }
  }
}
</style>