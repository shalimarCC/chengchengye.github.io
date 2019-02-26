<template>
  <div class="filter-container" id="example">

    <div style="margin-bottom:20px;">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="属性名称" v-model="ruleForm.name">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="属性编号" v-model="ruleForm.id">
        </el-input>

        <el-button class="filter-item" type="primary" icon="search" @click="findPageAttributeName">搜索</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>

        <el-button class="filter-item" @click="addProduct" style="float:right" type="primary" icon="edit">添加</el-button>
     </div>




    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="属性编号" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="属性名称" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="操作" width="250">
            <template slot-scope="scope">
                <el-button type="primary" size="small" @click="editProduct(scope.row.id)">编辑</el-button>
                <!-- <el-button type="danger" size="small" @click="delproperty(scope.row.id)">删除</el-button> -->
            </template>
        </el-table-column>

    </el-table>
    <div class="pagination-container" style="text-align: left;margin-top: 10px;">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="ruleForm.pageNo"
        :page-sizes="[10,20,30, 50]"
        :page-size="ruleForm.pageSise"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
        </el-pagination>
    </div>

  </div>
</template>


<script>

import {findPageAttributeName,attributeNameDelete} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm: {
                name: "",
                id:"",
                pageNo:1,
                pageSize:10
            },
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            dialogFormVisible: false,
            permissData: [],
            findAll: [],
            checkList: [],
            dialogFormVisible2: false,
            userId: 0,
            userRole: [],
            options: [{
                value: 1,
                label: '待审核'
            }, {
                value: 2,
                label: '审核中'
            }, {
                value: 3,
                label: '已通过'
            }, {
                value: 4,
                label: '未通过'
            }],
        }
    },
    created() {
        this.findPageAttributeName();
    },

    methods: {
        //获取列表
        async findPageAttributeName() {
            try {

                const obj = new Object();

                $.each(this.ruleForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findPageAttributeName(obj);

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
            this.findPageAttributeName()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.limit;
            this.findPageAttributeName()
        },


        //重置
        resetForm(formName) {
            this.ruleForm = {
                name: "",
                id:"",
                pageNo:1,
                pageSize:10
            }
            this.findPageAttributeName();
        },

        //新增产品
        addProduct () {
            this.$router.push( {path:'/property/addProperty'} )
        },


        //编辑
        editProduct (id) {
            this.$router.push( {path:'/property/editProperty/'+id} )
        },


        //删除
        delproperty (id){
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            }).then(() => {
              this.proDeleteAjax(id)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        },
        async proDeleteAjax (id) {
            try {
                 const res = await attributeNameDelete({id:id});

                 if (res.data.code == 0) {
                    this.$notify({
                        title: '删除',
                        message: '删除成功',
                        type: 'success',
                        duration: 2000
                    });
                     this.findPageAttributeName()
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: err
                });
            }
        },




        //时间戳转换
        setTime(time) {
            const t = new Date(time);
            let y = t.getFullYear();
            let m = t.getMonth() + 1;
            let d = t.getDate();
            if (m < 10) {
                m = '0' + m
            }
            if (d < 10) {
                d = '0' + d
            }

            return y + '-' + m + '-' + d
        },




    }
}
</script>

<style scoped>
#example {
    padding: 5px 20px;
    text-align:left;
}
</style>


