<template>
  <router-view></router-view>
</template>

<script>
export default {
  mounted() {
    console.log("Component mounted.");
  }
};
</script>

<style>
  html { overflow-y: auto }
</style>