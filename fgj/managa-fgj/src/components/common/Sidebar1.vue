<template>
    <div class="sidebar">

        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" unique-opened router v-if="items.length">
            <div v-for="item in items" :key="item.id">
                <template v-if="item.children">
                    <el-submenu :index="'/'+item.index">
                        <template slot="title"><icon v-if="item.icon!=''" :name="item.icon" style="padding:0px 5px;width:1rem;height:1rem;"></icon>{{item.title}}</template>
                        <el-menu-item :index="'/'+item.index"  v-if="!item.children" v-for="item in item.children" :key="item.id"><icon v-if="item.icon!=''" :name="item.icon" style="padding:0px 5px;width:1rem;height:1rem;"></icon>{{item.title}}</el-menu-item>
                        <el-submenu :index="'/'+item.index" v-for="item in item.children" v-if="item.children" :key="item.id">
                            <template slot="title"><icon v-if="item.icon!=''" :name="item.icon" style="padding:0px 5px;width:1rem;height:1rem;"></icon>{{item.title}}</template>
                            <el-menu-item :index="'/'+item.index" v-for="item in item.children" v-if="!item.children" :key="item.id"><icon v-if="item.icon!=''" :name="item.icon" style="padding:0px 5px;width:1rem;height:1rem;"></icon>{{item.title}}</el-menu-item>
                                <el-submenu :index="'/'+item.index" v-for="item in item.children" v-if="item.children" :key="item.id">
                                    <template slot="title"><icon v-if="item.icon!=''" :name="item.icon" style="padding:0px 5px;width:1rem;height:1rem;"></icon>{{item.title}}</template>
                                    <el-menu-item :index="'/'+item.index" v-for="item in item.children" v-if="!item.children" :key="item.id"><icon v-if="item.icon!=''" :name="item.icon" style="padding:0px 5px;width:1rem;height:1rem;"></icon>{{item.title}}</el-menu-item>
                                    <el-submenu :index="'/'+item.index" v-for="item in item.children" v-if="item.children" :key="item.id">
                                    <template slot="title"><icon v-if="item.icon!=''" :name="item.icon" style="padding:0px 5px;width:1rem;height:1rem;"></icon>{{item.title}}</template>
                                    <el-menu-item :index="'/'+item.index" v-for="item in item.children" v-if="!item.children" :key="item.id"><icon v-if="item.icon!=''" :name="item.icon" style="padding:0px 5px;width:1rem;height:1rem;"></icon>{{item.title}}</el-menu-item>
                                </el-submenu>
                            </el-submenu>
                        </el-submenu>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item v-if="item.icon!=''" :index="'/'+item.index"><icon :name="item.icon" style="padding:0px 5px;width:1rem;height:1rem;"></icon>{{item.title}}</el-menu-item>
                </template>

            </div>

        </el-menu>


    </div>
</template>

<script>
    import { getAdminMemu } from '../../api/getData';

    export default {
        data() {
            return {
                items: []
            }
        },
        created () {
        	this.memuListAjax();

        },
        computed:{
           onRoutes(){

                return `/${this.$route.path.replace('/','')}`;
            }
        },
        methods:{
        	async memuListAjax () {
                try {
                    const res = await getAdminMemu()
                    if(res.data.code == 0){
                        this.items = res.data.data;

                    }else{
                        this.$message({
                            type: 'error',
                            message: "登录超时！请重新登录!"
                        });
                        this.$store.state.Cookie.mutations.delete()
                        this.$router.push('login')
                    }
                } catch (err) {
                    console.log(err)
                    this.$message({
                        type: 'error',
                        message: '获取数据失败,请联系管理员！404'
                    });

                }
        	}
        }

    }
</script>

<style>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #f6f8f9;
    }
    .sidebar > ul {
        height:100%;

        overflow:auto;
    }
    [v-cloak] {
   	  display: none;
 	}
    .el-submenu .el-menu{
         border-left:5px solid #ff8546;
     }
</style>
