<template>
    <div id="set">


        <div class="cell_list">
            <div class="cell">
                <span class="cell_title">真实姓名</span>
                <b>{{userInfo.name}}</b>
            </div>

            <div class="cell">
                <span class="cell_title">所在部门</span>
                <b>{{userInfo.departmentName}}</b>
            </div>

            <div class="cell">
                <span class="cell_title">性别</span>
                <b v-if="userInfo.sex==0">女</b>
                <b v-else-if="userInfo.sex==1">男</b>
            </div>

            <div class="cell">
                <span class="cell_title">生日</span>
                <b>{{setTime(userInfo.birthday)}}</b>
            </div>
        </div>
    </div>


</template>

<script>
    import { MessageBox } from 'mint-ui';
    import {userByUserId} from '../../../api/getData';
    export default{

        data(){
            return {
                userInfo:{},
            }
        },
		components: {

        },
        created(){
            this.userByUserId();
        },
        methods:{
            async userByUserId() {
                try {
                    const res = await userByUserId({weiXinOpenId:this.$store.state.Cookie.mutations.fetch('openId')});

                    if (res.data.code == 0) {
                        this.userInfo = res.data.data;
                    } else {
                        Toast(res.data.data);
                    }

                } catch (err) {
                    Toast(err);
                }
            },
            //时间戳转换
            setTime(time) {
                const t = new Date(time);
                let y = t.getFullYear();
                let m = t.getMonth() + 1;
                let d = t.getDate();
                let h = t.getHours();
                let f = t.getMinutes();
                let s = t.getSeconds();
                if (m < 10) {
                    m = '0' + m
                }
                if (d < 10) {
                    d = '0' + d
                }
                if (h < 10) {
                    h = '0' + h
                }
                if (f < 10) {
                    f = '0' + f
                }
                if (s < 10) {
                    s = '0' + s
                }
                return y + '.' + m + '.' + d
            },



		}
    }
</script>

<style lang="scss" scoped>
$baseWidth:750px;
@function px($val) {
    @return $val/$baseWidth*10+rem;
}

.cell{
    background-color:#fff;
    height: px(88px);
    padding:0 px(24px);
    display: -ms-flexbox;
    display: flex;
    justify-content:space-between;
    align-items:center;
    border-bottom:1px solid #f4f4f4;
    span{
        display: inline-flex;
        align-items:center;
        font-size:px(28px);
        color:#323232;
    }
    b{
        font-size:px(28px);
        color:#323232;
    }

    i{
        margin-left:px(10px);
        color:#d4d4d4;;
    }
}
</style>
