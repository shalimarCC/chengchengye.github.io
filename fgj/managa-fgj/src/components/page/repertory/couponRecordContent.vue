<template>
  <div class="filter-container" id="example">

    <div style="margin-bottom:20px;">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="SKU编号" v-model="ruleForm.skuSerialNumber"></el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="卡号" v-model="ruleForm.cardNumber"></el-input>


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
    </div>

    <div style="margin-bottom:20px;">


        <el-date-picker
        v-model="startEndTime1"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始时间(起)"
        end-placeholder="开始时间(止)">
        </el-date-picker>

        <el-date-picker
        v-model="startEndTime2"
        type="datetimerange"
        range-separator="至"
        start-placeholder="结束时间(起)"
        end-placeholder="结束时间(止)">
        </el-date-picker>



     </div>

     <div style="margin-bottom:20px;">
        <el-date-picker
        v-model="startEndTime3"
        type="datetimerange"
        range-separator="至"
        start-placeholder="导入时间(起)"
        end-placeholder="导入时间(止)">
        </el-date-picker>

        <el-date-picker
        v-model="startEndTime4"
        type="datetimerange"
        range-separator="至"
        start-placeholder="分配时间(起)"
        end-placeholder="分配时间(止)">
        </el-date-picker>
        <el-button class="filter-item" type="primary" size="medium" icon="search" @click="handleFilter">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
     </div>


    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="unit编号" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
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

        <el-table-column align="center" label="导入时间" min-width="100">
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
        <el-table-column align="center" label="是否已分配" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.isAllocation==1">是</span>
                <span v-else>否</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="用户ID" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.allocationTime}}</span>
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


    </div>
  </div>
</template>


<script>

import {findECardOfPage} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm: {
                batch:'',
                skuSerialNumber:'',
                cardNumber:'',
                source:'',
                createTimeBegin:'',
                createTimeFinish:'',
                isValid:'',
                isAllocation:'',
                startTimeBegin:'',
                startTimeFinish:'',
                endTimeBegin:'',
                endTimeFinish:'',
                orderCode:'',
                createUserip:'',
                allocationTimeBegin:'',
                allocationTimeFinish:'',
                pageNo:1,
                pageSize:10
            },
            startEndTime1:[],
            startEndTime2:[],
            startEndTime3:[],
            startEndTime4:[],
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            skuGoodsList:[],
            dialogFormVisible:false,
            stockTitle:'进货',
            stockType:1,
        }
    },
    created() {
        this.ruleForm.batch = this.$route.params.id;
        this.findECardOfPage();
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                 Object.assign(this.$data, this.$options.data())
                 this.ruleForm.batch = this.$route.params.id;
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
            if(this.startEndTime1.length!=0){
                this.ruleForm.startTimeBegin = this.setTimestamp(this.startEndTime1[0]);
                this.ruleForm.startTimeFinish = this.setTimestamp(this.startEndTime1[1]);
            }
            if(this.startEndTime2.length!=0){
                this.ruleForm.endTimeBegin = this.setTimestamp(this.startEndTime2[0]);
                this.ruleForm.endTimeFinish = this.setTimestamp(this.startEndTime2[1]);
            }
            if(this.startEndTime3.length!=0){
                this.ruleForm.createTimeBegin = this.setTimestamp(this.startEndTime3[0]);
                this.ruleForm.createTimeFinish = this.setTimestamp(this.startEndTime3[1]);
            }
            if(this.startEndTime4.length!=0){
                this.ruleForm.allocationTimeBegin = this.setTimestamp(this.startEndTime4[0]);
                this.ruleForm.allocationTimeFinish = this.setTimestamp(this.startEndTime4[1]);
            }
            this.findECardOfPage();
        },
        //重置
        resetForm() {
            this.ruleForm = {
                batch:'',
                skuSerialNumber:'',
                cardNumber:'',
                source:'',
                createTimeBegin:'',
                createTimeFinish:'',
                isValid:'',
                isAllocation:'',
                startTimeBegin:'',
                startTimeFinish:'',
                endTimeBegin:'',
                endTimeFinish:'',
                orderCode:'',
                createUserip:'',
                allocationTimeBegin:'',
                allocationTimeFinish:'',
                pageNo:1,
                pageSize:10
            };
            this.startEndTime1 = [];
            this.startEndTime2 = [];
            this.startEndTime3 = [];
            this.startEndTime4 = [];
            this.ruleForm.batch = this.$route.params.id;
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




    }
}
</script>

<style scoped>
#example {
    padding: 10px 20px;
}
</style>


