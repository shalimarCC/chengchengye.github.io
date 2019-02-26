<template>
  <div class="filter-container" id="example">

    <div style="margin-bottom:20px;">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="运营方名称" v-model="ruleForm.name"></el-input>
    </div>

    <div style="margin-bottom:20px;">
        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
        <el-button class="filter-item" @click="addMerchant()" style="float:right" type="primary" icon="edit" size="medium">新增运营方</el-button>
    </div>

    <el-table :key='tableKey' :data="merchantList" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" max-height="600">

        <el-table-column align="center" label="运营方名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="运营方ID" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="最后一次编辑人" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.operateUserName}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="最后一次编辑时间" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.updateTime}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.isStop==0">启用</span>
                <span v-if="scope.row.isStop==1">停用</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200" fixed="right">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="editMerchant(scope.row.id,scope.row.name)">编辑</el-button>
                <el-button type="primary" size="small" plain @click="updateMerchantStopByIdWithTx(scope.row.id,1)" v-if="scope.row.isStop!=1" :disabled="scope.row.id==1">设为停用</el-button>
                <el-button type="primary" size="small" plain @click="updateMerchantStopByIdWithTx(scope.row.id,0)" v-if="scope.row.isStop==1">设为启用</el-button>
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

    <el-dialog :visible.sync="dialogFormVisible" style="margin-top:7rem;">
        <el-form label-width="120px" style="margin-top:20px;">
            <el-form-item label="运营方名称">
                <el-input v-model="merchantName" placeholder="不超过20个字" maxlength="20"></el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="insertMerchantWithTx">确 定</el-button>
        </div>

    </el-dialog>

  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import CryptoJS from 'crypto-js/core'
import MD5 from 'crypto-js/md5'
import Cookie from '../../../config/mUtils'
import {findMerchantOfPage,insertMerchantWithTx,updateMerchantStopByIdWithTx} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm: {
                name:"",
                pageNo:1,
                pageSize:10
            },
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            dialogFormVisible:false,
            action:'',
            merchantList:[],
            merchantName:'',
            merchantId:0,
        }
    },
    created() {
        this.findMerchantOfPage();
    },

    methods: {
        //获取运营商列表
        async findMerchantOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findMerchantOfPage(obj);

                if (res.data.code == 0) {
                    this.merchantList = res.data.data.list;
                    this.count = res.data.data.totalSize;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取会籍列表失败,请联系管理员！404'
                });

            }
        },

        addMerchant(){
            this.merchantName='';
            this.dialogFormVisible=true;
            
        },
        editMerchant(id,name){
            if(id!=0){
                this.merchantId=id;
                this.merchantName=name;
            }else{
                this.merchantName='';
            }
            this.dialogFormVisible=true;
            
        },
        async insertMerchantWithTx(){
            try {
                const obj = new Object();
                if(this.merchantId==0){
                    // const res = await insertMerchantWithTx({name:this.merchantName});
                    obj.name=this.merchantName;
                }else{
                    // const res = await insertMerchantWithTx({id:this.merchantId,name:this.merchantName});
                    obj.id=this.merchantId;
                    obj.name=this.merchantName;
                }

                const res = await insertMerchantWithTx(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '操作成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findMerchantOfPage();
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    // message: '操作失败,请联系管理员！404'
                    message: err
                });

            }
        },

        async updateMerchantStopByIdWithTx(id,isStop){
            try {
                const res = await updateMerchantStopByIdWithTx({id:id,isStop:isStop});

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '操作成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.findMerchantOfPage();
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取会籍列表失败,请联系管理员！404'
                });

            }
        },

        //分页
        handleSizeChange(val) {
            this.ruleForm.pageSize = val;
            this.findMerchantOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageNo;
            this.findMerchantOfPage()
        },

        //搜索
        handleFilter() {
            this.ruleForm.pageSize = 10;
            this.ruleForm.pageNo = 1;
            this.findMerchantOfPage();
        },
        //重置
        resetForm(formName) {
            this.ruleForm = {
                name:"",
                pageNo:1,
                pageSize:10
            };
            this.findMerchantOfPage();
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


