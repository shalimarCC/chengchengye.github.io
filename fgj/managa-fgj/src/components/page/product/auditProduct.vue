<template>
  <div class="filter-container" id="example">

    <div style="margin-bottom:20px;" class="searchcol">
        <el-button type="primary" @click="passAllAudit">批量通过</el-button>
        <el-button type="primary"  @click="auditList">刷新</el-button>
    </div>

    <el-table
        ref="multipleTable"
        :data="dataSource"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">

            <el-table-column
            type="selection"
            width="55">
            </el-table-column>

            <el-table-column
            prop="id"
            label="产品编号"
            align="center"
            >

            </el-table-column>

            <el-table-column
            prop="name"
            label="产品名称"
            align="center"
            >
            </el-table-column>

            <el-table-column
            prop="createTime"
            label="创建时间"
            align="center"
            show-overflow-tooltip>
                <template slot-scope="scope"><span>{{setTime(scope.row.createTime)}}</span></template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="250">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="checkProduct(scope.row.id)">查看</el-button>
                    <el-button type="success" size="small" @click="updateOk(scope.row.id)">通过</el-button>
                    <el-button type="danger" size="small" @click="updateNo(scope.row.id)">不通过</el-button>
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

    <el-dialog title="查看产品" :visible.sync="dialogFormVisible">
        <div style="height:400px;overflow-x:auto;">
        <el-form ref="form" :model="form" label-width="80px" style="min-width:400px;">
                <el-form-item label="产品类目" style="text-align:left;">
                    <span v-for="(info,key) in categoryName"  :key="key">
                        <span v-if="key<categoryName.length-1" style="font-size:16px;line-height:36px;">{{info}}>></span>
                        <span v-else style="font-size:16px;line-height:36px;">{{info}}</span>
                    </span>
                </el-form-item>

                <el-form-item label="产品编码" style="text-align:left;">
                    <span style="font-size:16px;line-height:36px;">{{form.id}}</span>
                </el-form-item>

                <el-form-item label="产品名称" style="text-align:left;" prop="name">
                    <span style="font-size:16px;line-height:36px;">{{form.name}}</span>
                </el-form-item>
            </el-form>

        <el-form ref="form" :model="form" label-width="80px" style="padding:20px 20px;min-width:400px;">
                <h4  style="text-align:left;">基本属性：</h4>
                <el-row :gutter="60">
                    <el-col :span="11" v-for="(info,key) in form.lists" :key="key">
                        <el-form-item v-if="info.mode == 1" :label="info.name" style="text-align:left;">
                            <el-select v-model="info.value" placeholder="请选择"  disabled>
                                <el-option
                                v-for="(item,k) in info.lists"
                                :key="item.id"
                                :label="item.value"
                                :value="item.id"
                                 placeholder="请选择">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item v-if="info.mode == 2" :label="info.name" style="text-align:left;">
                            <el-input v-model="info.value" disabled></el-input>
                        </el-form-item>

                        <el-form-item v-if="info.mode == 3" :label="info.name" style="text-align:left;">
                            <el-checkbox-group
                                v-model="info.value"
                                disabled
                                >
                                <el-checkbox v-for="val in info.lists" :label="val.id" :key="val.id">{{val.value}}</el-checkbox>
                            </el-checkbox-group>

                        </el-form-item>

                        <el-form-item v-if="info.mode == 4" :label="info.name" style="text-align:left;">
                            <el-tooltip class="item" effect="dark" :content="info.reminder" placement="right">
                                <el-date-picker
                                    v-model="info.value"
                                    type="datetime"
                                    disabled
                                    placeholder="选择日期时间">
                                </el-date-picker>
                            </el-tooltip>
                        </el-form-item>

                        <el-form-item v-if="info.mode == 5" :label="info.name" style="text-align:left;">
                            <el-tooltip class="item" effect="dark" :content="info.reminder" placement="right">
                                <el-input v-model="info.value" disabled></el-input>{{info.unit}}
                            </el-tooltip>
                        </el-form-item>

                        <el-form-item v-if="info.mode == 6" :label="info.name" style="text-align:left;">
                            <el-tooltip class="item" effect="dark" :content="info.reminder" placement="right">
                                <el-input v-model="info.value" disabled></el-input>{{info.unit}}
                            </el-tooltip>
                        </el-form-item>

                        <el-form-item v-if="info.mode == 7" :label="info.name" style="text-align:left;">
                            <el-tag
                            :key="tag"
                            v-for="tag in info.value">
                            {{tag}}
                            </el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <el-form ref="form" :model="form" label-width="120px" style="padding:20px 20px;min-width:400px;">
                <h4  style="text-align:left;">参数属性：</h4>
                <el-row :gutter="60">
                    <el-col :span="11" v-for="(info,index) in form.lists1" :key="index">
                        <el-form-item v-if="info.mode == 1" :label="info.name" style="text-align:left;">
                            <el-select v-model="info.value" disabled placeholder="请选择" style="width:100%;">
                                <el-option
                                v-for="item in info.lists"
                                :key="item.id"
                                :label="item.value"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item v-if="info.mode == 2" :label="info.name" style="text-align:left;">
                            <el-input v-model="info.value" disabled></el-input>
                        </el-form-item>

                        <el-form-item v-if="info.mode == 3" disabled :label="info.name" style="text-align:left;">
                            <el-checkbox-group
                                v-model="info.value"
                                disabled
                                >
                                <el-checkbox v-for="val in info.lists" :label="val.id" :key="val.id">{{val.value}}</el-checkbox>
                            </el-checkbox-group>

                        </el-form-item>

                        <el-form-item v-if="info.mode == 4" :label="info.name" style="text-align:left;">
                            <el-tooltip class="item" effect="dark" :content="info.reminder" placement="right">
                                <el-date-picker
                                    v-model="info.value"
                                    type="datetime"
                                    placeholder="选择日期时间"
                                    disabled>
                                </el-date-picker>
                            </el-tooltip>
                        </el-form-item>

                        <el-form-item v-if="info.mode == 5" :label="info.name" style="text-align:left;">
                            <el-tooltip class="item" effect="dark" :content="info.reminder" placement="right">
                                <el-input v-model="info.value" disabled></el-input>{{info.unit}}
                            </el-tooltip>
                        </el-form-item>

                        <el-form-item v-if="info.mode == 6" :label="info.name" style="text-align:left;">
                            <el-tooltip class="item" effect="dark" :content="info.reminder" placement="right">
                                <el-input v-model="info.value" disabled></el-input>{{info.unit}}
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

        <el-form ref="form" label-width="120px" style="min-width:400px;">
                <h4  style="text-align:left;">规格信息：</h4>
                <el-form-item :label="info.name" style="text-align:left;"  v-for="(info,index) in standardData" :key="index">
                      <el-radio v-model="showProductAttNameId" disabled :label="info.id">添加规格图片</el-radio>
                      <template>
                        <div class="skuList">
                            <el-table
                                :data="info.list"
                                border
                                min-height="500">

                                    <el-table-column
                                    label="规格值"
                                    min-width="100"
                                    align="center">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.value}}</span>
                                        </template>
                                    </el-table-column>

                                    <el-table-column
                                    label="图片"
                                    align="center"
                                    v-if="showProductAttNameId == info.id">
                                        <template slot-scope="scope">
                                                <img v-if="scope.row.pictureUrl" :src="scope.row.pictureUrl" style="width:50px;height:50px">
                                        </template>
                                    </el-table-column>
                                </el-table>
                        </div>
                      </template>
                </el-form-item>
            </el-form>
            </el-form>
        <el-form  ref="form" :model="form" label-width="120px" style="min-width:400px;">
                <h4  style="text-align:left;">产品图片：</h4>
                <el-form-item label="列表页图片" style="text-align:left;">
                    <template>
                        <el-card style="width:140px;float:left;margin:8px;position:relative;" v-if="imageUrl1 !== null" :body-style="{ padding: '0px' }">
                            <img :src="imageUrl1" class="image" style="width:140px;height:140px;">
                        </el-card>
                    </template>
                </el-form-item>

                <el-form-item label="轮播图图片" style="text-align:left;">
                    <template>
                        <div class="color-list">
                            <div class="color-item" v-for="(info,key) in file_logo_img_url">
                                <el-card style="width:140px;float:left;margin:8px;position:relative;" :body-style="{ padding: '0px' }">
                                    <img :src="info.url" class="image" style="width:140px;height:140px;">
                                </el-card>
                            </div>
                        </div>
                    </template>

                </el-form-item>

               <el-form-item label="产品详情" style="text-align:left;">
                    <template>
                        <quill-editor v-model="content"
                            ref="myQuillEditor">
                        </quill-editor>
                    </template>
                </el-form-item>
            </el-form>

        </div>
        <div slot="footer" class="dialog-footer" :span="24">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateOk(pid)">通 过</el-button>
        </div>
    </el-dialog>

    <el-dialog title="失败原因" :visible.sync="dialogFormVisible2">
        <el-input
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 6}"
        placeholder="请输入内容"
        v-model="textarea">
        </el-input>
        <div slot="footer" class="dialog-footer" :span="24">
          <el-button @click="dialogFormVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="updateStatusNo">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>


