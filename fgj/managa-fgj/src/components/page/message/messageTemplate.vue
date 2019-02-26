<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="模板名称" v-model="ruleForm.name">
        </el-input>

        <el-select v-model="ruleForm.sendWayId" placeholder="发送方式" style="width: 200px;margin-right:15px;">
            <el-option
                v-for="item in sendWayTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.isStart" placeholder="状态" style="width: 200px;margin-right:15px;">
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



        <el-button class="filter-item" type="primary" icon="search" size="medium" @click="searchForm">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>

     </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">


        <el-table-column align="center" label="模板名称" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="触发条件" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.triggers}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="发送方式" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.sendWayNames}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.isStart==0">停用</span>
                <span v-else-if="scope.row.isStart==1">启用</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="操作" width="350">
            <template slot-scope="scope">
                <el-button v-if="scope.row.isStart==0" type="success" size="small" plain @click="isStartByIdWithTx(scope.row.id)">启用</el-button>
                <el-button v-else-if="scope.row.isStart==1" type="warning" @click="isStartByIdWithTx(scope.row.id)" size="small" plain>停用</el-button>
                <el-button type="primary" plain size="small" @click="findInfoTemplateById(scope.row.id)">编辑</el-button>
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

    <el-dialog title="编辑模板" :visible.sync="dialogFormVisible" size="tiny">
        <el-form ref="form" :model="form" label-width="120px">

            <el-form-item label="模板名称" class="is-required">
                <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="触发条件" class="is-required">
                <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6}"
                v-model="form.triggers">
                </el-input>
            </el-form-item>

            <el-form-item label="发送方式" style="text-align:left;" class="is-required">
                <el-checkbox-group v-model="form.sendWayIdList">
                    <el-checkbox :label="info.id" v-for="info in sendWayTypeList" @change="changeSendWayType">{{info.name}}</el-checkbox>
                </el-checkbox-group>
             <!--   <el-checkbox :label="2" v-model="sendWayType2">消息通知</el-checkbox>
                <el-checkbox :label="3" v-model="sendWayType3">短信通知</el-checkbox>
                <el-checkbox :label="4" v-model="sendWayType4">公众号推送</el-checkbox>
                <el-checkbox :label="5" v-model="sendWayType5">邮件</el-checkbox> -->
                <div class="el-upload__tip">注：只有绑定了手机号码的用户可以收到短信。只有关注福管加微信公众号并绑定账号的用户可以收到公众号推送。</div>
                <el-button type="text" @click="findInfoTemplateParameterAll">查看可引用参数</el-button>
            </el-form-item>

            <el-form-item label="系统通知" class="is-required" v-if="sendWayType1">
                <el-input
                placeholder="请输入消息内容，不超过300个字"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                v-model="form.systemInfo">
                </el-input>
            </el-form-item>

            <el-form-item label="消息通知" class="is-required"  v-if="sendWayType2">
                <el-input
                placeholder="请输入内容，不超过300个字"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                v-model="form.infoInform">
                </el-input>
            </el-form-item>

            <el-form-item label="短信" class="is-required"  v-if="sendWayType3">
                <el-input
                placeholder="请输入内容，不超过300个字"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                v-model="form.moblieInfo">
                </el-input>
            </el-form-item>

            <el-form-item label="公众号推送" class="is-required"  v-if="sendWayType4">
                <el-input
                placeholder="请输入内容，不超过300个字"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                v-model="form.weChatOfficialInfo">
                </el-input>
            </el-form-item>

            <el-form-item label="邮件" class="is-required"  v-if="sendWayType5">
                <el-input v-model="form.mailInfoTitle" placeholder="邮件标题"></el-input>
                <el-input
                placeholder="请输入内容，不超过300个字"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                v-model="form.mailInfo">
                </el-input>
                <el-input v-model="form.mailRemark" placeholder="附件内容备注，不超过50个字"></el-input>
            </el-form-item>

            <el-form-item label="备注" class="is-required">
                <el-input
                placeholder="请输入其他备注信息，不超过100个字"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6}"
                v-model="form.infoTemplateRemark">
                </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="updateInfoTemplateByIdWithTx">确 定</el-button>
        </div>

        <el-dialog title="可引用参数" :visible.sync="innerVisible" append-to-body width="50%">
            <el-tag v-for="info in templateParamList">{{info.name}}</el-tag>
        </el-dialog>
    </el-dialog>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {findSendWayTypeAll,findInfoTemplateOfPage,findInfoTemplateById,findInfoTemplateParameterAll,updateInfoTemplateByIdWithTx,isStartByIdWithTx} from '../../../api/getData';
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
                sendWayIdList:[],
            },
            ruleForm:{
                name:'',
                sendWayId:'',
                isStart:'',
                pageNo:1,
                pageSize:10
            },
            sendWayTypeList:[
                {
                    name:'系统通知',
                    id:1
                },
                {
                    name:'消息通知',
                    id:2
                },
                {
                    name:'短信通知',
                    id:3
                },
                {
                    name:'公众号推送',
                    id:4
                },
                {
                    name:'邮件',
                    id:5
                },
            ],
            innerVisible:false,
            templateParamList:[],
            sendWayType1:false,
            sendWayType2:false,
            sendWayType3:false,
            sendWayType4:false,
            sendWayType5:false,
        }
    },
    created() {
        this.findInfoTemplateOfPage();

    },

    methods: {
        changeSendWayType(){
            if($.inArray(1,this.form.sendWayIdList)>=0){
                this.sendWayType1 = true;
            }else{
                this.sendWayType1 = false;
            }
            if($.inArray(2,this.form.sendWayIdList)>=0){
                this.sendWayType2 = true;
            }else{
                this.sendWayType2 = false;
            }
            if($.inArray(3,this.form.sendWayIdList)>=0){
                this.sendWayType3 = true;
            }else{
                this.sendWayType3 = false;
            }
            if($.inArray(4,this.form.sendWayIdList)>=0){
                this.sendWayType4 = true;
            }else{
                this.sendWayType4 = false;
            }
            if($.inArray(5,this.form.sendWayIdList)>=0){
                this.sendWayType5 = true;
            }else{
                this.sendWayType5 = false;
            }

        },
        //查询消息模版可引用参数接口

        async findInfoTemplateParameterAll() {
            try {
                const res = await findInfoTemplateParameterAll({infoTemplateId:this.form.id});

                if (res.data.code == 0) {
                    this.templateParamList = res.data.data;
                    this.innerVisible = true;
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
        // //查询所有消息发送方式接口
        // async findSendWayTypeAll() {
        //     try {
        //         const res = await findSendWayTypeAll();

        //         if (res.data.code == 0) {
        //             this.sendWayTypeList = res.data.data;
        //         } else {
        //             this.$message({
        //                 type: 'error',
        //                 message: res.data.error
        //             });
        //         }
        //     } catch (err) {
        //         this.$message({
        //             type: 'error',
        //             message: '获取数据失败,请联系管理员！404'
        //         });

        //     }
        // },

        //获取列表
        async findInfoTemplateOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findInfoTemplateOfPage(obj);

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

        //搜索
        searchForm(type){
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;

            this.findInfoTemplateOfPage()
        },
        //分页
        handleSizeChange(val) {
            this.ruleForm.pageSize = val;
            this.findInfoTemplateOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findInfoTemplateOfPage()
        },

        //重置
        resetForm(){
            this.ruleForm={
                name:'',
                pageNo:1,
                pageSize:10
            };

            this.findInfoTemplateOfPage()
        },


        //编辑
        async findInfoTemplateById (id) {
            try {
                const res = await findInfoTemplateById({infoTemplateId:id});

                if (res.data.code == 0) {
                    this.form = res.data.data;
                    this.changeSendWayType();
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
        async updateInfoTemplateByIdWithTx(){
            try {
                let obj = JSON.parse(JSON.stringify(this.form));
                obj.sendWayIdList = JSON.stringify(this.form.sendWayIdList);
                const res = await updateInfoTemplateByIdWithTx(obj);

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '修改模板信息成功'
                    });
                    this.findInfoTemplateOfPage();
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

        //启用
        async isStartByIdWithTx (id) {
            try {
                const res = await isStartByIdWithTx({infoTemplateId:id});

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '切换状态成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.findInfoTemplateOfPage();
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


