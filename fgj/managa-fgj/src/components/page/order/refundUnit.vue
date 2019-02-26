<template>
  <div class="filter-container" id="example">

    <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="退款单编号" v-model="ruleForm.soRefundCode">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="订单编号" v-model="ruleForm.orderCode">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="用户账户" v-model="ruleForm.mail">
        </el-input>


        <el-button class="filter-item" type="primary" icon="search" size="medium" @click="handleFilter">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>

    </div>


    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
        <el-table-column
        type="selection"
        width="55"
        align="center">
        </el-table-column>

        <el-table-column align="center" label="退款单编号">
            <template slot-scope="scope">
                <span>{{scope.row.soRefundCode}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="订单编号">
            <template slot-scope="scope">
                <span>{{scope.row.orderCode}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="子订单">
            <template slot-scope="scope">
                <span>{{scope.row.childOrderCode}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="用户账户">
            <template slot-scope="scope">
                <span>{{scope.row.mail}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="积分退款金额">
            <template slot-scope="scope">
                <span>{{scope.row.soRefundByFubi}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="现金退款金额">
            <template slot-scope="scope">
                <span>{{scope.row.soRefundByCash}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="退款时间">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.createTime)}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作人">
            <template slot-scope="scope">
                <span>{{scope.row.createUser}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="退款原因">
            <template slot-scope="scope">
                <span>{{scope.row.soRefundReason}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="备注" width="250">
            <template slot-scope="scope">
                <span>{{scope.row.remark}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="refundDetail(scope.row.id,scope.row.remark)">修改备注</el-button>
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

    <el-dialog title="修改备注" :visible.sync="dialogFormVisible">
        <el-input
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 6}"
        placeholder="请输入内容"
        v-model="refundObj.remark">
        </el-input>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="updateSoRefundRemarkWithTx">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>


<script>
import {findSoRefundOfPage,updateSoRefundRemarkWithTx} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm: {
                soRefundCode:'',
                orderCode: "",
                mail : "",
                pageNo: 1,
                pageSize: 10
            },
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            dialogFormVisible:false,

            refundObj : {
                id: '',
                remark: '',
            }
        }
    },
    created() {
        this.findSoRefundOfPage();
    },

    methods: {
        //获取列表
        async findSoRefundOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })

                this.listLoading = false;
                const res = await findSoRefundOfPage(obj);

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
            this.findSoRefundOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findSoRefundOfPage();
        },

        //搜索
        handleFilter() {
            this.findSoRefundOfPage();
        },

        //重置
        resetForm(formName) {
            this.ruleForm = {
                soRefundCode:'',
                orderCode: "",
                mail : "",
                pageNo: 1,
                pageSize: 10
            }
            this.findSoRefundOfPage();
        },

        //查询退款详情
        refundDetail(id,remark) {
            this.refundObj = {
                id: id,
                remark: remark,
            };
            this.dialogFormVisible = true;
        },


        async updateSoRefundRemarkWithTx() {
            try {
                this.listLoading = false;
                const res = await updateSoRefundRemarkWithTx(this.refundObj);

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    });
                    this.findSoRefundOfPage();
                    this.dialogFormVisible = false;

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
                return ""
            }else{
                const t = new Date(time);
                return t.getTime()
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


