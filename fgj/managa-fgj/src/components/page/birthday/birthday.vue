<template>
  <div class="filter-container" id="example">
    <div>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="祝福语" v-model="ruleForm.topicHeadline">
        </el-input>




        <el-button class="filter-item" type="primary" icon="search" @click="congrWordsPage">搜索</el-button>
        <el-button @click="resetForm()">重置</el-button>


     </div>

    <div style="margin-bottom:20px;text-align:right;">

        <el-button class="filter-item" @click="addBook" type="primary" icon="el-icon-circle-plus">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="祝福语" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.content}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="排序" width="150">
            <template slot-scope="scope">
                <span>{{scope.row.sort}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="editPlatform(scope.row.id)">编辑</el-button>
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

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <el-form label-width="120px" :model="form">
            <el-form-item label="排序">
                <el-input-number v-model="form.sort"></el-input-number>
            </el-form-item>

            <el-form-item label="祝福语">
                <el-input
                    type="textarea"
                    :rows="4"
                    :maxlength="60"
                    resize="none"
                    placeholder="请输入生日祝福语（60字以内）"
                    v-model="form.content">
                </el-input>
            </el-form-item>
        </el-form>


        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="uploadReadBook">确 定</el-button>
        </div>

    </el-dialog>


  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {congrWordsPage,congrWordsDetail,saveCongrWords} from '../../../api/getData';
export default {
    data() {
        return {
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            dialogFormVisible:false,
            form:{
                id:'',
                content:'',
                sort:'',
            },
            ruleForm:{
                topicHeadline:'',
                booksName:'',
                companyId:'',
                pageNo:1,
                pageSize:10
            },
            dialogTitle:'新增祝福语'

        }
    },
    created() {
        this.congrWordsPage();

    },
    methods: {

        //获取列表
        async congrWordsPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await congrWordsPage(obj);

                if (res.data.code == 0) {
                    this.count = res.data.data.congrWordsPage.totalSize;
                    this.dataSource = res.data.data.congrWordsPage.list;

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
            this.congrWordsPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.congrWordsPage()
        },

        //重置
        resetForm(){
            this.ruleForm={
                topicHeadline:'',
                booksName:'',
                companyId:'',
                pageNo:1,
                pageSize:10
            };

            this.congrWordsPage()
        },


        addBook () {
            this.dialogTitle = "新增祝福语";
            this.form = {
                id:'',
                content:'',
                sort:'',
            };
            this.dialogFormVisible = true;
        },


        //保存

        async uploadReadBook () {
            try {
                const res = await saveCongrWords(this.form);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '保存成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.congrWordsPage();
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


        //查看
        async editPlatform (id) {
            try {
                this.dialogFormVisible = true;
                const res = await congrWordsDetail({id:id});

                if (res.data.code == 0) {
                    let data = res.data.data.congrWords;
                    this.form = {
                        id:data.id,
                        content:data.content,
                        sort:data.sort,

                    };
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
            const t = new Date(time);
            return t.getTime()
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
            this.bookForm.topicCover = this.baseImgUrl + response.key;
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


