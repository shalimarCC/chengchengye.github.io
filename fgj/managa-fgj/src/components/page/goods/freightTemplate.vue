<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="模板名称" v-model="ruleForm.name"></el-input>

        <el-select v-model="ruleForm.isValid" placeholder="模板状态" style="width: 200px;margin-right:15px;">
            <el-option label="停用" value="0">
            </el-option>
            <el-option label="启用" value="1">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.storeId" collapse-tags placeholder="所属总店" style="width: 200px;margin-right:15px;">
            <el-option
                v-for="item in storeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.merchantId" collapse-tags>
            <el-option
                v-for="item in merchantIdList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>

        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm" size="medium">重置</el-button>

    </div>
    <div style="margin-bottom:20px;height:30px;">
        <el-button class="filter-item" @click="addVersions" size="medium" type="primary" icon="edit">新增</el-button>

    </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="模板名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="是否包邮" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.isExemption==0">否</span>
                <span v-else-if="scope.row.isExemption==1">是</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="运费规则" min-width="200">
            <template slot-scope="scope">
                <span>{{scope.row.freightRegulation}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="发货说明" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.shipmentsExplain}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="所属运营方" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.merchantName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="所属总店" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.storeName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="模板状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.isValid==0">停用</span>
                <span v-else-if="scope.row.isValid==1">启用</span>
            </template>
        </el-table-column>

       <el-table-column align="center" label="操作" width="250">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="editVersions(scope.row.id)">编辑</el-button>
                <el-button type="primary" size="small" :disabled="scope.row.isValid == 1" plain @click="startFreight(scope.row.id,1)">启用</el-button>

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
        <el-form label-width="120px">
                <el-form-item label="模板名称">
                    <el-input v-model="freightForm.name"></el-input>
                </el-form-item>

                <el-form-item label="所属运营方">
                    <el-select v-model="freightForm.merchantId" collapse-tags>
                        <el-option
                            v-for="item in merchantIdList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="所属总店">
                    <el-select v-model="freightForm.storeId" collapse-tags>
                        <el-option
                            v-for="item in storeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="是否包邮">
                    <el-radio-group v-model="freightForm.isExemption">
                        <el-radio :label="0">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="运费规则">
                    <ul>
                        <li v-for="(info,key) in freightForm.freightRegulations" style="margin:10px 0;">
                            订单不满<el-input-number v-model="info.orderMoney"  controls-position="right" :disabled="freightForm.isExemption==1" style="width:100px;"></el-input-number>元,运费<el-input-number v-model="info.freightMoney"  controls-position="right" :disabled="freightForm.isExemption==1" @change="praseIntEnter()"  style="width:100px;"></el-input-number>元
                            <el-button type="danger" icon="el-icon-delete" circle style="margin-left:50px;" :disabled="key==0"  size="mini" @click="delFreightRegulations(key)"></el-button>
                        </li>
                    </ul>
                    <el-button type="success" size="mini" icon="el-icon-plus" :disabled="freightForm.isExemption==1"  @click="addFreightRegulations">添加</el-button>
                </el-form-item>

                <el-form-item label="发货说明">
                    <el-input v-model="freightForm.shipmentsExplain"></el-input>
                </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="saveVersions">确 定</el-button>
        </div>

    </el-dialog>



  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {findFreightTemplateOfPage,findStartedMerchantList,insertFreightTemplateWithTx,updateFreightTemplateByIdWithTx,findFreightTemplateById,startFreightTemplateWithTx,
findRootStoreAll} from '../../../api/getData';
export default {
    data() {
        return {
            listLoading:true,
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            dialogFormVisible:false,
            ruleForm:{
                name:'',
                isValid:'',
                storeId:'',
                pageNo:1,
                pageSize:10
            },
            freightForm:{
                id:'',
                merchantId:'',
                name:'',
                shipmentsExplain:'',
                isExemption:0,
                freightRegulations:[
                    {
                        orderMoney:'',
                        freightMoney:''
                    }
                ],
                storeId:''

            },
            title:'新增运费模板',
            storeList:[],
            merchantList:[
                {
                    id:1,
                    name:'自营'
                },
                {
                    id:2,
                    name:'券仓'
                },
                {
                    id:3,
                    name:'网店管家'
                },
                {
                    id:4,
                    name:'聚合数据'
                },
            ],
            merchantIdList:[]
        }
    },
    created() {
        this.findFreightTemplateOfPage();
        this.findRootStoreAll();
        this.findStartedMerchantList();
    },

    methods: {
        praseIntEnter(id){
          let that = this;
          this.$nextTick(() => {
              $.each(that.freightForm.freightRegulations,function(key,info){
                info.freightMoney = Math.ceil(info.freightMoney);
                that.$forceUpdate();
                console.log(info.freightMoney);
            });
          })
        },
        //获取总店列表
        async findRootStoreAll () {
            try {
                const res = await findRootStoreAll();
                if (res.data.code == 0) {
                    this.storeList = res.data.data;
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
        async findFreightTemplateOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findFreightTemplateOfPage(obj);

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
        //获取所有运营方
        async findStartedMerchantList(){
            try {
                const res = await findStartedMerchantList();
                if (res.data.code == 0) {
                    this.merchantIdList = res.data.data;
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
            this.findFreightTemplateOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findFreightTemplateOfPage()
        },


        //重置
        resetForm(){
            this.ruleForm = {
                name:'',
                isValid:'',
                pageNo:1,
                pageSize:10
            }
            this.findFreightTemplateOfPage();
        },
        //搜索
        handleFilter(){
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;
            this.findFreightTemplateOfPage();
        },
        //新增
        addVersions(){
            this.freightForm = {
                id:'',
                merchantId:1,
                name:'',
                shipmentsExplain:'',
                isExemption:0,
                freightRegulations:[
                    {
                        orderMoney:'',
                        freightMoney:''
                    }
                ],
            };
            this.title = '新增运费模板';
            this.dialogFormVisible = true;
        },

        //添加规则
        addFreightRegulations(){
            this.freightForm.freightRegulations.push({orderMoney:'',freightMoney:''});
        },
        //删除规则
        delFreightRegulations(index){
            this.freightForm.freightRegulations.splice(index,1);
        },

        //编辑

        async editVersions(id) {
            try {
                const res = await findFreightTemplateById({freightTemplateId:id});

                if (res.data.code == 0) {
                    let data = res.data.data;
                    this.freightForm = data;
                    this.title = '编辑运费模板';
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

        //保存按钮
        saveVersions(){
            let obj = JSON.parse(JSON.stringify(this.freightForm));
            if(obj.isExemption == 1){
                obj.freightRegulations = '[]';
            }else{
                obj.freightRegulations = JSON.stringify(this.freightForm.freightRegulations);
            }
            if(this.freightForm.id == ''){
                this.insertFreightTemplateWithTx(obj);
            }else{
                this.updateFreightTemplateByIdWithTx(obj);
            }
        },

        //新增保存

        async insertFreightTemplateWithTx(obj) {
            try {
                const res = await insertFreightTemplateWithTx(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '新增模板成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findFreightTemplateOfPage();
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

        //修改保存

        async updateFreightTemplateByIdWithTx(obj) {
            try {
                const res = await updateFreightTemplateByIdWithTx(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '修改模板成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findFreightTemplateOfPage();
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

        startFreight(id,isValid){
            this.$confirm('设为启用后将使用该运费模板，确认启用？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.startFreightTemplateWithTx(id,isValid);
            }).catch(() => {
            })
        },
        //启用停用

        async startFreightTemplateWithTx(id,isValid) {
            try {
                const res = await startFreightTemplateWithTx({freightTemplateId:id});

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '修改状态成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.findFreightTemplateOfPage();
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


