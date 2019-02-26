<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="分组名称" v-model="ruleForm.groupName">
        </el-input>


        <el-button class="filter-item" type="primary" icon="search" @click="searchForm">搜索</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>

        <el-button class="filter-item" style="float:right" type="primary" icon="edit" size="medium" @click="addGroup">
           添加
        </el-button>
     </div>

    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="分组名称" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.groupName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="优惠券数量" width="80">
            <template slot-scope="scope">
                <span>{{scope.row.couponListSize}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="分组描述" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.groupDescp}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="300"  fixed="right">
            <template slot-scope="scope">
                <el-button type="primary" @click="seeCouponGroup(scope.row.id)" size="small" plain>查看</el-button>
                <el-button type="primary" @click="findCouponGroupById(scope.row.id)" :disabled="scope.row.isEdit==0" size="small" plain>编辑</el-button>
                <el-button type="primary" @click="grantDiscount(scope.row.id)"size="small" plain>发放</el-button>
                <el-button type="primary" @click="deleteCouponGroupWithTx(scope.row.id)" size="small" plain>删除</el-button>
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


    <el-dialog :title="title" :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="form" label-width="200px">
            <el-form-item label="分组名称">
                <el-input class="filter-item" placeholder="分组名称最多不超过10个字" maxlength="10" v-model="groupForm.groupName">
                </el-input>
            </el-form-item>

            <el-form-item label="添加优惠券">
                <div>
                    <el-tag
                    :key="tag.id"
                    v-for="(tag,key) in checkGroup"
                    closable
                    @close="tagClose(key)">
                    {{tag.title}}
                    </el-tag>
                </div>
                <el-button class="filter-item" type="primary" @click="addCoupon">选择优惠券</el-button>
            </el-form-item>

            <el-form-item label="分组描述">
                <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                placeholder="请输入内容"
                v-model="groupForm.groupDescp">
                </el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="insertOrUpdateCouponGroupWithTx">确 定</el-button>
        </div>
    </el-dialog>

    <el-dialog title="查看优惠券组" :visible.sync="dialogFormVisible2">
        <el-form ref="form" :model="seeGroupForm" label-width="200px">
            <el-form-item label="分组名称">
                {{seeGroupForm.groupName}}
            </el-form-item>

            <el-form-item label="添加优惠券">
                <div>
                    <el-tag
                    :key="tag.id"
                    v-for="(tag,key) in checkGroup">
                    {{tag.title}}
                    </el-tag>
                </div>
            </el-form-item>

            <el-form-item label="分组描述">
                {{seeGroupForm.groupDescp}}
            </el-form-item>

            <el-form-item label="最后一次修改人">
                {{seeGroupForm.updateUser}}
            </el-form-item>

            <el-form-item label="最后一次修改时间">
                {{setTime(seeGroupForm.updateTime)}}
            </el-form-item>
        </el-form>
    </el-dialog>

    <el-dialog title="选择优惠券" :visible.sync="dialogFormVisible1" size="tiny">
            <div style="margin-bottom:20px;">

                <el-input  style="width: 200px;margin-right:15px;" class="filter-item" placeholder="优惠券编号" v-model="ruleForm1.couponCode">
                </el-input>

                <el-input  style="width: 200px;margin-right:15px;" class="filter-item" placeholder="优惠券标题" v-model="ruleForm1.title">
                </el-input>

                <el-select v-model="ruleForm1.couponType" placeholder="优惠券类型" style="width: 200px;margin-right:15px;">
                    <el-option label="满减券" value="0">
                    </el-option>
                    <el-option label="兑换券" value="1">
                    </el-option>
                </el-select>


                <el-button class="filter-item" type="primary" icon="search" size="medium" @click="searchForm1">搜索</el-button>
                <el-button @click="resetForm1" size="medium">重置</el-button>

            </div>

            <el-checkbox-group v-model="groupForm.coupons">
                <el-table :key='tableKey1' :data="dataSource1" border fit highlight-current-row style="width: 100%">
                    <el-table-column
                    align="center"
                    width="30">
                        <template slot-scope="scope">
                            <el-checkbox :label="scope.row.id" :name="null"></el-checkbox>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="优惠券标题" min-width="150">
                        <template slot-scope="scope">
                            <span>{{scope.row.title}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="类型" min-width="80">
                        <template slot-scope="scope">
                            <span v-if="scope.row.couponType==0">满减券</span>
                            <span v-else-if="scope.row.couponType==1">兑换券</span>
                        </template>
                    </el-table-column>

                </el-table>
            </el-checkbox-group>

            <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                <el-pagination
                @size-change="handleSizeChange1"
                @current-change="handleCurrentChange1"
                :current-page.sync="ruleForm1.pageNo"
                :page-sizes="[10,20,30, 50]"
                :page-size="ruleForm1.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count1">
                </el-pagination>
            </div>

            <div slot="footer" class="dialog-footer" :span="24">
                <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="saveGroup">确 定</el-button>
            </div>

        </el-dialog>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {findCouponGroupOfPage,insertOrUpdateCouponGroupWithTx,findCouponOfPage,findCouponGroupById,deleteCouponGroupWithTx} from '../../../api/getData';
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
            title:'新增优惠券组',
            ruleForm:{
                groupName:'',
                pageNo:1,
                pageSize:10
            },
            failReason:'',
            companyList:[],
            loading:false,
            dialogFormVisible1:false,
            dataSource1:[],
            count1: null,
            offset1: 0,
            tableKey1:0,
            groupForm:{
                coupons:[],
                groupName:'',
                groupDescp:'',
                id:''
            },
            checkGroup:[],
            ruleForm1:{
                couponCode:'',
                title:'',
                couponType:'',
                goodsId:'',
                isDelete:0,
                pageNo:1,
                pageSize:10
            },
            seeGroupForm:{},
            dialogFormVisible2:false,
        }
    },
    created() {
        this.findCouponGroupOfPage();
    },

    methods: {
        //获取列表
        async findCouponGroupOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findCouponGroupOfPage(obj);

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
        //发放优惠券
        grantDiscount(id){
            this.$router.push('/grantDiscount/'+id+'/'+2);
        },
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                this.findStandardUnitCombinationAllByBlurry(query);
            } else {
                this.loading = false;
                this.goodsList = [];
            }
        },
        //查看优惠券
        async seeCouponGroup(id){
            try {
                const res = await findCouponGroupById({id:id});
                if (res.data.code == 0) {
                    this.seeGroupForm = res.data.data;
                    this.checkGroup = res.data.data.couponList;
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
        //删除优惠券
        deleteCouponGroupWithTx(id){
            this.$confirm('此操作将会删除优惠券，确定操作？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
                }).then(() => {
                    this.deleteCouponGroupWithTxAjax(id)
                }).catch(() => {
            })
        },
        async deleteCouponGroupWithTxAjax (id) {
            try {
                const res = await deleteCouponGroupWithTx({id:id});
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.findCouponGroupOfPage();
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
            this.findCouponGroupOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findCouponGroupOfPage()
        },

        //重置
        resetForm(){
            this.ruleForm={
                groupName:'',
                pageNo:1,
                pageSize:10
            };

            this.findCouponGroupOfPage()
        },
        //搜索
        searchForm(){
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;

            this.findCouponGroupOfPage()
        },

        //新增优惠券组
        addGroup(){
            this.title = '新增优惠券组';
            this.groupForm = {
                coupons:[],
                groupName:'',
                groupDescp:'',
                id:''
            };
            this.checkGroup = [];
            this.dialogFormVisible = true;
        },

        //添加优惠券
        addCoupon(){
            this.findCouponOfPage();
        },
        //获取优惠券列表
        async findCouponOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm1, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findCouponOfPage(obj);

                if (res.data.code == 0) {
                    this.dialogFormVisible1 = true;
                    this.count1 = res.data.data.totalSize;
                    this.dataSource1 = res.data.data.list;

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
        //删除已选标签
        tagClose(index){
            this.groupForm.coupons.splice(index,1);
            this.checkGroup.splice(index,1);
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
        },
        //选择优惠券组确定
        async saveGroup(){
            try {

                if(this.groupForm.coupons.length == 0){
                    this.$message({
                        type: 'error',
                        message: '请选择优惠券'
                    });
                    return;
                }
                const obj = new Object();
                obj.couponIds = JSON.stringify(this.groupForm.coupons);
                obj.pageSize = this.groupForm.coupons.length+10;
                obj.pageNo = 1;
                const res = await findCouponOfPage(obj);
                if (res.data.code == 0) {
                    this.checkGroup = res.data.data.list;
                    this.dialogFormVisible1 = false;
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
        handleSizeChange1(val) {
            this.ruleForm1.pageSize = val;
            this.findCouponOfPage()
        },
        handleCurrentChange1(val) {
            this.ruleForm1.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findCouponOfPage()
        },
        //搜索
        searchForm1(){
            this.ruleForm1.pageNo = 1;
            this.findCouponOfPage()
        },
        //重置
        resetForm1(){
            this.ruleForm1={
                couponCode:'',
                title:'',
                couponType:'',
                goodsId:'',
                isDelete:0,
                pageNo:1,
                pageSize:10
            };

            this.findCouponOfPage()
        },
        //通过id查询优惠卷分组详情
        async findCouponGroupById(id){
            try {
                const res = await findCouponGroupById({id:id});
                if (res.data.code == 0) {
                    let thtf = this;
                    this.groupForm.coupons = [];
                    this.groupForm.groupName = res.data.data.groupName;
                    this.groupForm.groupDescp = res.data.data.groupDescp;
                    this.groupForm.id = res.data.data.id;
                    $.each(res.data.data.couponList,function(key,info){
                        thtf.groupForm.coupons.push(info.id);
                    })
                    this.title = '编辑优惠券组';
                    this.saveGroup();
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

        //新增、编辑优惠券组保存
        async insertOrUpdateCouponGroupWithTx(){
            try {
                const obj = new Object();
                $.each(this.groupForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                obj.coupons = JSON.stringify(this.groupForm.coupons);
                const res = await insertOrUpdateCouponGroupWithTx(obj);
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '更新成功'
                    });
                    this.findCouponGroupOfPage();
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
        //重置
        searchForm1(){
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;

            this.findCouponOfPage()
        },
        //时间戳转换
        setTime(time) {
            if(time==null){
                return '';
            }
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


