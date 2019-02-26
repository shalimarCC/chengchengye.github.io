<template>
    <div id="example" v-if="active==1">
        <template>
            <div style="padding:20px 100px;min-width:400px;width:800px;">
                <h4 style="text-align:left;margin-bottom:20px;">基本信息：</h4>
                <el-form ref="form" :model="form" label-width="80px" style="min-width:400px;width:600px;">
                    <el-form-item label="类目ID" style="text-align:left;">
                        <span style="font-size:16px;line-height:36px;">{{form.id}}</span>
                    </el-form-item>

                    <el-form-item label="上级类目" style="text-align:left;">
                        <span style="font-size:16px;line-height:36px;">{{form.pids}}</span>
                    </el-form-item>

                    <el-form-item label="类目名称" style="text-align:left;" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>

                    <el-form-item label="类目排序" prop="listSort" style="text-align:left;">
                        <el-input-number controls-position="right" v-model="form.listSort" :min="1" label="类目排序"></el-input-number>
                    </el-form-item>

                    <el-form-item label="类目编号" prop="serialNumber" style="text-align:left;">
                        <span style="font-size:16px;line-height:36px;">{{form.serialNumber}}</span>
                    </el-form-item>

                    <el-form-item label="节点标签" style="text-align:left;">
                        <el-tag
                        :key="tag.id"
                        v-for="(tag,key) in checkLabel"
                        closable
                        @close="tagClose(key)">
                        {{tag.name}}
                        </el-tag>

                        <el-button class="button-new-tag" size="small" @click="addLabel">+ 添加标签</el-button>
                    </el-form-item>

                    <el-form-item label="类目备注" style="text-align:left;">
                        <el-input type="textarea" :rows="3" v-model="form.description"></el-input>
                    </el-form-item>
                </el-form>
                <div><el-button style="margin-top: 12px;" @click='modifyCategory()'>保存</el-button></div>
            </div>
        </template>

        <template>
            <div style="padding:20px 100px;min-width:400px;width:800px;">
                <h4 style="text-align:left;margin-bottom:20px;">基本属性：</h4>
                <el-table :data="dataSource" border fit highlight-current-row style="width: 100%">

                    <el-table-column align="center" label="分组名称" width="120">
                        <template slot-scope="scope">
                            <span>{{scope.row.title}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="属性名称" min-width="100">
                        <template slot-scope="scope">
                            <el-tag
                                v-for="tag in scope.row.tags"
                                :key="tag.id"
                                :closable="true"
                                type="success"
                                @close="handleClose(tag.id)"
                                style="margin:1px;"
                                >
                                {{tag.name}}
                            </el-tag>
                        </template>
                    </el-table-column>


                    <el-table-column align="center" label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button type="success" size="small" @click="addProperty(scope.row.type)">添加</el-button>
                            <el-button type="primary" size="small" @click="editTypeTree(scope.row.type)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </template>
        <el-dialog title="选择节点标签" :visible.sync="dialogFormVisible4">
            <div style="height:600px;overflow:auto;">
                <div style="margin:15px 0;">
                    <el-input placeholder="请输入标签名称" v-model="labelForm.name">
                        <el-button slot="append" icon="el-icon-search" @click="findTagOfPage"></el-button>
                    </el-input>
                </div>
                <el-checkbox-group v-model="form.tagIds">
                    <el-table :key='tableKey' :data="labelList" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

                        <el-table-column align="center" width="30">
                            <template slot-scope="scope">
                                <el-checkbox :label="scope.row.id">1</el-checkbox>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="标签名称" min-width="150">
                            <template slot-scope="scope">
                                <span>{{scope.row.name}}</span>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-checkbox-group>
                <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                    <el-pagination
                    @size-change="handleSizeChange1"
                    @current-change="handleCurrentChange1"
                    :current-page.sync="labelForm.pageNo"
                    :page-sizes="[10,20,30, 50]"
                    :page-size="labelForm.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="count">
                    </el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer" :span="24">
                <el-button size="medium" @click="dialogFormVisible4 = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="saveLabel">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="添加属性" :visible.sync="dialogFormVisible">
            <div style="margin:15px 0;">
                <el-input placeholder="请输入内容" v-model="searchProperty">
                    <el-button slot="append" icon="el-icon-search" @click="searchFindAllByName"></el-button>
                </el-input>
            </div>
            <div style="height:400px;overflow:auto;">
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    >
                    <el-table-column
                    type="selection"
                    width="80"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="attNameId"
                    label="id"
                    align="center">

                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="名称"
                    align="center">
                    </el-table-column>

                </el-table>
            </div>

            <div slot="footer" class="dialog-footer" :span="24">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateShop">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑属性" :visible.sync="dialogFormVisible1">

            <div style="height:400px;overflow:auto;">
                <el-table
                    :data="tableData1"
                    border
                    tooltip-effect="dark"
                    style="width: 100%"
                    >

                    <el-table-column
                    prop="name"
                    label="名称"
                    align="center">
                    </el-table-column>

                    <el-table-column
                    label="排序"
                    align="center"
                    min-width="200">
                        <template slot-scope="scope">
                            <el-input-number v-model="scope.row.sortValue"></el-input-number>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="是否必填"
                    align="center">
                        <template slot-scope="scope">
                            <el-switch
                                v-model="scope.row.checked"
                                on-color="#13ce66"
                                off-color="#ff4949"
                                >
                            </el-switch>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div slot="footer" class="dialog-footer" :span="24">
                <el-button @click="dialogFormVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="updateShop1">确 定</el-button>
            </div>
        </el-dialog>
    </div>
    <div v-else-if="active==2" style="width:100%;text-align:center;">
            <img src="../../../assets/success.jpg" />
            <div><el-button style="margin-top: 12px;" @click='next2()'>完成</el-button></div>
    </div>
</template>



<script>

import {findCategoryById,deleteCategoryAttName,attributeNameByCategoryId,findAllByName,saveCategoryAttNameByCategoryId,showCategoryAttName,findTagOfPage,isRequired,modifyCategory} from '../../../api/getData';
export default {
    data() {
        return {
            active:1,
            form:{
                id:'',
                pids:'',
                name:'',
                categoryLable:'',
                description:'',
                listSort:"",
                serialNumber:"",
                tagIds:[]
            },
            rules: {
                name: [
                    { required: true, message: '请输入类目名称', trigger: 'blur' },
                    { max: 30, message: '字符长度不得超过30位', trigger: 'blur' }
                ],
                listSort: [
                    { required: true, message: '请输入类目排序',trigger: 'blur' },
                ],
                categoryLable:[
                    { required: true, message: '请输入节点标签', trigger: 'blur' }
                ],
            },
            dataSource:[
              {
                title:"商品属性",
                type:1,
                tags:[

                ]
              },
              {
                title:"商品规格",
                type:2,
                tags:[

                ]
              },
              {
                title:"参数属性",
                type:3,
                tags:[

                ]
              },
            ],
            dialogFormVisible:false,
            searchProperty:'',
            multipleTable:[],
            tableData:[],
            type:1,

            dialogFormVisible1:false,
            tableData1:[],
            labelForm:{
                name:'',
                type:2,
                pageNo:1,
                pageSize:10,
                isValid:1
            },
            labelList:[],
            checkLabel:[],
            dialogFormVisible4:false,
            dataForm:{
                tagIds:[],
                sortType:''
            },
            count:0,
            goodsStatus:[
                {
                    key:"上架时间",
                    value:"1"
                },
                {
                    key:"商品销量",
                    value:"2"
                }
            ],
            listLoading:false,
            tableKey:0,
        }
    },
    created () {
        this.findCategoryById();
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                 let str = curVal.path;
                 str = str.substring(0,13)

                 if(str == "/editTypeTree"){
                   Object.assign(this.$data, this.$options.data())
                    this.findCategoryById();

                }

            },
        }
    },
    components: {

    },

    methods:{
        //新增标签
        addLabel(){
            this.dialogFormVisible4 = true;
            this.labelForm = {
                pageNo:1,
                pageSize:10,
                name:'',
                type:2,
                isValid:1
            };

            this.findTagOfPage();
        },
        //查询所有标签
        async findTagOfPage () {
            try {
                const obj = new Object();
                this.listLoading = false;
                $.each(this.labelForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                const res = await findTagOfPage(obj);
                if (res.data.code == 0) {
                    this.count = res.data.data.totalSize;
                    this.labelList = res.data.data.list;
                    this.dialogFormVisible4 = true;
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
        //选择标签确定
        async saveLabel(){
            try {

                if(this.form.tagIds.length == 0){
                    this.$message({
                        type: 'error',
                        message: '请选择节点标签'
                    });
                    return;
                }
                const obj = new Object();
                obj.tagList = JSON.stringify(this.form.tagIds);
                obj.pageSize = this.form.tagIds.length+10;
                obj.pageNo = 1;
                const res = await findTagOfPage(obj);
                if (res.data.code == 0) {
                    this.checkLabel = res.data.data.list;
                    this.dialogFormVisible4 = false;
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
        //选择标签确定
        async initializeLabel(){
            try {
                const obj = new Object();
                obj.tagList = JSON.stringify(this.form.tagIds);
                obj.pageSize = this.form.tagIds.length+10;
                obj.pageNo = 1;
                const res = await findTagOfPage(obj);
                if (res.data.code == 0) {
                    this.checkLabel = res.data.data.list;
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
            this.form.tagIds.splice(index,1);
            this.checkLabel.splice(index,1);
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
        },
        //分页
        handleSizeChange1(val) {
            this.labelForm.pageSize = val;
            this.findTagOfPage()
        },
        handleCurrentChange1(val) {
            this.labelForm.pageNo = val;
            this.offset = (val - 1) * this.labelForm.pageSize;
            this.findTagOfPage()
        },

        async findCategoryById () {
            try {

                const res = await findCategoryById({id:this.$route.params.typeId});

                if (res.data.code == 0) {
                    let data = res.data.data;
                    this.form.id = data.id;
                    if(data.pids !== null){
                        this.form.pids = data.pids.replace(/,/g,"--");
                    }

                    this.form.name = data.name;
                    this.form.categoryLable = data.categoryLable;
                    this.form.description = data.description;
                    this.form.listSort = data.listSort;
                    this.form.listSort = data.listSort;
                    this.form.tagIds = data.tagIds;
                    this.form.serialNumber = data.serialNumber;
                    this.dataSource[0].tags = data.productAttName;
                    this.dataSource[1].tags = data.merchantProductAttName;
                    this.dataSource[2].tags = data.parameterAttNameList;
                    this.initializeLabel();
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

        //删除标签
        handleClose (id) {
             this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            }).then(() => {
              this.proDeleteAjax(id)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        },

        async proDeleteAjax (id) {
            try {
                 const res = await deleteCategoryAttName({id:id});

                 if (res.data.code == 0) {
                    this.$notify({
                        title: '删除',
                        message: '删除成功',
                        type: 'success',
                        duration: 2000
                    });
                     this.findCategoryById()
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: err
                });
            }
        },

        //添加
        addProperty ( type ) {

            this.type = type;
            this.searchProperty = '';
            this.dialogFormVisible = true;
            this.attributeNameByCategoryId();
        },
        //可选属性列表
        async attributeNameByCategoryId () {
            try {
                 this.tableData = [];
                 const res = await attributeNameByCategoryId({categoryId:this.$route.params.typeId,type:this.type});

                if (res.data.code == 0) {
                    let thtf = this;
                    $.each(res.data.data,function(key,info){
                        let obj = new Object();
                        obj.attNameId = info.id;
                        obj.name = info.name;
                        thtf.tableData.push(obj)
                    })

                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: err
                });
            }
        },

        //添加商品属性保存
        async updateShop () {
            try {

                 const res = await saveCategoryAttNameByCategoryId({categoryId:this.$route.params.typeId,type:this.type,list:JSON.stringify(this.multipleSelection)});

                if (res.data.code == 0) {
                    this.$notify({
                        title: '新增',
                        message: '新增成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.findCategoryById();
                    this.dialogFormVisible = false;

                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: err
                });
            }
        },
        handleSelectionChange(val) {

            this.multipleSelection = val;
        },

        //搜索
        async searchFindAllByName (){
            try {
                 this.tableData = [];
                 const res = await attributeNameByCategoryId({categoryId:this.$route.params.typeId,name:this.searchProperty,type:this.type});

                if (res.data.code == 0) {
                    let thtf = this;
                    $.each(res.data.data,function(key,info){
                        let obj = new Object();
                        obj.attNameId = info.id;
                        obj.name = info.name;
                        thtf.tableData.push(obj)
                    })

                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: err
                });
            }
        },

        //编辑 排序属性
        editTypeTree (type) {
            this.tableData1 = [];
            this.type = type;
            this.dialogFormVisible1 = true;
            this.showCategoryAttName();
        },
        //已选属性列表
        async showCategoryAttName () {
            try {

                const res = await showCategoryAttName({categoryId:this.$route.params.typeId,type:this.type});
                if (res.data.code == 0) {
                    this.tableData1 = res.data.data;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: err
                });
            }
        },
        //编辑商品属性保存
        async updateShop1 () {
            try {
                 const res = await isRequired({categoryId:this.$route.params.typeId,type:this.type,list:JSON.stringify(this.tableData1)});

                if (res.data.code == 0) {
                    this.$notify({
                        title: '编辑',
                        message: '编辑成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.findCategoryById();
                    this.dialogFormVisible1 = false;

                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: err
                });
            }
        },
        async modifyCategory () {
            try {
                let obj  = JSON.parse(JSON.stringify(this.form));
                obj.tagIds = JSON.stringify(obj.tagIds);
                 const res = await modifyCategory(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: '保存',
                        message: '保存成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.active++
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: err
                });
            }
        },
        next2 () {
            this.$router.push({path:'/typeTreeList'})
        }

    }


}
</script>

<style scoped>
#example {
    padding: 5px 20px;
    text-align:center;
}
</style>


