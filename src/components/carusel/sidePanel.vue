<template>
  <div class="side-panel center">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "sidePanel",
};
</script>

<style>
.side-panel {
  display: flex;
  flex-direction: column;
  padding-top: 36px;
  align-items: center;
  z-index: 25;
}
</style>
