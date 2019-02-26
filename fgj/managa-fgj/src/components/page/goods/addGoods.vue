<template>
    <div id="example">
        <el-steps :space="300" style="" :active="active" finish-status="success" simple>
            <el-step title="选择所属产品"></el-step>
            <el-step title="编辑商品信息"></el-step>
            <el-step title="新建商品完成"></el-step>
        </el-steps>

        <template v-if="active==0">
            <product-list @toparentevent="next1"></product-list>
        </template>

        <template v-else-if="active==1">
            <edit-goods ref="profile" @toparentevent1="next2" @returnOnProduct="returnOnProductList"></edit-goods>
        </template>

        <template v-if="active==2">
            <img src="../../../assets/success.jpg" />
            <div><el-button size="medium" style="margin-top: 12px;">完成</el-button></div>
        </template>

    </div>

</template>



<script>
import productList from './productList.vue';
import editGoods from './editGoods.vue';
import {} from '../../../api/getData';
export default {
    data() {
        return {
            active : 0,
            productId:'',
        }
    },
    created () {

    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                let str = curVal.path;
                str = str.substring(0,15)
                if(str == "/goods/addGoods"){
                    Object.assign(this.$data, this.$options.data())
                }

　　　　　　 },
            deep:true
        }

    },
    components: {
        productList,editGoods
    },
    computed: {

    },
    methods:{
        next1(id) {
            this.productId = id;
            this.active++;
            this.$nextTick(() => {
                this.$refs.profile.merchantProductViwe(this.productId);
            });

        },
        next2() {
            this.active++;
        },
        returnOnProductList(){
            this.active--;
        }
    }


}
</script>

<style scoped>
#example {
    padding: 10px 20px;
    text-align:center;
}
</style>


