<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">

        <el-button class="filter-item" @click="addMenu" type="primary" icon="edit">新增分类</el-button>

    </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="菜单分类ID" min-width="50">
            <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="分类名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="类目排序" min-width="50">
            <template slot-scope="scope">
                <span>{{scope.row.sortValue}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="类目备注" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.description}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="300" fixed="right">
            <template scope="scope">
                <el-button
                size="small"
                type="primary"
                @click="findStoreMenuNodeById(scope.row.id)"
                v-if="scope.row.isAll==0">
                编辑
                </el-button>

                <el-button
                size="small"
                type="primary"
                @click="findStandardUnitStoreAll(scope.row.id,scope.row.isAll)"
                v-if="scope.row.isAll==1">
                查看商品
                </el-button>

                <el-button
                size="small"
                type="primary"
                @click="findStandardUnitStoreAll(scope.row.id,scope.row.isAll)"
                v-if="scope.row.isAll==0">
                选择商品
                </el-button>

                <el-button
                size="small"
                type="danger"
                @click="deleteMenu(scope.row.id)"
                v-if="scope.row.isAll==0">
                删除
                </el-button>
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

    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="50%">
        <el-form ref="form" label-width="120px">
            <el-form-item label="分类名称">
                <el-input style="width: 200px" class="filter-item" placeholder="不超过6个字" v-model="menuForm.name" maxlength="6"></el-input>
            </el-form-item>

            <el-form-item label="类目备注">
                <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                placeholder="不超过500字"
                v-model="menuForm.description">
                </el-input>
            </el-form-item>

            <el-form-item label="类目排序" prop="listSort">
                <el-input-number controls-position="right" v-model="menuForm.sortValue" :min="1" label="类目排序"></el-input-number>
            </el-form-item>
        </el-form>


        <div slot="footer" class="dialog-footer" :span="24">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveStoreMenu">确 定</el-button>
        </div>
    </el-dialog>

    <el-dialog title="选择商品" :visible.sync="dialogFormVisible2" width="50%">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" :disabled="isAll==1">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkGoodsIds" @change="handleCheckedCitiesChange" :disabled="isAll==1">
            <el-checkbox v-for="goods in goodsList" :label="goods.standardUnitId" :key="goods.standardUnitId">{{goods.standardUnitName}}</el-checkbox>
        </el-checkbox-group>


        <div slot="footer" class="dialog-footer" :span="24" v-if="isAll==0">
            <el-button @click="dialogFormVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="insertAllWithTx">确 定</el-button>
        </div>
    </el-dialog>

  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {findByStoreIdOfPage,insertStoreMenuNodeWithTx,updateStoreMenuNodeByIdWithTx,findStoreMenuNodeById,findStandardUnitStoreAll,insertAllWithTx,deleteStoreMenuNodeWithTx} from '../../../api/getData';
