<template>
  <div class="filter-container" id="example">

    <div style="margin-bottom:20px;">
        <el-button size="medium" type="primary" @click="passAllAudit">批量通过</el-button>

        <el-button size="medium" type="primary"  @click="auditList">刷新</el-button>
    </div>

    <el-table
        ref="multipleTable"
        :data="dataSource"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">

            <el-table-column
            type="selection"
            width="55">
            </el-table-column>

            <el-table-column
            prop="merchantProductSerialNumber"
            label="商品编号"
            align="center"
            >

            </el-table-column>

            <el-table-column
            prop="name"
            label="商品名称"
            align="center"
            >
            </el-table-column>

            <el-table-column
            prop="salePrice"
            label="商品价格"
            align="center"
            >
            </el-table-column>

            <el-table-column
            prop="stock"
            label="库存"
            align="center"
            >
            </el-table-column>

            <el-table-column
            prop="soldBase"
            label="已售基数"
            align="center"
            >
            </el-table-column>



            <el-table-column align="center" label="操作" width="250">
                <template slot-scope="scope">
                    <el-button type="info" size="small" plain @click="checkProduct(scope.row.id)">查看</el-button>
                    <el-button type="success" size="small" plain @click="updateOk(scope.row.id)">通过</el-button>
                    <el-button type="danger" size="small" plain @click="updateNo(scope.row.id)">不通过</el-button>
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

    <el-dialog title="查看商品" :visible.sync="dialogFormVisible">
        <div style="height:400px;overflow-y:auto;overflow-x:hidden;">
            <see-goods :goods-id="goodsId" v-if="dialogFormVisible" ref="seegoods"></see-goods>
        </div>
        <div slot="footer" class="dialog-footer" :span="24">
          <el-button @click="dialogFormVisible = false" size="medium">取 消</el-button>
          <el-button type="primary" @click="updateOk(goodsId)" size="medium">通 过</el-button>
        </div>
    </el-dialog>

    <el-dialog title="失败原因" :visible.sync="dialogFormVisible2">
        <el-input
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 6}"
        placeholder="请输入内容"
        v-model="textarea">
        </el-input>
        <div slot="footer" class="dialog-footer" :span="24">
          <el-button @click="dialogFormVisible2 = false" size="medium">取 消</el-button>
          <el-button type="primary" @click="updateStatusNo" size="medium">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>


<script>
import seeGoods from './seeGoods.vue'

import {goodsList,putawaySoldOut,passAllAuditWithTx,updateStatus,merchantProductPassWithTx} from '../../../api/getData';
export default {
    data() {
        return {
            dataSource: [],
            offset: 0,
            count: null,
            multipleSelection: [],
            passAll:[],
            dialogFormVisible:false,
            dialogFormVisible2:false,
            ruleForm:{
                pageSize:10,
                pageNo:1,
                status:2
            },
            textarea:'',
            goodsId:'',
        }
    },
    components: {
        seeGoods
    },
    created() {
        this.auditList();
    },

    methods: {
        //获取列表
        async auditList() {
            try {

                this.listLoading = false;
                const res = await goodsList(this.ruleForm);

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
            this.auditList()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageNo;
            this.auditList()
        },

        handleSelectionChange (selection) {
            let arr = new Array;
            $.each(selection,function(key,info){
                arr.push(info.id);
            })
            this.passAll = arr;
        },


        //查看商品信息
        checkProduct (id) {
            this.dialogFormVisible = true;
            this.goodsId = id;
        },

        //批量通过
        async passAllAudit () {
            try {

                const res = await passAllAuditWithTx({ids:JSON.stringify(this.passAll)});

                if (res.data.code == 0) {
                    this.$notify({
                        title: '审批',
                        message: res.data.data,
                        type: 'success',
                        duration: 2000
                    });
                    this.auditList()

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
        //审批通过
        async updateOk (id) {
            try {
                const res = await merchantProductPassWithTx({ merchantProductId:id,type:1 });

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: "审批通过",
                        type: 'success',
                        duration: 2000
                    });
                    this.auditList()
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
        //审批不通过
        updateNo (id) {
            this.dialogFormVisible2 = true;
            this.goodsId = id;
        },
        async updateStatusNo () {
             try {
                const res = await merchantProductPassWithTx({ merchantProductId:this.goodsId,type:0,cause:this.textarea });

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '审批不通过',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible2 = false;
                    this.auditList()
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
        }


    }
}
</script>

<style scoped>
#example {
    padding: 10px 20px;
}
.quill-editor{
    width:80%;
}
</style>


