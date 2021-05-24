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
  padding-top: 40px;
  height: 100%;
  align-items: center;
  z-index: 25;
}
.side-panel > * {
  margin: 4px;
}
</style>
