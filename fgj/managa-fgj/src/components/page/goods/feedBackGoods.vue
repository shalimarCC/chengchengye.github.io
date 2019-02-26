<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;height:30px;">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品名称" v-model="ruleForm.merchantProductName"></el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="用户账户" v-model="ruleForm.account"></el-input>
        <el-select v-model="ruleForm.feedbackStatus" placeholder="受理状态">
        <el-option
            v-for="item in feedbackStatus"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
        </el-select>

        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>


        <router-link to="/sellPlatform" style="float:right">
            <el-button class="filter-item" type="primary" size="medium" icon="edit">内容配置</el-button>
        </router-link>

    </div>

    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border height="680" fit highlight-current-row style="width: 100%">



        <el-table-column align="center" label="商品编号" min-width="200">
            <template slot-scope="scope">
                {{scope.row.merchantProductSerialNumber}}
            </template>
        </el-table-column>

        <el-table-column align="center" label="商品规格" min-width="200">
            <template slot-scope="scope">
                <span>{{scope.row.attributeName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="商品名称" min-width="200">
            <template slot-scope="scope">
                <span>{{scope.row.merchantProductName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="商品价格" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.salePrice}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="低价平台" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.platformName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="用户名称" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.userName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="用户账户" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.account}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="联系电话" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.phone}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="反馈内容" min-width="100">
            <template slot-scope="scope">
                <el-tooltip placement="top">
                    <div slot="content" style="width:300px;">{{scope.row.content}}</div>
                    <span style="display:block;width:100px;overflow:hidden; white-space:nowrap; text-overflow:ellipsis">{{scope.row.content}}</span>
                </el-tooltip>
            </template>
        </el-table-column>

        <el-table-column align="center" label="反馈时间" min-width="100">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.createTime)}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="受理状态" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.feedbackStatus==0">未受理</span>
                <span v-if="scope.row.feedbackStatus==1">已受理</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="受理人" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.receiverId}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="受理时间" min-width="100">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.updateTime)}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="受理结果" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.acceptResult}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="300" fixed="right">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="dialogFormVisible=true;imgSrcList=scope.row.imgSrcList">查看凭证</el-button>
                <el-button type="primary" size="small" plain @click="accept(scope.row.id)" :disabled="scope.row.feedbackStatus==1">受理</el-button>
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

    <el-dialog title="查看凭证" :visible.sync="dialogFormVisible">
        <div>
            <img :src="src" alt="" v-for="src in imgSrcList" style="width:100%;">
        </div>
    </el-dialog>

    <el-dialog title="受理结果" :visible.sync="dialogFormVisible2" size="tiny" width="400px">
        <el-input
            type="textarea"
            :rows="5"
            :maxlength="100"
            resize="none"
            v-model="acceptForm.acceptResult">
        </el-input>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button @click="dialogFormVisible2 = false" size="medium">取 消</el-button>
            <el-button type="primary" @click="doFeedbackOperator" size="medium">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {findMerchantProductFeedbackOfPage,doFeedbackOperator} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm:{
                merchantProductName:'',
                account:'',
                feedbackStatus:'',
                pageNo:1,
                pageSize:10
            },
            dataSource: [],
            offset: '0',
            count: null,

            tableKey: 0,
            listLoading: true,
            feedbackStatus:[
                {
                    id:0,
                    name:'未受理'
                },
                {
                    id:1,
                    name:'已受理'
                }
            ],
            dialogFormVisible:false,
            imgSrcList:'',
            dialogFormVisible2:false,
            acceptForm:{
                id:'',
                acceptResult:''
            }
        }
    },
    created() {
        this.findMerchantProductFeedbackOfPage();

    },

    methods: {
        //点击受理
        accept(id){
            this.acceptForm.id = id;
            this.acceptForm.acceptResult = '';
            this.dialogFormVisible2 = true;
        },
        //改变状态
        async doFeedbackOperator() {
            try {
                const res = await doFeedbackOperator(this.acceptForm);

                if (res.data.code == 0) {
                    this.findMerchantProductFeedbackOfPage()
                    this.$message({
                        type: 'success',
                        message: '受理成功'
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
        //获取列表
        async findMerchantProductFeedbackOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findMerchantProductFeedbackOfPage(obj);

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
            this.findMerchantProductFeedbackOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findMerchantProductFeedbackOfPage()
        },

        //重置
        resetForm() {
            this.ruleForm = {
                merchantProductName:'',
                account:'',
                feedbackStatus:'',
                pageNo:1,
                pageSize:10
            },
            this.findMerchantProductFeedbackOfPage();
        },

        //搜索
        handleFilter() {
            console.log(this.ruleForm)
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;
            this.findMerchantProductFeedbackOfPage();
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


