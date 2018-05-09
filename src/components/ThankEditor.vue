<template>
  <div class="thankEditor" :class="{htmlMode:enableHtml}" ref="container">
    <div v-if="enableHtml" v-html="result"></div>
    <pre v-else>{{result}}</pre>
  </div>
</template>

<script>
  import marked from 'marked'
  export default {
    props: ['markdown', 'enableHtml'],
    name: 'ThankEditor',
    computed: {
      result: function () {
        return this.enableHtml ? marked(this.markdown) : this.markdown
      }
    },
    methods: {
      goBottom: function () {
        this.$refs.container.scrollTop = 100000
      },
      goTop: function(){
        this.$refs.container.scrollTop = 0
      }
    }
  }

</script>

<style scoped>

  @media (max-width:500px){
    .thankEditor{
    }
  }
  .htmlMode {
    animation: flip 2s;
  }

  @keyframes flip {
    from {
      opacity: 0.5;
    }
    to {
      opacity: 0.5;
    }
  }
</style>
