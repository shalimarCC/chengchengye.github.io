<template>
    <div id="example">
        <el-table :data="dataSource"  border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="模板名称" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="所属客户端" min-width="150">
                <template slot-scope="scope">
                    <span v-if="scope.row.clientType==5">PC端</span>
                    <span v-if="scope.row.clientType==6">移动端</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="最低支持版本" min-width="150">
                <template slot-scope="scope">
                    <span v-if="scope.row.clientVersionARemark != scope.row.clientVersionIRemark">{{scope.row.clientVersionARemark}},{{scope.row.clientVersionIRemark}}</span>
                    <span v-else>{{scope.row.clientVersionARemark}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="模板备注" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.remark}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" min-width="150">
                <template slot-scope="scope">
                    <el-button size="mini" @click="editCmsTemp(scope.row.id)" :disabled="scope.row.id<3">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-container" style="text-align: left;margin-top: 10px;">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageNo"
            :page-sizes="[2,10,20,30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count">
            </el-pagination>
        </div>
        <!-- 编辑 -->
        <el-dialog :visible.sync="dialogVisible" width="40%">
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="模板名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="所属客户端">
                    <el-select v-model="form.clientType" disabled>
                        <el-option label="PC端" value="5"></el-option>
                        <el-option label="移动端" value="6"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="安卓最低版本" v-if="form.clientType==6">
                    <el-select v-model="form.clientVersionAId" placeholder="请选择">
                        <el-option
                          v-for="item in optionsAnd"
                          :key="item.id"
                          :label="item.versionsMark"
                          :value="item.id">
                        </el-option>
                      </el-select>
                </el-form-item>
                <el-form-item label="IOS最低版本" v-if="form.clientType==6">
                    <el-select v-model="form.clientVersionIId" placeholder="请选择">
                        <el-option
                          v-for="item in optionsIos"
                          :key="item.id"
                          :label="item.versionsMark"
                          :value="item.id">
                        </el-option>
                      </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editComfirm(form.id)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../config/env';
import {findCmsTemplateOfPage,findCmsTemplateById,findVersionsAll,updateCmsTemplateByIdWithTx} from '../../../api/getData';
export default{
    data(){
        return {
            dataSource:[],
            count:null,
            pageNo:1,
            pageSize:10,
            dialogVisible:false,
            optionsAnd:[],
            optionsIos:[],
            form:{
                name:'',
                clientType:'',
                clientVersionAId:'',
                clientVersionIId:'',
                id:''
            }
        }
    },
    created () {
       this.findCmsTemplateOfPage();
    },
    methods:{
        //获取模板接口
        async findCmsTemplateOfPage() {
            try {
                const res = await findCmsTemplateOfPage({type:1,pageNo:this.pageNo,pageSize:this.pageSize});
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
            this.listUnitStatus=[];
            this.pageSize = val;
            this.findCmsTemplateOfPage();
        },
        handleCurrentChange(val) {
            this.listUnitStatus=[];
            this.pageNo = val;
            this.offset = (val - 1) * this.pageSize;
            this.findCmsTemplateOfPage();
        },
        //编辑
        editCmsTemp(id){
            this.dialogVisible = true;
            this.findCmsTemplateById(id);
            this.findVersionsAll();
            this.findVersionsAll2();
        },
        //编辑按Id查询
        async findCmsTemplateById(id) {
            try {
                const res = await findCmsTemplateById({id:id});
                if (res.data.code == 0) {
                    this.form = res.data.data;
                    this.form.clientType = res.data.data.clientType.toString();
                    this.form.clientVersionAId = res.data.data.clientVersionAId;
                    this.form.clientVersionIId = res.data.data.clientVersionIId;
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
        //获取安卓版本编号
        async findVersionsAll() {
            try {
                const res = await findVersionsAll({type:0});
                if (res.data.code == 0) {
                    this.optionsAnd = res.data.data;
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
        //获取IOS版本编号
        async findVersionsAll2() {
            try {
                const res = await findVersionsAll({type:1});
                if (res.data.code == 0) {
                    this.optionsIos = res.data.data;
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
        //编辑保存
        async updateCmsTemplateByIdWithTx() {
            try {
                const obj = new Object();
                obj.id = this.form.id;
                obj.name = this.form.name;
                obj.clientType = this.form.clientType;
                obj.clientVersionAId = this.form.clientVersionAId;
                obj.clientVersionIId = this.form.clientVersionIId;
                const res = await updateCmsTemplateByIdWithTx(obj);
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    });
                    this.dialogVisible = false;
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
        //编辑保存
        editComfirm(){
           this.updateCmsTemplateByIdWithTx();
        }
    }
}
</script>

<style scoped>
#example {
    padding: 10px 20px;
}
</style>