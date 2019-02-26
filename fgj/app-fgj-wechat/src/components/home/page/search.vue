<template>
    <div id="header" :style="'height:'+wrapperHeight+'px'">
        <div class="head">
            <ul>
                <li>
                    <div style="float:left;position:absolute;line-height:30px;" @click="routerBack">
                        <i class="iconfont icon-fanhui"></i>
                    </div>
                </li>
            </ul>
            <div class="search_input">
                <div class="search_input_input">
                    <i></i>
                    <input class="keyWord" type="text" @keyup.enter="search()" v-model="goodsName" placeholder="搜索商品" list="topSrarch"/>
                    <i class="closeSearch" @click="goodsName='';" v-if="goodsName!=''"></i>
                    <!-- <datalist id="topSrarch">
                        <option :value="info" v-for="info in searchHistoryList"></option>
                    </datalist> -->
                </div>
                <div class="search_input_btn" @click="search">搜索</div>
            </div>
        </div>
        <div id="middle">
            <div class="margin">
                <div id="search">
                    <div>
                        <span class="hotSearch">热门搜索</span>
                        <p><span v-for="info in hotSearchList" @click="topSearchClick(info.name)">{{info.name}}</span></p>
                        <!-- <p><span v-for="n in 20">选项{{n}}</span></p> -->
                    </div>
                    <div style="width:100%;height:10px;background:#f4f4f4;"></div>
                    <div class="history" v-if="searchList.length>0">
                        <span class="historySearch">历史搜索</span><i @click="deleteHistory"></i>
                        <p class="historyList"><span v-for="info in searchList" @click="historySearchClick(info)">{{info}}</span></p>
                        <!-- <p class="historyList"><span v-for="n in 20">选项{{n}}</span></p> -->
                    </div>
                </div>
                <!-- <div id="cart" @click="skipShopcart">
                    <i></i>
                    <span>我的购物车</span>
                </div> -->
            </div>
        </div>

    </div>
</template>

