<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品标题" v-model="ruleForm.commodityName">
        </el-input>

        <el-select v-model="ruleForm.commodityType" placeholder="类型" style="width: 200px;margin-right:15px;">
            <el-option label="转让" value="1">
            </el-option>
            <el-option label="求购" value="2">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.companyId" placeholder="所属公司">
            <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.companyName"
                :value="item.id">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.status" placeholder="商品状态" style="width: 200px;margin-right:15px;">
            <el-option label="审核未通过" value="0">
            </el-option>
            <el-option label="待审核" value="1">
            </el-option>
            <el-option label="已上架" value="2">
            </el-option>
            <el-option label="已下架" value="3">
            </el-option>
        </el-select>

        <el-button class="filter-item" type="primary" icon="search" @click="commodityOfPage">搜索</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>

     </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="商品标题" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.commodityName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="类型" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.commodityType==1">转让</span>
                <span v-else-if="scope.row.commodityType==2">求购</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="价格" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.price}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="发布人" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.userName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="发布时间" min-width="80">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.createTime)}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="联系电话" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.contactWay}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="商品状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.status==0">未通过审核</span>
                <span v-else-if="scope.row.status==1">审核中</span>
                <span v-else-if="scope.row.status==2">已上架</span>
                <span v-else-if="scope.row.status==3">已下架</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="所属公司" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.companyName}}</span>
            </template>
        </el-table-column>



        <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
                <el-button type="primary" size="small" v-if="scope.row.status==1" plain @click="editPlatform(scope.row.id)">商品审核</el-button>
                <el-button type="primary" size="small" v-else plain @click="editPlatform(scope.row.id)">查看详情</el-button>
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

    <el-dialog title="商品详情" :visible.sync="dialogFormVisible" size="tiny">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form ref="form" :model="form" label-width="80px">
                <h2 style="text-align:left;">{{form.commodityName}}</h2>
                <el-form-item label="发布人" style="text-align:left;">
                    <span>{{form.userName}}</span>
                </el-form-item>
                <el-form-item label="联系电话" style="text-align:left;">
                    <span>{{form.contactWay}}</span>
                </el-form-item>
                <el-form-item label="价格" style="text-align:left;">
                    <span>{{form.price}}</span>
                </el-form-item>
                <el-form-item label="地点" style="text-align:left;">
                    <span>{{form.goodReceiverProvince+"-"+form.goodReceiverCity+"-"+form.goodReceiverArea}}</span>
                </el-form-item>
                <el-form-item label="发布时间" style="text-align:left;">
                    <span>{{setTime(form.createTime)}}</span>
                </el-form-item>
                <el-form-item label="商品描述" style="text-align:left;">
                    <span>{{form.commodityContent}}</span>
                </el-form-item>
                <el-form-item label="商品图片" style="text-align:left;">
                    <span v-for="url in form.commodityPictures">
                        <img :src="url.url" style="width:100%;" />
                    </span>
                </el-form-item>

            </el-form>

        </el-form>
        <el-dialog title="失败原因"  width="30%" :visible.sync="dialogFormVisible2" append-to-body>
            <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6}"
            placeholder="请输入失败原因"
            v-model="failReason">
            </el-input>
            <div slot="footer" class="dialog-footer" :span="24">
            <el-button @click="dialogFormVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="auditCommodity(1)">确 定</el-button>
            </div>
         </el-dialog>

        <div slot="footer" class="dialog-footer" :span="24"  v-if="form.status==1">
            <el-button @click="auditNoCommodity" size="medium">不通过</el-button>
            <el-button type="primary" @click="auditCommodity(0)" size="medium">通过</el-button>
        </div>

    </el-dialog>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {commodityOfPage_HT,findCommodityById_HT,auditCommodityById_HT,findCompanyIdOrName} from '../../../api/getData';
export default {
    data() {
        return {

            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            dialogFormVisible:false,
            dialogFormVisible2:false,
            form:{

            },
            ruleForm:{
                commodityName:'',
                status:'',
                commodityType:'',
                companyId:'',
                pageNo:1,
                pageSize:10
            },
            failReason:'',
            companyList:[]
        }
    },
    created() {
        this.commodityOfPage();
        this.findCompanyIdOrName();

    },

    methods: {
        //获取列表
        async commodityOfPage() {
            try {

                this.listLoading = false;
                const res = await commodityOfPage_HT(this.ruleForm);

                if (res.data.code == 0) {
                    console.log(res.data.data)
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

        //分页
        handleSizeChange(val) {
            this.ruleForm.pageSize = val;
            this.commodityOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.commodityOfPage()
        },

        //重置
        resetForm(){
            this.ruleForm={
                commodityName:'',
                status:'',
                commodityType:'',
                companyId:'',
                pageNo:1,
                pageSize:10
            };

            this.commodityOfPage()
        },


        //auditNoCommodity
        auditNoCommodity(){
            this.dialogFormVisible2 = true;
            this.failReason = '';
        },

        //查看
        async editPlatform (id) {
            try {
                this.failReason = '';
                this.dialogFormVisible = true;
                const res = await findCommodityById_HT({id:id});

                if (res.data.code == 0) {
                    this.form = res.data.data;
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

        //审核
        async auditCommodity (type) {
            try {
                const res = await auditCommodityById_HT({id:this.form.id,oldUpdateTime:this.form.updateTime,orPass:type,failReason:this.failReason});

                if (res.data.code == 0) {
                    this.dialogFormVisible = false;
                    this.dialogFormVisible2 = false;
                    this.commodityOfPage();
                    this.$message({
                        type: 'success',
                        message: res.data.data
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


