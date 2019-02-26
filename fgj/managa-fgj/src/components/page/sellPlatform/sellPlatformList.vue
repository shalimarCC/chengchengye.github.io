<template>
  <div class="filter-container" id="example">

    <div style="margin-bottom:20px;height:30px;">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="平台名称" v-model="ruleForm.name"></el-input>
        <el-select v-model="ruleForm.status" placeholder="启用状态">
            <el-option
                key="1"
                label="启用"
                value="1">
            </el-option>
            <el-option
                key="0"
                label="停用"
                value="0">
            </el-option>
        </el-select>

        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>

        <el-button class="filter-item" @click="editSell" style="float:right;margin-left:10px;" type="primary" size="medium" icon="edit">比价说明</el-button>
        <el-button class="filter-item" @click="addPlatform" style="float:right" type="primary" size="medium" icon="edit">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="平台名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="排序" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.sortValue}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="启用状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.status==0">停用</span>
                <span v-if="scope.row.status==1">启用</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="备注" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.remark}}</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="操作" width="250">
            <template slot-scope="scope">
                <el-button type="primary" size="small" v-if="scope.row.status == 0" plain @click="updateSellPlatformByIdWithTx(scope.row.id,1)">启用</el-button>
                <el-button type="warning" size="small" v-else-if="scope.row.status == 1" plain @click="updateSellPlatformByIdWithTx(scope.row.id,0)">停用</el-button>
                <el-button type="info" size="small" :disabled="scope.row.status == 1" plain @click="editPlatform(scope.row.id)">编辑</el-button>
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


    <el-dialog :title="dilogTitle" :visible.sync="dialogFormVisible" size="tiny" width="400px">
        <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="平台名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>

                <el-form-item label="平台排序">
                    <el-input-number v-model="form.sortValue"></el-input-number>
                </el-form-item>

                <el-form-item label="平台备注">
                    <el-input
                        type="textarea"
                        :rows="4"
                        :maxlength="50"
                        resize="none"
                        placeholder="文本编辑区"
                        v-model="form.remark">
                    </el-input>
                </el-form-item>

            </el-form>


        <div slot="footer" class="dialog-footer" :span="24">
            <el-button @click="dialogFormVisible = false" size="medium">取 消</el-button>
            <el-button type="primary" @click="savePlatform" size="medium">确 定</el-button>
        </div>
    </el-dialog>

    <el-dialog title="比价文字说明" :visible.sync="dialogFormVisible2" size="tiny">
        <el-input
            type="textarea"
            :rows="10"
            :maxlength="500"
            resize="none"
            placeholder="文本编辑区"
            v-model="platformName">
        </el-input>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button @click="dialogFormVisible2 = false" size="medium">取 消</el-button>
            <el-button type="primary" @click="insertCommodityProductUnitCompareWithTx" size="medium">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../config/env'
import {findSellPlatformOfPage,getQiNiuToken,saveSellPlatform,findById,updateSellPlatformByIdWithTx,findCommodityProductUnitCompare,insertCommodityProductUnitCompareWithTx} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm:{
                name:'',
                status:'',
                pageNo:1,
                pageSize:10
            },
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            dialogFormVisible:false,
            dilogTitle:"新增平台",
            form:{
                id:'',
                name:'',
                sortValue:'',
                remark:'',
                status:1
            },
            imgForm:{
                key:'',
                token:'',
            },
            baseImgPath:'',
            baseImgUrl:'',
            dialogFormVisible2:false,
            platformName:''
        }
    },
    created() {
        this.findSellPlatformOfPage();
        this.baseImgPath = baseImgPath;
        this.baseImgUrl = baseImgUrl;
        const res = getQiNiuToken();
        res.then(_data => {
            if(_data.data.code == 0){

                this.imgForm.token = _data.data.data;
            }else{
                this.$message({
                    type:"error",
                    message:_data.data.error
                })
            }
        })

    },

    methods: {
        //改变状态
        async updateSellPlatformByIdWithTx(id,status){
            try {
                const res = await updateSellPlatformByIdWithTx({ id: id, status: status });

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '改变状态成功'
                    });
                    this.findSellPlatformOfPage();
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
        //保存比价说明
        async insertCommodityProductUnitCompareWithTx(){
            try {
                const res = await insertCommodityProductUnitCompareWithTx({platformName:this.platformName});

                if (res.data.code == 0) {
                    this.dialogFormVisible2 = false;
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    });
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
        //编辑比价说明
        async editSell(){
            try {
                const res = await findCommodityProductUnitCompare();

                if (res.data.code == 0) {
                    this.platformName = res.data.data.platformName;
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

        //获取列表
        async findSellPlatformOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findSellPlatformOfPage(obj);

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
            this.findSellPlatformOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findSellPlatformOfPage()
        },

         //搜索
        handleFilter() {
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;
            this.findSellPlatformOfPage();
        },
        //重置
        resetForm() {
            this.ruleForm = {
                name:'',
                status:'',
                pageNo:1,
                pageSize:10
            },
            this.findSellPlatformOfPage();
        },

        //新增
        addPlatform () {
            this.form = {
                id:'',
                name:'',
                sortValue:'',
                remark:'',
                status:1
            };
            this.dialogFormVisible = true;
        },


        //编辑
        async editPlatform (id) {
            try {

                const res = await findById({id:id});

                if (res.data.code == 0) {
                    this.form = {
                        id:res.data.data.id,
                        name:res.data.data.name,
                        sortValue:res.data.data.sortValue,
                        remark:res.data.data.remark,
                        status:1,
                    }
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
        async savePlatform () {
            try {

                const res = await saveSellPlatform(this.form);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: res.data.data,
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findSellPlatformOfPage();
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




        //上传图片
        beforeAvatarUpload(file) {    //在图片提交前进行验证  轮播图
            let curr = moment().format('YYYYMMDDHHmmss').toString();
            let prefix = moment(file.lastModified).format('HHmmss').toString();
            let key = curr+"egeo"+prefix;

            this.imgForm.key = key;
            const isJPG = file.type === 'image/jpeg'
            const isPNG = file.type === 'image/png'
            const res = getQiNiuToken();

            res.then(_data => {
                if(_data.data.code == 0){

                    this.imgForm.token = _data.data.data;
                }else{
                    this.$message({
                        type:"error",
                        message:_data.data.error
                    })
                }
            })
             console.log(this.imgForm)
            if (!isJPG&&!isPNG) {
                this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
            }

            return isJPG||isPNG

        },
        handleError(res) {   //显示错误
            this.$notify({
                title: '错误',
                message: res,
                type: 'error',
                duration: 2000
            });
        },
        handleAvatarSuccess(response){
            this.form.pictureUrl = this.baseImgUrl + response.key;
        },


    }
}
</script>

<style>
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