<script>
    import {findStartTopSearchAll} from '../../../api/getData';
    export default{
        data(){
            return {
                wrapperHeight:'',
                userInfo:{},
                tabList:[],
                checkId:'',
                pageNo:1,
                categoryList:[],
                goodsName:'',
                count:'',
                searchList:[],
                hotSearchList:[],
                // showHistoryList:[],
                // searchHistoryList:[],
                storeId:'',
                key:'',
                value:''
            }
        },
        components: {

        },
        created() {
            console.log(this.$route.query)
            this.goodsName = this.$store.state.searchName;
            this.storeId=this.$store.state.Cookie.mutations.fetch('storeId');
            this.$store.state.Cookie.mutations.save('','type');
            this.findStartTopSearchAll();
            this.insertToHistoryList();
        },
        mounted(){
            this.wrapperHeight = document.documentElement.clientHeight;
        },
        watch:{
            "$route": {
                handler(curVal,oldVal){
                    // console.log(curVal);
                },
                deep:true
            },
        },
        methods:{
            //热搜搜索
            async findStartTopSearchAll(){
                //获取用户信息
                try {
                    const res = await findStartTopSearchAll();

                    if (res.data.code == 0) {
                        this.hotSearchList = res.data.data.topSearchs;

                    } else {
                        this.$message({
                            message: res.data.error,
                            type: 'error'
                        });
                    }

                } catch (err) {
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                }

            },

            linkSkip(obj){
                if(obj.linkType == 3){

                }else if(obj.linkType == 1){
                    if(obj.linkId == 5){
                        this.$router.push('shop/category');
                    }else{
                    }
                }else if(obj.linkType == 2){

                    window.open(obj.linkUrl);
                }else if(obj.linkType == 4){
                  this.$store.dispatch("setSearchName",this.goodsName);
                  this.$router.push("/cmsGoodsList/-1/2/7/0");
                    // this.$router.push('/goodsList/'+obj.linkId+'/2');
                }else if(obj.linkType == 5){
                    if(obj.suCompanyAvailable){
                        if(obj.suTmplId==1){
                            this.$router.push('/card/'+obj.linkId);
                        }else if(obj.suTmplId==2){
                            this.$router.push('/goods/'+obj.linkId);
                        }else if(obj.suTmplId==3){
                            this.$router.push('/goods2/'+obj.linkId);
                        }else if(obj.suTmplId==4){
                            this.$router.push('/moreCredit/'+obj.linkId);
                        }
                    }
                }else if(obj.linkType == 6){

                }else if(obj.linkType == 7){
                    this.$router.push('/mall/'+obj.linkId);
                }
            },
            //搜索
            search(){
                var regu = "^[ ]+$";
                var re = new RegExp(regu);
                if(this.goodsName == '' || re.test(this.goodsName)){
                    return;
                }else{
                    this.searchHistory(this.goodsName);
                    this.$store.dispatch("setSearchName",this.goodsName);
                    this.$store.state.Cookie.mutations.save(true,'fromSearch');
                    this.$router.push("/cmsGoodsList/-1/2/7/0");
                    // this.$router.push("/searchGoodsList/"+this.goodsName);
                }
            },
            //历史搜索
            historySearchClick(name){
                var regu = "^[ ]+$";
                var re = new RegExp(regu);
                if(name == '' || re.test(name)){
                    return;
                }else{
                    this.searchHistory(name);
                  this.$store.dispatch("setSearchName",name);
                  this.$store.state.Cookie.mutations.save(true,'fromSearch');
                  this.$router.push("/cmsGoodsList/-1/2/7/0");
                    // this.$router.push("/searchGoodsList/"+name);
                }
            },
            //热搜搜索
            topSearchClick(name){
                var regu = "^[ ]+$";
                var re = new RegExp(regu);
                if(name == '' || re.test(name)){
                    return;
                }else{
                    this.searchHistory(name);
                  this.$store.dispatch("setSearchName",name);
                  this.$store.state.Cookie.mutations.save(true,'fromSearch');
                  this.$router.push("/cmsGoodsList/-1/2/7/0");
                    // this.$router.push("/searchGoodsList/"+name);
                }
            },
            //历史搜索(上限为20条历史记录)
            searchHistory(search_value){
                var len=20;  //设定存储的历史记录个数
                var _this = this;
                if(search_value!=""&&!this.judgeRepeat(search_value)){
                    if(localStorage.getItem('searchHistory')!=null && localStorage.getItem('searchHistory')!=''){

                        this.insertToHistoryList();
                        if(JSON.parse(localStorage.getItem('searchHistory')).length<len)
                        {
                            this.searchList.push(search_value)
                            localStorage.setItem('searchHistory',JSON.stringify(this.searchList));
                        }else{
                            this.searchList.shift();
                            this.searchList.push(search_value);
                            localStorage.setItem('searchHistory',JSON.stringify(this.searchList));
                        }

                    }else{
                            this.searchList.push(search_value)
                            localStorage.setItem('searchHistory',JSON.stringify(this.searchList));
                    }
                }
                // $.each(this.searchList,function (key,info) {
                //   if(search_value == info){
                //     _this.key = key;
                //   }
                // })
                // console.log(this.searchList.splice(this.key,1)[0]);
                // this.value = this.searchList.splice(this.key,1)[0];
                // console.log(this.searchList.push(this.value))

            },
            //如果搜索结果与本地存储相同，则不行存储
            judgeRepeat(search_value){
                var repeat_bool=false;
                // if(JSON.parse(localStorage.getItem('searchList'))==null || JSON.parse(localStorage.getItem('searchList'))==''){
                if(localStorage.getItem('searchHistory')==null || localStorage.getItem('searchHistory')==''){
                    return false;
                }else{
                    for(var key in localStorage.getItem('searchHistory')){
                        if(search_value==JSON.parse(localStorage.getItem('searchHistory'))[key])
                        {
                            return true;
                        }
                    }
                }
            },
            //将搜索结果插入到历史记录中
            insertToHistoryList(){
                if(localStorage.getItem('searchHistory')!=null && localStorage.getItem('searchHistory')!=''){
                    this.searchList = JSON.parse(localStorage.getItem('searchHistory'));
                }else{
                    this.searchList = [];
                }
            },

            deleteHistory(){
                this.searchList = [];
                localStorage.setItem('searchHistory',JSON.stringify(this.searchList));
            },

            routerBack(){
              // if(this.$store.state.Cookie.mutations.fetch('fromCms')){
              //   this.$store.state.Cookie.mutations.save(false,'fromCms');
                this.$router.push('/home');
              // }else {
              //   this.$router.go(-1);
              // }
            },
		    }
    }
</script>

<style lang="scss" scoped>
@import "../../../style/home/search.scss";
</style>
