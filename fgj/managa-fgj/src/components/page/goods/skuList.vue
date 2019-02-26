<template>
  <div class="filter-container" id="example">

    <div style="margin-bottom:20px;">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="sku编码" v-model="ruleForm.skuSerialNumber"></el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="产品名称" v-model="ruleForm.standardProductUnitName"></el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="sku名称" v-model="ruleForm.skuName"></el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="规格码" v-model="ruleForm.code"></el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="条形码" v-model="ruleForm.barCode"></el-input>
    </div>

    <div style="margin-bottom:20px;">
        <el-select v-model="ruleForm.isAvailable" placeholder="启用／停用">
            <el-option
            label="启用"
            value="1">
            </el-option>
            <el-option
            label="停用"
            value="0">
            </el-option>

        </el-select>


        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>

        <el-button class="filter-item" @click="uploadSkuExcel" style="float:right" type="primary" icon="el-icon-circle-plus">导出Excel</el-button>
        <el-button class="filter-item" @click="checkSku(0)" style="float:right" type="warning" icon="el-icon-error">停用</el-button>
        <el-button class="filter-item" @click="updateAvailable(1)" style="float:right" type="success" icon="el-icon-success">启用</el-button>
    </div>


    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit height="680" highlight-current-row  @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column type="selection" width="80" align="center"></el-table-column>
        <el-table-column align="center" label="最后同步时间" min-width="80">

        </el-table-column>
        <el-table-column align="center" label="最后编辑时间" min-width="100">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.updateTime)}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="sku编码" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.skuSerialNumber}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="条形码" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.barCode}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="产品名称" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.standardProductUnitName}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="sku名称" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.skuName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="规格码" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.code}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="商品ID" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.externalSkuId}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="启用／停用" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.isAvailable==1">启用</span>
                <span v-if="scope.row.isAvailable==0">停用</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="有效性状态" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.isValid==1">有效</span>
                <span v-if="scope.row.isValid==0">失效</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="图片" min-width="100">
            <template slot-scope="scope">
                <img :src="scope.row.skuPicUrl" :alt="scope.row.name" style="width:50px;height:50px;">
            </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250">
            <template slot-scope="scope">
                <el-button type="primary" size="small" v-if="scope.row.isValid==0" plain @click="updateSkuByIdWithTx(scope.row.id,1)">设为有效</el-button>
                <el-button type="primary" size="small" v-else plain @click="checkSkuByIdWithTx(scope.row.id,0)">设为失效</el-button>
                <el-button type="primary" size="small" plain @click="updateSkuId(scope.row.id,scope.row.externalSkuId)">输入商品ID</el-button>
                <el-button type="primary" size="small" plain @click="updateCode(scope.row.id,scope.row.barCode)">输入条形码</el-button>
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

    <el-dialog
        width="25%"
        :visible.sync="innerVisible"
        append-to-body>
        <el-form ref="form" :model="innerForm" label-width="120px">
            <el-form-item label="输入商品ID">
                <el-input v-model="innerForm.externalSkuId" maxlength="50"></el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="innerVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateExternalSkuIdBackStage">确定</el-button>
        </div>
    </el-dialog>

    <el-dialog
        width="25%"
        :visible.sync="innerVisible2"
        append-to-body>
        <el-form ref="form" :model="innerForm" label-width="120px">
            <el-form-item label="输入条形码">
                <el-input v-model="innerForm.barCode"></el-input>
                <!-- <el-input v-model="innerForm.barCode" onkeyup="value=value.replace(/[\W]/g,'')" onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))" /> -->
                </el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="innerVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="updateSkuParamsBackStage">确定</el-button>
        </div>
    </el-dialog>

    </div>
  </div>
</template>