export default {
    data() {
        return {
            listLoading:true,
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            dialogFormVisible:false,
            ruleForm:{
                storeId:'',
                pageNo:1,
                pageSize:10
            },
            title:'',
            dialogFormVisible:false,
            menuForm:{
                id:'',
                storeMenuTreeId:'',
                name:'',
                description:'',
                sortValue:'',
                isAll:0
            },
            storeMenuNodeId:'',
            goodsList:[],
            checkGoodsIds:[],
            dialogFormVisible2:false,
            checkAll:false,
            isIndeterminate: true,
            isAll:'',
            storeMenuTreeId:''
        }
    },
    created() {
        this.ruleForm.storeId = this.$route.params.id;
        this.findByStoreIdOfPage();
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                 let str = curVal.path;
                 str = str.substring(0,14)

                 if(str == "/storeMenuList"){
                    this.ruleForm.storeId = this.$route.params.id;
                    this.findByStoreIdOfPage();
                }

            },
        }
    },
    methods: {
        //选择商品保存
        async insertAllWithTx() {
            try {
                const res = await insertAllWithTx({standardUnitIdList:JSON.stringify(this.checkGoodsIds),storeMenuNodeId:this.storeMenuNodeId});

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '添加成功'
                    });
                    this.dialogFormVisible2 = false;
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
        //删除
        deleteMenu(id){
            this.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteStoreMenuNodeWithTx(id);
            }).catch(() => {

            });
        },
        async deleteStoreMenuNodeWithTx(id) {
            try {
                const res = await deleteStoreMenuNodeWithTx({id:id});

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.findByStoreIdOfPage();
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
        //全选
        handleCheckAllChange(val) {
            let goodsIds = [];
            $.each(this.goodsList,function(key,info){
                goodsIds.push(info.standardUnitId);
            })
            this.checkGoodsIds = val ? goodsIds : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkGoodsIds = value.length;
            this.checkAll = checkGoodsIds === this.goodsList.length;
            this.isIndeterminate = checkGoodsIds > 0 && checkGoodsIds < this.goodsList.length;
        },
        //选择商品
        async findStandardUnitStoreAll(id,isAll) {
            try {
                const res = await findStandardUnitStoreAll({storeId:this.ruleForm.storeId,storeMenuNodeId:id});

                if (res.data.code == 0) {
                    this.isAll = isAll;
                    this.goodsList = res.data.data.standardUnitList;
                    this.checkGoodsIds = res.data.data.standardUnitIds;
                    this.storeMenuNodeId = id;
                    if(this.isAll == 1){
                        this.checkAll = true;
                        this.handleCheckAllChange(true);
                    }else{
                        this.isIndeterminate = true;
                    }
                    this.dialogFormVisible2 = true;
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

        //编辑
        async findStoreMenuNodeById(id) {
            try {
                const res = await findStoreMenuNodeById({id:id});

                if (res.data.code == 0) {
                    this.menuForm = {
                        id:id,
                        storeMenuTreeId:'',
                        name:res.data.data.name,
                        description:res.data.data.description,
                        sortValue:res.data.data.sortValue,
                        isAll:0
                    };
                    this.title = '编辑分类';
                    this.dialogFormVisible = true;
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
        //保存
        saveStoreMenu(){
            this.menuForm.storeMenuTreeId = this.storeMenuTreeId;
            if(this.menuForm.id == ''){
                this.insertStoreMenuNodeWithTx();
            }else{
                this.updateStoreMenuNodeByIdWithTx();
            }
        },
        //新增保存
        async insertStoreMenuNodeWithTx() {
            try {
                const obj = new Object();
                $.each(this.menuForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                const res = await insertStoreMenuNodeWithTx(obj);

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '新增成功'
                    });
                    this.findByStoreIdOfPage();
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
        //修改保存
        async updateStoreMenuNodeByIdWithTx() {
            try {
                const res = await updateStoreMenuNodeByIdWithTx(this.menuForm);
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    });
                    this.findByStoreIdOfPage();
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
        //新增
        addMenu(){
            this.title = '新增分类';
            this.menuForm = {
                id:'',
                storeMenuTreeId:'',
                name:'',
                description:'',
                sortValue:'',
                isAll:0
            };
            this.dialogFormVisible = true;
        },
        //获取列表
        async findByStoreIdOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findByStoreIdOfPage(obj);

                if (res.data.code == 0) {

                    this.count = res.data.data.result.totalSize;
                    this.dataSource = res.data.data.result.list;
                    this.storeMenuTreeId = res.data.data.storeMenuTreeId;
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
            this.accountFlowPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageNo;
            this.accountFlowPage()
        },


        //重置
        resetForm(){
            this.ruleForm = {
                accountType:'',
                userId:this.$route.params.id,
                pageNo:1,
                pageSize:10
            }
            this.accountFlowPage();
        },
        //搜索
        handleFilter(){
            this.accountFlowPage();
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
            return y + '-' + m + '-' + d
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
#example {
    padding: 10px 20px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>


