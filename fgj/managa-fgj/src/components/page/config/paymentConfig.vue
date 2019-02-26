<template>
  <div class="filter-container" id="example">
    <el-table :key='tableKey' :data="payTypeData" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%; margin-top:30px;">
    <!-- <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%"> -->

        <el-table-column align="center" label="前端类型" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="支付方式" min-width="120">
            <template slot-scope="scope">
                <span>{{scope.row.payTypeName.join('、')}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="备注" min-width="300" style="width:300px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis">
            <template slot-scope="scope">
                <span>{{scope.row.clientPayTypeRemarks}}</span>
            </template>
        </el-table-column>

       <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="editPayType(scope.row.id)">编辑</el-button>
            </template>
        </el-table-column>

    </el-table>

    <!-- <div class="pagination-container" style="text-align: left;margin-top: 10px;">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="ruleForm.pageNo"
        :page-sizes="[10,20,30, 50]"
        :page-size="ruleForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
        </el-pagination>
    </div> -->


    <el-dialog :title="title" :visible.sync="dialogFormVisible" v-if="dialogFormVisible">
        <el-form label-width="120px">
                <el-form-item label="前端类型" style="width:200px;">
                    <el-input disabled="disabled" v-model="payTypeForm.name"></el-input>
                </el-form-item>
                <p v-if="payTypeForm.id == 2" class="wechatTips">提示: 微信公众号暂时只支持微信支付</p>

                <el-form-item label="支付方式及排序">
                    <div v-if="payTypeForm.id != 2">
                        <div v-for="(item,index) in payTypeForm.cmsClientPayTypeConfigVOList">
                            <el-checkbox :true-label="0" :false-label="1" v-model="item.isStop">
                                {{item.payTypeName}}
                            </el-checkbox>
                            <el-input-number v-model="item.indexCode" :min="1" :disabled="item.isStop == 1"></el-input-number>
                        </div>
                    </div>

                    <div v-if="payTypeForm.id == 2">
                        <div v-for="(item,index) in payTypeForm.cmsClientPayTypeConfigVOList">
                            <el-checkbox :true-label="0" :false-label="1" v-model="item.isStop" :disabled="item.payTypeName != '微信'">
                                {{item.payTypeName}}
                            </el-checkbox>
                            <el-input-number v-model="item.indexCode" :min="1" :disabled="item.isStop == 1"></el-input-number>
                        </div>
                    </div>
                </el-form-item>
                <p class="configTips">* 数字表示支付方式在前端显示的顺序，数字越大越靠前，数字不能重复。</p>

                <el-form-item label="备注">
                    <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6}"
                    placeholder="请输入内容"
                    v-model="payTypeForm.clientPayTypeRemarks">
                    </el-input>
                </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="updatePayType">确 定</el-button>
        </div>

    </el-dialog>



  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import { baseUrl } from '../../../config/env'
import {findAllClientPayType,findClientPayTypeByClientId,updateClientPayTypeByClientId} from '../../../api/getData';
export default {
    data() {
        return {
            listLoading:true,
            payTypeData: [],
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            dialogFormVisible:false,
            ruleForm:{
                id:'',
                versionsMark:'',
                type:'',
                versionStatus:'',
                pageNo:1,
                pageSize:10
            },
            payTypeForm:{
                id:'',
                name:'',
                payTypeName:'',
                cmsClientPayTypeConfigVOList:'',
                clientPayTypeRemarks:'',
                description:'',
                createTime:'',
                updateTime:''
            },
            title:'编辑第三方支付方式',

        }
    },
    created() {
        this.findAllClientPayType();
    },

    methods: {
        //获取所有第三方支付方式
        async findAllClientPayType() {
            try {

                this.listLoading = false;
                const res = await findAllClientPayType();

                if (res.data.code == 0) {
                    this.payTypeData = res.data.data.list;
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

        // //分页
        // handleSizeChange(val) {
        //     this.ruleForm.pageSize = val;
        //     this.findVersionsOfPage()
        // },
        // handleCurrentChange(val) {
        //     this.ruleForm.pageNo = val;
        //     this.offset = (val - 1) * this.ruleForm.pageSize;
        //     this.findVersionsOfPage()
        // },


        // //重置
        // resetForm(){
        //     this.ruleForm = {
        //         id:'',
        //         versionsMark:'',
        //         type:'',
        //         pageNo:1,
        //         pageSize:10
        //     }
        //     this.findVersionsOfPage();
        // },
        // //搜索
        // handleFilter(){
        //     this.findVersionsOfPage();
        // },


        //编辑
        async editPayType(id) {
            try {
                const res = await findClientPayTypeByClientId({clientId:id});

                if (res.data.code == 0) {
                    this.payTypeForm = {
                        id:res.data.data.list.id,
                        name:res.data.data.list.name,
                        payTypeName:res.data.data.list.payTypeName,
                        cmsClientPayTypeConfigVOList:res.data.data.list.cmsClientPayTypeConfigVOList,
                        clientPayTypeRemarks:res.data.data.list.clientPayTypeRemarks,
                        description:res.data.data.list.description,
                        createTime:res.data.data.list.createTime,
                        updateTime:res.data.data.list.updateTime
                    };

                    this.title = '编辑第三方支付方式';
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

        //更新支付方式
        async updatePayType() {
            try {
                let checkStatus = false;
                let checkList = this.payTypeForm.cmsClientPayTypeConfigVOList;
                let indexList = [];

                for(let i=0;i<checkList.length;i++){
                    if (checkList[i].isStop == 0) {
                        checkStatus = true;
                        indexList.push(checkList[i].indexCode);
                    }
                }
                if (checkStatus == false) {
                    this.$message({
                            type: 'error',
                            message: '至少需启用一项支付方式'
                    });
                    return;
                }

                for (let j=0;j<indexList.length;j++) {
                    if (indexList.indexOf(indexList[j]) != indexList.lastIndexOf(indexList[j])){
                        this.$message({
                            type: 'error',
                            message: '数字不能重复'
                        });
                        return;
                    }
                };

                if (this.payTypeForm.clientPayTypeRemarks.length > 500) {
                    this.$message({
                        type: 'error',
                        message: '备注字数最多输入 500 字'
                    });
                    return;
                }

                let obj = JSON.parse(JSON.stringify(this.payTypeForm));
                obj.cmsClientPayTypeConfigVOList = JSON.stringify(this.payTypeForm.cmsClientPayTypeConfigVOList);
                console.log(obj);
                const res = await updateClientPayTypeByClientId(obj);
                console.log(obj);
                if (res.data.code == 0) {
                    this.dialogFormVisible = false;
                    this.findAllClientPayType();
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

    }
}
</script>

<style scoped>
#example {
    padding: 10px 20px;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

.el-checkbox__label {
    line-height: 0;
}

.el-input-number {
    position: absolute;
    left: 100px;
}

.el-checkbox+.el-checkbox {
    margin-left: 0;
}

.configTips {
    width: 300px;
    margin-left: 120px;
    margin-bottom: 15px;
    color: #c0c4cc;
}

.wechatTips {
    margin-top: -10px;
    margin-bottom: 10px;
    margin-left: 120px;
    color: #ff0808;
}
</style>


