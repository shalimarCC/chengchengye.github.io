<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:30px;">

        <el-select v-model="ruleForm.companyId" placeholder="所属公司">
            <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.companyName"
                :value="item.id">
            </el-option>
        </el-select>



        <el-button class="filter-item" type="primary" icon="search" @click="findAwardRegulationOfPage">搜索</el-button>
        <el-button @click="resetForm()">重置</el-button>


        <el-button class="filter-item" style="float:right;" @click="addBook" type="primary" icon="el-icon-circle-plus">添加</el-button>
     </div>

    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="所属公司" width="250">
            <template slot-scope="scope">
                <span>{{scope.row.companys}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="奖励规则" min-width="400">
            <template slot-scope="scope">
                <span>{{scope.row.content}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="修改时间" width="180">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.updateTime)}}</span>
            </template>
        </el-table-column>




        <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="editPlatform(scope.row.awardRegulationId)">编辑</el-button>
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
        <el-form label-width="120px" :rules="rules" :model="bookForm">

                <el-form-item label="所属公司" prop="companyId">
                    <el-select v-model="bookForm.companyIdList" multiple placeholder="所属公司">
                        <el-option
                            v-for="item in companyList"
                            :key="item.id"
                            :label="item.companyName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="奖励规则" prop="recommendLanguage">
                    <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6}"
                    placeholder="请输入规则说明（500字以内）"
                    v-model="bookForm.content">
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
import {findAwardRegulationOfPage,findCompanyIdOrName,insertAwardRegulationWithTx,updateAwardRegulationByIdWithTx,findByAwardRegulationId} from '../../../api/getData';
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

            },
            ruleForm:{
                companyId:'',
                pageNo:1,
                pageSize:10
            },
            bookForm:{
                id:'',
                content:'',
                companyIdList:[],
            },
            rules:{
                recommendLanguage: [
                    { max: 500, message: '字符长度不得超过500位', trigger: 'blur' }
                ],
            },
            failReason:'',
            dialogTitle:'',
            companyList:[]
        }
    },
    created() {
        this.findAwardRegulationOfPage();
        this.findCompanyIdOrName();

    },
    computed: {

    },
    methods: {

        //获取列表
        async findAwardRegulationOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findAwardRegulationOfPage(obj);

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
            this.findAwardRegulationOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findAwardRegulationOfPage()
        },

        //重置
        resetForm(){
            this.ruleForm={
                companyId:'',
                pageNo:1,
                pageSize:10
            };

            this.findAwardRegulationOfPage()
        },



        //查询所有公司
        async findCompanyIdOrName(){
            try {

                const res = await findCompanyIdOrName();

                if (res.data.code == 0) {
                    this.companyList = res.data.data;
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

        addBook () {
            this.dialogTitle = "新增奖励规则";
            this.bookForm = {
                id:'',
                content:'',
                companyIdList:[],
            };
            this.dialogFormVisible = true;
        },

        //保存按钮
        uploadReadBook(){
            if(this.bookForm.id == ''){
                this.insertAwardRegulationWithTx();
            }else{
                this.updateAwardRegulationByIdWithTx();
            }

        },


        //修改

        async updateAwardRegulationByIdWithTx () {
            try {
                let obj = new Object();
                obj.id = this.bookForm.id;
                obj.content = this.bookForm.content;
                obj.companyIdList = JSON.stringify(this.bookForm.companyIdList);
                const res = await updateAwardRegulationByIdWithTx(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findAwardRegulationOfPage();
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

        async insertAwardRegulationWithTx () {
            try {
                let obj = new Object();
                obj.content = this.bookForm.content;
                obj.companyIdList = JSON.stringify(this.bookForm.companyIdList);
                const res = await insertAwardRegulationWithTx(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '新增成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findAwardRegulationOfPage();
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
                this.dialogTitle = "修改奖励规则";
                this.dialogFormVisible = true;
                const res = await findByAwardRegulationId({awardRegulationId:id});

                if (res.data.code == 0) {
                    let data = res.data.data;
                    this.bookForm = {
                        id:data.awardRegulationId,
                        content:data.content,
                        companyIdList:data.CompanyIds,

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


