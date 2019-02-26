<template>
    <div>
        <div style="margin:20px">
            <el-date-picker
                v-model="startEndTime"
                type="daterange"
                range-separator="至"
                start-placeholder="登录时间(起)"
                end-placeholder="结束日期(止)">
            </el-date-picker>
            <el-select v-model="ruleForm.clientType" placeholder="客户端类型">
                <el-option
                    v-for="item in clientList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="ruleForm.storeId" placeholder="所属门店">
                <el-option
                    v-for="item in storeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="ruleForm.ios" placeholder="操作系统">
                <el-option
                    v-for="item in OS"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
            </el-select>

            <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium">搜索</el-button>
            <el-button @click="resetForm" size="medium">重置</el-button>
        </div>
        <el-table :data="dataSource" border fit highlight-current-row style="width: 100%;margin-left: 20px">
            <el-table-column align="center" label="登录时间" min-width="80">.
                <template slot-scope="scope">
                    <span>{{setTime(scope.row.loginTime)}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="IP地址" min-width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.ip}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="客户端类型" min-width="180">
                <template slot-scope="scope">
                    <span v-if="scope.row.clientType==1">app</span>
                    <span v-if="scope.row.clientType==2">微信端</span>
                    <span v-if="scope.row.clientType==3">web端</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="所属门店" min-width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.store}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作系统" min-width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.ios}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="登录来源" min-width="100">
                <template slot-scope="scope">
                    {{scope.row.loginType}}
                </template>
            </el-table-column>

            <el-table-column align="center" label="关键信息" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.keyMessage}}</span>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-container" style="text-align: left;margin-top: 10px;">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="ruleForm.pageNo"
                :page-sizes="[10,20,30, 50]"
                :page-size="ruleForm.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {
        userLoginList,
        findStoreByPlatformId
    } from '../../../api/getData';
    export default {
        data(){
            return{
                count: null,
                dataSource:[],
                ruleForm:{
                    pageNo:1,
                    pageSize:10,
                    stordId:'',
                    clientType:'',
                    ios:'',
                    startTime:'',
                    endTime:'',
                    id:''
                },
                offset:0,
                userId:'',
                startEndTime:'',
                clientList:[
                    {id:1,name:'app'},
                    {id:2,name:'微信端'},
                    {id:3,name:'web端'}
                ],
                OS:['IOS','Windows','MAC','Android','其他'],
                storeList:[]
            }
        },
        created(){
         this.ruleForm.id = this.$route.query.userId;
         this.userLoginList();
         this.findStoreAllInfo();
        },
        methods:{
           async userLoginList(){
               try {
                   let obj = new Object();
                   $.each(this.ruleForm, function (key, info) {
                       if (info != "") {
                           obj[key] = info;
                       }
                   })
                   const res = await userLoginList(obj);
                   if (res.data.code == 0) {
                       this.dataSource = res.data.data.list;
                       this.count = res.data.data.totalSize;
                       console.log(this.dataSource)
                   } else {
                       this.$message({
                           type: 'error',
                           message: res.data.error
                       });
                   }
               } catch (err) {
                   this.$message({
                       type: 'error',
                       message: '获取数据失败,请联系管理员！404'
                   });

               }
           },
            //搜索
            handleFilter(){
                if(this.startEndTime[0]!='' && this.startEndTime[0]!=undefined){
                    this.ruleForm.startTime =  this.setTimestamp(this.startEndTime[0]);
                }
                if(this.startEndTime[1]!='' && this.startEndTime[1]!=undefined){
                    this.ruleForm.endTime =  this.setTimestamp(this.startEndTime[1]);
                }
                this.userLoginList()
            },
            //重置
            resetForm(){
                this.ruleForm={
                    pageNo:1,
                    pageSize:10,
                    id:this.$route.query.userId,
                    stordId:'',
                    clientType:'',
                    ios:'',
                    startTime:'',
                    endTime:'',
                }
                this.userLoginList()
            },
            //分页
            handleSizeChange(val) {
                this.ruleForm.pageSize = val;
                this.userLoginList()
            },
            handleCurrentChange(val) {
                this.ruleForm.pageNo = val;
                this.offset = (val - 1) * this.ruleForm.pageSize;
                this.userLoginList()
            },
            //获取门店列表
            async findStoreAllInfo() {
                try {
                    const res = await findStoreByPlatformId();
                    if (res.data.code == 0) {
                        this.storeList = res.data.data;
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.error
                        });
                    }
                } catch (err) {
                    this.$message({
                        type: 'error',
                        message: '获取数据失败,请联系管理员！404'
                    });

                }
            },
            //时间戳转换
            setTime(time) {
                if(time!=null && time!=''){
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
                    return y + '-' + m + '-' + d +''+h+':'+f+':'+s;
                }else{
                    return ''
                }

            },
            //时间转换时间戳
            setTimestamp(time) {
                const t = new Date(time);
                return t.getTime()
            },

        }
    }
</script>

<style scoped>

</style>
