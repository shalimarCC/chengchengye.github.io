<template>
  <el-tabs v-model="tabName" editable @edit="handleTabsEdit" @tab-click="onTabClick" @tab-remove="onTabRemove" type="border-card"   >
    <el-tab-pane v-for="(item, index) in options" :key="index" :name="item.path" :label="item.name">

    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data() {
    return {
      editableTabsValue:this.$store.state.activeTab,
      tabIndex: 1,
      tabName:''
    }
  },
  computed: {
      options(){
         return this.$store.state.tabList;
      }
  },
  created(){
    this.tabName = this.$route.path;
  },
  watch : {
        "$route": {
            handler(curVal,oldVal){
                this.tabName = curVal.path;
　　　　　　 },
            deep:true
        }

    },
  methods: {
    handleTabsEdit(targetName) {
      let tabs = this.options;
      let activeName = this.$route.path;
      if(targetName == "/readme"){
        return;
      }

      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.path === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.path;
            }
          }
        })
      }

      this.$store.dispatch("editTabList",tabs.filter(tab => tab.path !== targetName));

      this.$router.push(activeName);

    },
    onTabClick(targetName) {
      this.$router.push(targetName.name);
    },
    onTabRemove (targetName) {
      console.log(this.$router)
    }
  }
}
</script>

<style>
.el-tabs--border-card>.el-tabs__content{
    padding:0;
}
</style>
