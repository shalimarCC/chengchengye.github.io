<template>
  <div class="filter-container" id="example">

    <div style="margin-bottom:20px;">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="上次导入批次" v-model="ruleForm.batch"></el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="SKU编号" v-model="ruleForm.skuSerialNumber"></el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="卡号" v-model="ruleForm.cardNumber"></el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="来源" v-model="ruleForm.source"></el-input>
    </div>

    <div style="margin-bottom:20px;">
        <el-date-picker
            v-model="ruleForm.deadline"
            type="datetime"
            placeholder="截止日期" style="width: 200px;margin-right:15px;">
        </el-date-picker>
        <el-select v-model="ruleForm.type" placeholder="截止日期类型">
            <el-option
            label="截止日期之前"
            value="1">
            </el-option>
            <el-option
            label="截止日期之后"
            value="2">
            </el-option>
        </el-select>
        <el-date-picker
            v-model="ruleForm.createTime"
            type="datetime"
            placeholder="上次导入时间" style="width: 200px;margin-right:15px;">
        </el-date-picker>
        <el-select v-model="ruleForm.isValid" placeholder="有效性">
            <el-option
            label="有效"
            value="1">
            </el-option>
            <el-option
            label="无效"
            value="0">
            </el-option>
        </el-select>
     </div>

     <div style="margin-bottom:20px;">
        <el-select v-model="ruleForm.isAllocation" placeholder="是否已分配">
            <el-option
            label="是"
            value="1">
            </el-option>
            <el-option
            label="否"
            value="0">
            </el-option>
        </el-select>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="订单编号" v-model="ruleForm.orderCode"></el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="用户ID" v-model="ruleForm.createUserip"></el-input>
        <el-date-picker
            v-model="ruleForm.allocationTime"
            type="datetime"
            placeholder="分配时间" style="width: 200px;margin-right:15px;">
        </el-date-picker>
        <el-button class="filter-item" type="primary" size="medium" icon="search" @click="handleFilter">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>

        <el-button class="filter-item" style="float:right" @click="invalidBatchSet" type="primary" icon="edit" size="medium">设为失效</el-button>
        <el-button class="filter-item" style="float:right" @click="batchSet" type="primary" icon="edit" size="medium">重置为有效</el-button>
     </div>


    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" @selection-change="handleSelectionChange" border fit highlight-current-row style="width: 100%">
        <el-table-column
        type="selection"
        width="50"
        align="center">
        </el-table-column>
        <el-table-column align="center" label="UNIT编号" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="上次导入批次" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.batch}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="SKU编号" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.skuSerialNumber}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="SKU名称" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.skuName}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="卡号" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.cardNumber}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="卡密" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.cardThick}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="链接" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.shortUrl}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="开始时间" min-width="100">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.startTime)}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="结束时间" min-width="100">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.endTime)}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="上次导入时间" min-width="100">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.createTime)}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="来源" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.source}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="操作人" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.createUsername}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="有效性" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.isValid==1">有效</span>
                <span v-else>失效</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="订单编号" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.orderCode}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="用户ID" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.createUserip}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="是否已分配" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.isAllocation==1">是</span>
                <span v-else>否</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="分配时间" min-width="100">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.allocationTime)}}</span>
            </template>
        </el-table-column>



    </el-table>
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

    <el-dialog title="选择有效期" :visible.sync="dialogFormVisible">
        <el-form ref="form" label-width="200px">
            <el-form-item label="有效期">
                <el-date-picker
                v-model="startEndTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="saveBatchSet">确 定</el-button>
        </div>
    </el-dialog>

    </div>
</template>


