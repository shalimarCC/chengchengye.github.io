<template>
    <div id="example">
        <template v-if="active==1">
            <el-form ref="form" :rules="rules" :model="form" label-width="180px" class="addNewAct">
                <el-form-item label="活动名称" prop="exchangeName">
                    <el-input class="filter-item" placeholder="请输入活动名称" maxlength="10" v-model="form.exchangeName"></el-input>
                </el-form-item>
                <el-form-item label="截止日期" prop="endDay">
                    <el-date-picker v-model="form.endDay" type="date" placeholder="选择日期" @change="endDayves">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="请选择可以兑换的旧批次" required>
                    <div>
                        <span>已选择{{dynamicTags.length}}个批次</span>
                        <el-button size="small" @click="handleChooseOld">选择</el-button>
                    </div>
                    <el-tag
                    v-for="tag in dynamicTags"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{tag.title + tag.titleStr}}
                    </el-tag>
                </el-form-item>
                <el-form-item label="请选择可以兑换的新批次" required>
                    <div>
                        <span>已选择{{tableData.length}}个批次</span>
                        <el-button size="small" @click="handleChooseNew">选择</el-button>
                    </div>
                    <p class="tipText">数字表示在客户端显示的顺序，数字越大越靠前，数字不能重复。</p>
                    <el-table v-if="tableData && tableData.length>0" :data="tableData" border style="width:100%" :show-header="false" class="newTableList">
                        <el-table-column width="150">
                            <template slot-scope="scope">
                                {{scope.row.title}}
                            </template>
                        </el-table-column>
                        <el-table-column width="80">
                            <template slot-scope="scope">
                                加价￥<el-input width="30" @change="inputNum" v-model="scope.row.addPrice"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column width="80">
                            <template slot-scope="scope">
                                序号<el-input width="30" @change="inputNum" v-model="scope.row.sort"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="请选择可兑换的优惠券Unit状态" required>
                    <el-checkbox-group v-model="form.unitStatus">
                        <el-checkbox label="0">未使用</el-checkbox>
                        <el-checkbox label="3">已过期</el-checkbox>
                        <el-checkbox label="4">已失效</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSave">保存</el-button>
                </el-form-item>
            </el-form>
            <!-- 选择新优惠券批次弹框 -->
            <el-dialog class="forListOut" title="请选择可以兑换的新批次" :visible.sync="dialogVisible1" width="60%" center>
                <!-- 查询 -->
                <div class="searchBox">
                    <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="优惠券批次" v-model="ruleForm.couponBatchCode">
                    </el-input>
                    <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="优惠券组/标题" v-model="ruleForm.title">
                    </el-input>
                    <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="批次名称" v-model="ruleForm.couponBatchName">
                        </el-input>
                    <el-button type="primary" @click="searchList">查询</el-button>
                </div>
                <el-checkbox-group v-model="tagListNew">
                <el-table ref="selectednew" :data="tableForNewDate" height="500" border highlight-current-row style="width: 100%" @selection-change="handleSelectionChange" :row-key="getRowKeys">
                    <el-table-column align="center" width="30">
                        <template slot-scope="scope">
                            <el-checkbox :label="scope.row.id">1</el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="优惠券批次" width="150">
                        <template slot-scope="scope">
                            <span>{{scope.row.couponBatchCode}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="批次名称" width="150">
                        <template slot-scope="scope">
                            <span>{{scope.row.couponBatchName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="优惠券组/标题" width="150">
                        <template slot-scope="scope">
                            <span>{{scope.row.title}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="领取类型" width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.getType==0">手动扫码</span>
                            <span v-if="scope.row.getType==1">注册领取</span>
                            <span v-if="scope.row.getType==2">unit领取</span>
                            <span v-if="scope.row.getType==3">以旧换新</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="优惠券类型" width="150">
                        <template slot-scope="scope">
                            <span v-if="scope.row.couponType==0">满减券</span>
                            <span v-if="scope.row.couponType==1">兑换券</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="优惠内容" width="150">
                        <template slot-scope="scope">
                            <span>{{scope.row.detail}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="是否前端显示" width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.isDisplay==0">否</span>
                            <span v-if="scope.row.isDisplay==1">是</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="可领取日期" width="150">
                        <template slot-scope="scope">
                            <span>{{scope.row.receivedRange}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="有效周期" width="150">
                        <template slot-scope="scope">
                            <span>{{scope.row.effectRange}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="是否可再次领用" width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.isRepeat==0">否</span>
                            <span v-if="scope.row.isRepeat==1">是</span>
                        </template>
                    </el-table-column>
                </el-table>
                </el-checkbox-group>
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
                <div class="searchBtns">
                    <el-button type="primary" @click="comfirmNew" :disabled="disable">确认</el-button>
                </div>
            </el-dialog>
            <!-- 选择旧优惠券批次弹框 -->
            <el-dialog class="forListOut" title="请选择可以兑换的旧批次" :visible.sync="dialogVisible2" width="60%" center>
                    <!-- 查询 -->
                    <div class="searchBox">
                        <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="优惠券批次" v-model="ruleForm2.couponBatchCode">
                        </el-input>
                        <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="优惠券组/标题" v-model="ruleForm2.title">
                        </el-input>
                        <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="批次名称" v-model="ruleForm2.couponBatchName">
                        </el-input>
                        <el-button type="primary" @click="searchList2">查询</el-button>
                    </div>
                    <el-checkbox-group v-model="tagListOld">
                    <el-table ref="selected" :data="tableForNewDate2" height="500" border highlight-current-row style="width: 100%" @selection-change="handleSelectionChange2" :row-key="getRowKeys2">
                        <el-table-column align="center" width="30">
                            <template slot-scope="scope">
                                <el-checkbox :label="scope.row.id"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="优惠券批次" width="150">
                            <template slot-scope="scope">
                                <span>{{scope.row.couponBatchCode}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="批次名称" width="150">
                            <template slot-scope="scope">
                                <span>{{scope.row.couponBatchName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="优惠券组/标题" width="150">
                            <template slot-scope="scope">
                                <span>{{scope.row.title}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="领取类型" width="100">
                            <template slot-scope="scope">
                                <span v-if="scope.row.getType==0">手动扫码</span>
                                <span v-if="scope.row.getType==1">注册领取</span>
                                <span v-if="scope.row.getType==2">unit领取</span>
                                <span v-if="scope.row.getType==3">以旧换新</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="优惠券类型" width="150">
                            <template slot-scope="scope">
                                <span v-if="scope.row.couponType==0">满减券</span>
                                <span v-if="scope.row.couponType==1">兑换券</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="优惠内容" width="150">
                            <template slot-scope="scope">
                                <span>{{scope.row.detail}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="是否前端显示" width="100">
                            <template slot-scope="scope">
                                <span v-if="scope.row.isDisplay==0">否</span>
                                <span v-if="scope.row.isDisplay==1">是</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="可领取日期" width="150">
                            <template slot-scope="scope">
                                <span>{{scope.row.receivedRange}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="有效周期" width="150">
                            <template slot-scope="scope">
                                <span>{{scope.row.effectRange}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="是否可再次领用" width="100">
                            <template slot-scope="scope">
                                <span v-if="scope.row.isRepeat==0">否</span>
                                <span v-if="scope.row.isRepeat==1">是</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    </el-checkbox-group>
                    <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                        <el-pagination
                        @size-change="handleSizeChange2"
                        @current-change="handleCurrentChange2"
                        :current-page.sync="ruleForm2.pageNo"
                        :page-sizes="[10,20,30, 50]"
                        :page-size="ruleForm2.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="count2">
                        </el-pagination>
                    </div>
                    <div class="searchBtns">
                        <el-button type="primary" :disabled="disable" @click="comfirmOld">确认</el-button>
                    </div>
            </el-dialog>
        </template>
        <!-- 新增成功 -->
        <template v-if="active==2">
            <img src="../../../assets/success.jpg" />
        </template>
    </div>
</template>

<script>
var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../config/env';
import {addNewActWithTx,findCouponBatchByParam} from '../../../api/getData';
export default{
    data(){
        return{
            getRowKeys(row) {
                return row.id;
            },
            getRowKeys2(row) {
                return row.id;
            },
            ruleForm:{
                type:1,
                couponBatchCode:'',
                title:'',
                pageNo:1,
                pageSize:10,
                couponBatchName:''
            },
            ruleForm2:{
                type:0,
                couponBatchCode:'',
                title:'',
                pageNo:1,
                pageSize:10,
                couponBatchName:''
            },
            tagListOld:[],
            tagListNew:[],
            active:1,
            count:null,
            count2:null,
            form:{
                exchangeName:'',
                endDay:'',
                unitStatus:[],
                oldBatchIds:[],
                newBatch:[]
            },
            rules:{
                exchangeName:[
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                ],
                endDay:[
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ]
            },
            vertifys:true,
            dynamicTags: [],
            tableData:[],
            tableForNewDate:[],
            tableForNewDate2:[],
            dialogVisible1:false,
            dialogVisible2:false,
            checkList:[],
            addprice:"0",
            sort:'',
            disable:false,
            selectedNew:[],
            selectedOld:[]
        }
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                 let str = curVal.path;
                 str = str.substring(0,12)
                if(str == "/addToNewAct"){
                    Object.assign(this.$data, this.$options.data());
                    this.active = 1;
                    this.selectedNew = [];
                    this.selectedOld = [];
                    this.findCouponBatchByParam2();
                    this.findCouponBatchByParam();
                    // this.$refs.selectednew.clearSelection();
                    // this.$refs.selected.clearSelection();
                }

            },
        }
    },
    created() {
        this.active=1;
        this.selectedNew = [];
        this.selectedOld = [];
        this.findCouponBatchByParam2();
        this.findCouponBatchByParam();
    },
    methods:{
        //截止日期校验
        endDayves(){
            var myDate = new Date();
            var now = myDate.getDate();
            var time = this.setTimeGetDay(this.form.endDay);
            console.log(now);
            console.log(time);
            if(time>=now){
                this.vertifys = true;
            }else{
                this.vertifys = false;
                this.$message({
                    type: 'error',
                    message: '活动截止时间为不可小于当前时间'
                });
            }
        },
        //标签删除
        handleClose(index) {
            this.tagListOld.splice(index,1);
            this.dynamicTags.splice(index,1);
            console.log(this.dynamicTags);
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
        },

        onSave(){
            if(this.vertifys == false){
                this.$message({
                        type: 'error',
                        message: '活动截止时间为不可小于当前时间'
                    });
            }else{
                this.addNewActWithTx();
            }
        },
        //保存
        async addNewActWithTx() {
            try {
                const obj = new Object();
                obj.endDay = this.setTimestamp(this.form.endDay);
                obj.exchangeName = this.form.exchangeName;
                obj.oldBatchIds =JSON.stringify(this.form.oldBatchIds);
                obj.newBatch = JSON.stringify(this.form.newBatch);
                obj.unitStatus = JSON.stringify(this.form.unitStatus);
                const res = await addNewActWithTx(obj);
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '添加成功'
                    });
                    this.active=2;
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
        //获取新批次列表
        async findCouponBatchByParam() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findCouponBatchByParam(obj);
                if (res.data.code == 0) {
                    this.count = res.data.data.totalSize;
                    this.tableForNewDate = res.data.data.list;
                    // if(this.selectedNew.length>0 && this.tableForNewDate){
                    //     this.selectedNew.forEach((v,i)=>{
                    //         this.tableForNewDate.forEach((_v,_i)=>{
                    //             if(v.id == _v.id){
                    //                 this.$refs.selectednew.toggleRowSelection(_v);
                    //             }
                    //         })
                    //     })
                    // }
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
        //获取旧批次列表
        async findCouponBatchByParam2() {
            try {
                const obj = new Object();
                $.each(this.ruleForm2, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findCouponBatchByParam(obj);
                if (res.data.code == 0) {
                    this.count2 = res.data.data.totalSize;
                    this.tableForNewDate2 = res.data.data.list;
                    // if(this.selectedOld && this.tableForNewDate2){
                    //     this.selectedOld.forEach((v,i)=>{
                    //         this.tableForNewDate2.forEach((_v,_i)=>{
                    //             if(v.id == _v.id){
                    //                 this.$refs.selected.toggleRowSelection(_v);
                    //             }
                    //         })
                    //     })
                    // }
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
        //分页(新)
        handleSizeChange(val) {
            this.ruleForm.pageSize = val;
            this.findCouponBatchByParam();
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findCouponBatchByParam();
        },
        //分页(旧)
        handleSizeChange2(val) {
            this.ruleForm2.pageSize = val;
            this.findCouponBatchByParam2();
        },
        handleCurrentChange2(val) {
            this.ruleForm2.pageNo = val;
            this.offset = (val - 1) * this.ruleForm2.pageSize;
            this.findCouponBatchByParam2();
        },
        //弹框
        handleChooseOld(){
            this.dialogVisible2 = true;
            this.findCouponBatchByParam2();
        },
        handleChooseNew(){
            this.dialogVisible1 = true;
            this.findCouponBatchByParam();
        },
        //搜索
        searchList2(){
            this.findCouponBatchByParam2();
        },
        searchList(){
            this.findCouponBatchByParam();
        },
        handleSelectionChange2(selection){
            this.selectedOld = selection;
            console.log(this.selectedOld);
            let arr = new Array;
            let arrTitle = new Array;
            let arrStr = "";
            $.each(selection,function(key,info){
                arr.push(info.id);
                arrStr = info.title + ' ' +info.titleStr;
                arrTitle.push(arrStr);
            })
            this.form.oldBatchIds = arr;
            this.dynamicTags = arrTitle;
            if(this.selectedOld.length>50){
                this.$message({
                    type: 'error',
                    message: '最多选择50个批次'
                });
                this.disable=true;
            }
        },
        handleSelectionChange(selection){
            this.selectedNew = selection;
            console.log(this.selectedNew);
            let that = this;
            let arr = new Array;
            that.tableData = [];
            $.each(selection,function(key,info){
              that.tableData.push({
                  title:info.title,
                  id:info.id,
                  addPrice:'0',
                  sort:'0'
              });
            })
            if(this.selectedNew.length>50){
                this.$message({
                    type: 'error',
                    message: '最多选择50个批次'
                });
                this.disable=true;
            }
            $.each(this.tableData,function(key,info){
               arr.push({
                  batchId:info.id,
                  addPrice:info.addPrice,
                  sort:info.sort
                });
            })
            this.form.newBatch = arr;
        },
        inputNum(){
            let reg=/^[0-9]*$/;
            for(var i=0;i<this.tableData.length;i++){
                if(!reg.test(this.tableData[i].addPrice)){
                    this.$message({
                        type: 'error',
                        message: '加价金额和排序仅限输入正整数且不能为空'
                    });
                    return false;
                }
            }
            let arr = new Array;
            $.each(this.tableData,function(key,info){
               arr.push({
                  batchId:info.id,
                  addPrice:info.addPrice,
                  sort:info.sort
                });
            })
            this.form.newBatch = arr;
            console.log(this.tableData);
        },
        //选择旧批次确认
        async comfirmOld(){
            try {
                const obj = new Object();
                $.each(this.ruleForm2, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                obj.pageNo = 1;
                obj.pageSize = this.count2;
                obj.batchIds = JSON.stringify(this.tagListOld);
                this.listLoading = false;
                const res = await findCouponBatchByParam(obj);
                if (res.data.code == 0) {
                   // this.count2 = res.data.data.totalSize;
                    this.dynamicTags = res.data.data.list;
                    let arr = new Array;
                    let arrTitle = new Array;
                    let arrStr = "";
                    $.each(res.data.data.list,function(key,info){
                        arr.push(info.id);
                        arrStr = info.title + ' ' +info.titleStr;
                        arrTitle.push({
                            id:info.id,
                            arrStr:arrStr
                        });
                    })
                    this.form.oldBatchIds = arr;
                   // this.dynamicTags = arrTitle;
                    console.log(this.dynamicTags);
                    if(this.selectedOld.length>50){
                        this.$message({
                            type: 'error',
                            message: '最多选择50个批次'
                        });
                        this.disable=true;
                    };
                    this.dialogVisible2 = false;
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
        //选择新批次确认
        async comfirmNew(){
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                obj.batchIds = JSON.stringify(this.tagListNew);
                obj.pageNo = 1;
                obj.pageSize = this.count;
                this.listLoading = false;
                const res = await findCouponBatchByParam(obj);
                if (res.data.code == 0) {
                   // this.count2 = res.data.data.totalSize;
                    let that = this;
                    let arr = new Array;
                    that.tableData = [];
                    $.each(res.data.data.list,function(key,info){
                        that.tableData.push({
                            title:info.title,
                            id:info.id,
                            addPrice:'0',
                            sort:'0'
                        });
                    })
                    if(that.selectedNew.length>50){
                        that.$message({
                            type: 'error',
                            message: '最多选择50个批次'
                        });
                        that.disable=true;
                    }
                    $.each(that.tableData,function(key,info){
                        arr.push({
                            batchId:info.id,
                            addPrice:info.addPrice,
                            sort:info.sort
                            });
                    })
                    that.form.newBatch = arr;
                    that.dialogVisible1 = false;
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
        //时间转换时间戳
        setTimestamp(time) {
            const t = new Date(time);
            return t.getTime()
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
            return y + '-' + m + '-' + d + ' ' + h + ':' + f + ':' + s
        },
        setTimeGetDay(time) {
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
            return d
        },
    }
}
</script>

<style scoped>
.addNewAct{
    width:600px !important;
    margin:20px auto;
}
.addNewAct >>> .el-form-item__label{
    text-align: left;
}
.addNewAct .el-button--small, .el-button--small.is-round{
    margin-left:50px;
}
.addNewAct .el-tag{
    margin-right:20px;
}
.addNewAct >>> .el-table__body, .el-table__footer, .el-table__header{
    width:100% !important;
}
.addNewAct .newTableList >>>.el-input__inner{
    line-height: 20px;
    height:auto;
    padding:0;
}
.addNewAct .newTableList >>>.el-input{
    width:30px;
}
.tipText{
    line-height: 16px;
    padding: 20px 0;
}
.forListOut >>> .el-dialog__title{
    display: inline-block;
    width: 100%;
    line-height: 24px;
    font-size: 18px;
    color: #303133;
    text-align: left;
}
.filter-item{
    width: 200px;
    margin-right:15px;
}
.searchBox{
    padding-bottom:20px;
}
.searchBtns{
    padding-top: 20px;
    text-align: center;
}
</style>