<script>
import { quillEditor } from 'vue-quill-editor'
import {auditList,passAllAudit,updateStatus,productById,idToName,findByProductIdAndAttNameId,attributeValueByProductIdAndCategoryId,} from '../../../api/getData';
export default {
    data() {
        return {
            dataSource: [],
            offset: 0,
            count: null,
            multipleSelection: [],
            passAll:[],
            dialogFormVisible:false,
            dialogFormVisible2:false,
            categoryName:'',
            form:{
                categoryId:[],
                id:'',
                name:'',
                chineseName:'',
                lists:[]
            },
            ruleForm:{
                pageSize:10,
                pageNo:1,
            },
            file_logo_img_url : [],
            imageUrl1: null,
            content:'',
            catProps:{
                value:'id',
                children:'lists',
                label:'name'
            },
            textarea:"",
            pid:'',
            spuId:'',
            standardData:'',
            showProductAttNameId:''
        }
    },
    created() {
        this.auditList();
    },
    components: {
        quillEditor
    },
    methods: {
        //获取列表
        async auditList() {
            try {

                this.listLoading = false;
                const res = await auditList(this.ruleForm);

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
            this.auditList()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageNo;
            this.auditList()
        },

        handleSelectionChange (selection) {
            let arr = new Array;
            $.each(selection,function(key,info){
                arr.push(info.id);
            })
            this.passAll = arr;
        },

        //时间戳转换
        setTime(time) {
            const t = new Date(time);
            let y = t.getFullYear();
            let m = t.getMonth() + 1;
            let d = t.getDate();
            if (m < 10) {
                m = '0' + m
            }
            if (d < 10) {
                d = '0' + d
            }

            return y + '-' + m + '-' + d
        },

        //查看产品信息
        async checkProduct (pid) {
            try{
                this.dialogFormVisible = true;
                this.form = {
                    categoryId:[],
                    id:'',
                    name:'',
                    chineseName:'',
                    lists:[]
                };
                this.pid = pid;
                const res = await productById({ id:pid });
                if (res.data.code == 0) {
                    let data = res.data.data;

                    this.form.categoryId = data.categoryId;
                    this.form.name = data.name;   //名称
                    this.categoryId = data.categoryPId[data.categoryPId.length-1]//类目ID
                    this.spuId = data.id; //产品ID
                    this.form.chineseName = data.chineseName; //品牌
                    this.idToName(data.categoryPId);
                    this.attributeValueByProductIdAndCategoryId();
                    this.categoryAttNameByCId(data.categoryAttNameValuseList) //轮播图
                    this.parameterCategoryAttNameValuse(data.parameterCategoryAttNameValuse);

                    this.showProductAttNameId = res.data.data.showProductAttNameId;
                    this.imageUrl1 = data.url; //列表页图片

                    this.file_logo_img_url = data.pictureList;
                    this.content = data.content //富文本
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch(err){
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });
            }
        },

        //根据类目Id获取类目名
        async idToName (pid) {
            try {

                const res = await idToName({ids:JSON.stringify(pid)});

                if (res.data.code == 0) {
                    this.categoryName = res.data.data;
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
        //根据类目Id获取类目属性和属性值
        async categoryAttNameByCId (res) {

            var tfis = this;

            this.form.lists = [];
            $.each(res,function(key,info){
                if(info.attributeNameDTO.mode == 3){
                    tfis.form.lists.push({
                        value: info.values,
                        key: info.attributeNameDTO.id,
                        name:info.attributeNameDTO.name,
                        mode:info.attributeNameDTO.mode,
                        lists:info.lists,
                        reminder:info.attributeNameDTO.reminder
                    })
                }else if(info.attributeNameDTO.mode == 1){
                    tfis.form.lists.push({
                        value: info.value,
                        key: info.attributeNameDTO.id,
                        name:info.attributeNameDTO.name,
                        mode:info.attributeNameDTO.mode,
                        lists:info.lists,
                        reminder:info.attributeNameDTO.reminder
                    })
                }else{
                    tfis.form.lists.push({
                        value: info.value,
                        key: info.attributeNameDTO.id,
                        name:info.attributeNameDTO.name,
                        mode:info.attributeNameDTO.mode,
                        lists:info.lists,
                        reminder:info.attributeNameDTO.reminder,
                        unit:info.attributeNameDTO.unit
                    })
                }
            })
        },
        //根据类目Id获取类目属性和属性值
        async parameterCategoryAttNameValuse (res) {

            var tfis = this;

            this.form.lists1 = [];
            $.each(res,function(key,info){
                if(info.attributeNameDTO.mode == 3){
                    tfis.form.lists1.push({
                        value: info.values,
                        key: info.attributeNameDTO.id,
                        name:info.attributeNameDTO.name,
                        mode:info.attributeNameDTO.mode,
                        lists:info.lists,
                        reminder:info.attributeNameDTO.reminder
                    })
                }else if(info.attributeNameDTO.mode == 1){
                    tfis.form.lists1.push({
                        value: info.value,
                        key: info.attributeNameDTO.id,
                        name:info.attributeNameDTO.name,
                        mode:info.attributeNameDTO.mode,
                        lists:info.lists,
                        reminder:info.attributeNameDTO.reminder
                    })
                }else{
                    tfis.form.lists1.push({
                        value: info.value,
                        key: info.attributeNameDTO.id,
                        name:info.attributeNameDTO.name,
                        mode:info.attributeNameDTO.mode,
                        lists:info.lists,
                        reminder:info.attributeNameDTO.reminder,
                        unit:info.attributeNameDTO.unit
                    })
                }
            })
        },
        // 根据spuID查询属于SPU的规格值
        async attributeValueByProductIdAndCategoryId () {
            try {
                const res = await attributeValueByProductIdAndCategoryId({productId:this.spuId,categoryId:this.form.categoryId});

                if (res.data.code == 0) {
                    var tfis = this;
                    tfis.standardData = [];
                    $.each(res.data.data,function(key,info){
                        let obj = new Object();
                        obj.name = info.name;
                        obj.id = info.id;
                        obj.list = info.attributeValueList;
                        tfis.standardData.push(obj);
                    })
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
        // 根据spuID查询属于SPU的规格值
        async findByProductIdAndAttNameId (id) {
            try {
                this.multipleSelection = [];
                this.dialogFormVisible = true;
                const res = await findByProductIdAndAttNameId({productId:this.spuId,attNameId:id});

                if (res.data.code == 0) {
                    this.standaList = res.data.data;
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
        //批量通过
        async passAllAudit () {
            try {
                const res = await passAllAudit({ ids:JSON.stringify(this.passAll) });
                if (res.data.code == 0) {
                    this.$notify({
                        title: '审批',
                        message: res.data.data,
                        type: 'success',
                        duration: 2000
                    });
                    this.auditList()

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
        //审批通过
        async updateOk (id) {
            try {
                const res = await updateStatus({ id:id,status:3 });

                if (res.data.code == 0) {
                    this.$notify({
                        title: '审批',
                        message: res.data.data,
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.auditList()
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
        //审批不通过
        updateNo (id) {
            this.dialogFormVisible2 = true;
            this.textarea = '';
            this.pid = id;
        },
        async updateStatusNo () {
             try {
                const res = await updateStatus({ id:this.pid,status:4,cause:this.textarea });

                if (res.data.code == 0) {
                    this.$notify({
                        title: '审批',
                        message: res.data.data,
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible2 = false;
                    this.auditList()
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
        }


    }
}
</script>

<style scoped>
#example {
    padding: 5px 20px;
}
.quill-editor{
    width:80%;
}
</style>