<script>
import {findECardOfPage,setStatus} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm: {
                batch:'',
                skuSerialNumber:'',
                cardNumber:'',
                source:'',
                deadline:'',
                type:'',
                createTime:'',
                isValid:'',
                isAllocation:'',
                orderCode:'',
                createUserip:'',
                allocationTime:'',
                skuId:'',
                pageNo:1,
                pageSize:10
            },
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            skuGoodsList:[],
            dialogFormVisible:false,
            stockTitle:'进货',
            stockType:1,
            passAll:[],
            startEndTime:[],
            batchData:'',
        }
    },
    created() {
        this.ruleForm.skuId = this.$route.params.id;
        this.findECardOfPage();
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                 Object.assign(this.$data, this.$options.data())
                 this.ruleForm.skuId = this.$route.params.id;
                 this.findECardOfPage();
            },
        }
    },
    methods: {
        //获取列表
        async findECardOfPage() {
            try {
                const obj = new Object({});
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findECardOfPage(obj);

                if (res.data.code == 0) {

                    this.count = res.data.data.totalSize;
                    this.dataSource = res.data.data.list;

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

        //分页
        handleSizeChange(val) {
            this.ruleForm.pageSize = val;
            this.findECardOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findECardOfPage()
        },

        //搜索
        handleFilter() {
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;
            this.ruleForm.deadline  = this.setTimestamp(this.ruleForm.deadline);
            this.ruleForm.createTime  = this.setTimestamp(this.ruleForm.createTime);
            this.ruleForm.allocationTime = this.setTimestamp(this.ruleForm.allocationTime);
            this.findECardOfPage();
        },
        //重置
        resetForm() {
            this.ruleForm = {
                batch:'',
                skuSerialNumber:'',
                cardNumber:'',
                source:'',
                deadline:'',
                type:'',
                createTime:'',
                isValid:'',
                isAllocation:'',
                orderCode:'',
                createUserip:'',
                allocationTime:'',
                skuId:'',
                pageNo:1,
                pageSize:10
            };
            this.ruleForm.skuId = this.$route.params.id;
            this.findECardOfPage();
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
        //时间转换时间戳
        setTimestamp(time) {
            if(time == ""){
                return "";
            }
            const t = new Date(time);
            return t.getTime()
        },

        handleSelectionChange (selection) {
            let arr = new Array;
            $.each(selection,function(key,info){
                arr.push(info.id);
            })
            this.passAll = arr;
        },

        //设置为失效
        invalidBatchSet(){
            if(this.passAll.length == 0){
                this.$message({
                    type: 'error',
                    message: '请选择卡券unit'
                });
                return;
            }

            for (var i=0;i<this.passAll.length;i++) {
                for(var j=0;j<this.dataSource.length;j++){
                    if(this.dataSource[j].id==this.passAll[i]){
                        var status=this.dataSource[j].isValid;
                        if (status==0) {
                            this.$message({
                                type: 'error',
                                message: '选中项不可包含无效卡券 unit，请重新选择'
                            });
                            return;
                        }
                    }
                }
            }
            this.$confirm('该操作会将'+this.passAll.length+'张优惠券重置为失效，确认操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
                }).then(() => {
                    this.setInvalid()
                }).catch(() => {
            })
        },
        async setInvalid() {
            try {
                this.batchData=[];
                const obj = new Object();
                obj.type="0";
                for (var i=0;i<this.passAll.length;i++) {
                    for(var j=0;j<this.dataSource.length;j++){
                        if(this.dataSource[j].id==this.passAll[i]){
                            this.batchData.push({
                                id:this.dataSource[j].id,
                                skuId:this.dataSource[j].skuId
                            });
                        }
                    }
                }
                obj.data = this.batchData;
                var str = JSON.stringify(obj);
                const res = await setStatus({param:str});
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: res.data.data
                    });
                    this.findECardOfPage();

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

        //设置为有效
        batchSet(){
            if(this.passAll.length == 0){
                this.$message({
                    type: 'error',
                    message: '请选择卡券unit'
                });
                return;
            }

            for (var i=0;i<this.passAll.length;i++) {
                for(var j=0;j<this.dataSource.length;j++){
                    if(this.dataSource[j].id==this.passAll[i]){
                        var status=this.dataSource[j].isValid;
                        var time1=this.dataSource[j].startTime;
                        var time2=this.dataSource[j].endTime;
                        if (status==1) {
                            this.$message({
                                type: 'error',
                                message: '选中项不可包含有效卡券 unit，请重新选择'
                            });
                            return;
                        }
                    }
                }
            }

            this.startEndTime = [];
            if (this.passAll.length == 1) {
                this.startEndTime[0]=time1;
                this.startEndTime[1]=time2;
            }
            this.dialogFormVisible = true;

        },
        saveBatchSet(){
            if(this.startEndTime.length == 0){
                this.$message({
                    type: 'error',
                    message: '请输入有效期起止时间'
                });
                return;
            }
            this.$confirm('该操作会将'+this.passAll.length+'张优惠券重置为有效，确认操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
                }).then(() => {
                    this.setStatus()
                }).catch(() => {
            })
        },
        async setStatus() {
            try {
                this.batchData=[];
                const obj = new Object();
                obj.type="1";
                if(this.startEndTime[0]!=''&&this.startEndTime[0]!=null){
                    var startTime = this.setTimestamp(this.startEndTime[0]);
                }
                if(this.startEndTime[1]!=''&&this.startEndTime[1]){
                    var endTime = this.setTimestamp(this.startEndTime[1]);
                }
                for (var i=0;i<this.passAll.length;i++) {
                    for(var j=0;j<this.dataSource.length;j++){
                        if(this.dataSource[j].id==this.passAll[i]){
                            this.batchData.push({
                                id:this.dataSource[j].id,
                                skuId:this.dataSource[j].skuId,
                                startTime:startTime,
                                endTime:endTime
                            });
                        }
                    }
                }
                obj.data = this.batchData;
                var str = JSON.stringify(obj);
                const res = await setStatus({param:str});
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: res.data.data
                    });
                    this.dialogFormVisible = false;
                    this.findECardOfPage();

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

    }
}
</script>

<style scoped>
#example {
    padding: 10px 20px;
}
</style>