<script>
import { baseUrl } from '../../../config/env'
import {findSkuOfPage,isAvailableWithTx,excelExport,updateSkuByIdWithTx,updateExternalSkuIdBackStage,updateSkuParamsBackStage} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm: {
                skuSerialNumber: "",
                standardProductUnitName: "",
                skuName:"",
                code:"",
                barCode:"",
                pageNo:1,
                pageSize:10
            },
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            skuCheckList:[],
            dialogFormVisible:false,
            stockTitle:'进货',
            stockType:1,
            skuId:'',
            externalSkuId:'',
            innerVisible:false,
            innerVisible2:false,
            innerForm:{
                externalSkuId:'',
                barCode:'',
            },
            platformId:''
        }
    },
    created() {
        this.findSkuOfPage();
    },

    methods: {
        updateCode(skuId,barCode){
            this.skuId=skuId;
            this.innerForm.barCode=barCode;
            this.innerVisible2=true;
        },
        async updateSkuParamsBackStage(){
            try {
                // var regExp = /^[^\u4e00-\u9fa5]+$/ ;
                // if(regExp.test(this.innerForm.barCode)){
                //     this.$message({
                //         type: 'error',
                //         message: '条形码不可包含中文字符'
                //     });
                //     return false;
                // }

                var reg =  /^[0-9a-zA-Z]*$/;
                if(!reg.test(this.innerForm.barCode)){
                    this.$message({
                        type: 'error',
                        message: '条形码不可包含中文字符'
                    });
                    return false;
                }

                const res = await updateSkuParamsBackStage({ skuId:this.skuId,barCode:this.innerForm.barCode});

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message:'保存成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.innerVisible2=false;
                    this.findSkuOfPage()

                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '网络错误'
                });

            }
        },

        updateSkuId(skuId,externalSkuId){
            this.skuId=skuId;
            this.innerForm.externalSkuId=externalSkuId;
            this.innerVisible=true;
        },
        async updateExternalSkuIdBackStage(){
            try {
                var reg =  /^[0-9a-zA-Z-\_]*$/;
                if(!reg.test(this.innerForm.externalSkuId)){
                    this.$message({
                        type: 'error',
                        message: '商品ID不合法,请输入数字或字母'
                    });
                    return false;
                }

                const res = await updateSkuParamsBackStage({ skuId:this.skuId,externalSkuId:this.innerForm.externalSkuId});

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message:'保存成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.innerVisible=false;
                    this.findSkuOfPage()

                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '网络错误'
                });

            }
        },

        //获取列表
        async findSkuOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findSkuOfPage(obj);

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
            this.findSkuOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findSkuOfPage()
        },

        //搜索
        handleFilter() {
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;

            this.findSkuOfPage();
        },
        //重置
        resetForm() {
            this.ruleForm = {
                skuSerialNumber: "",
                standardProductUnitName: "",
                skuName:"",
                code:"",
                barCode:"",
                pageNo:1,
                pageSize:10
            }
            this.findSkuOfPage();
        },

        //复选
        handleSelectionChange(val) {
            let thtf = this;

            thtf.skuCheckList = [];
            $.each(val,function(key,info){
                thtf.skuCheckList.push(info.id);
            })
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

        checkSku (type) {
            if(this.skuCheckList.length != 0){
                this.$confirm('sku停用后对应的pu将调整为已下架状态，确认停用？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'danger'
                }).then(() => {
                    this.updateAvailable(type);
                }).catch(() => {

                })
            }else{
                this.$message({
                    type: 'error',
                    message: '未选择SKU'
                });
            }

        },
        //启用/停用
        async updateAvailable (type) {
            try {
                if(this.skuCheckList.length == 0){
                    this.$message({
                        type: 'error',
                        message: '未选择SKU'
                    });
                    return;
                }
                const res = await isAvailableWithTx({ ids:JSON.stringify(this.skuCheckList),isAvailable:type});

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message:'改变状态成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.findSkuOfPage()

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


        checkSkuByIdWithTx (id,isValid) {
            this.$confirm('sku失效后对应的pu将调整为失效状态，确认设为失效？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'danger'
            }).then(() => {
              this.updateSkuByIdWithTx(id,isValid);
            }).catch(() => {

            })
        },
        //有效/失效
        async updateSkuByIdWithTx (id,isValid) {
            try {

                const res = await updateSkuByIdWithTx({id:id,isValid:isValid});

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message:'改变状态成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.findSkuOfPage()

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
        //下载
        async uploadSkuExcel () {
            // try {
            //     const res = await excelExport();
            //     if (res.data.code == 0) {
            //         window.open(res.data.data.url);
            //     } else {
            //         this.$message({
            //             type: 'error',
            //             message: res.data.error
            //         });
            //     }
            // } catch (err) {
            //     this.$message({
            //         type: 'error',
            //         message: '获取数据失败,请联系管理员！404'
            //     });
            //
            // }
            this.platformId = this.$store.state.Cookie.mutations.fetch().platformId;
            window.location.href = baseUrl+"/back-product-web/product/sku/excelExport.do?platformId="+this.platformId;
        },

    }
}
</script>

<style scoped>
#example {
    padding: 10px 20px;
}
</style>


