<template>
    <div class="verify">
      <iframe :src="url"></iframe>
    </div>
</template>

<script>
    export default {
        data(){
          return{
            url:''
          }
        },
        created(){
          this.url = this.$store.state.Cookie.mutations.fetch('shortUrl');
          console.log(this.url);
        },
        methods:{

        }
    }
</script>

<style lang="scss" scoped>
.verify{
  width: 100%;
  height: 100%;
  iframe{
    width: 100%;
    height:100%;
  }
}
</style>
