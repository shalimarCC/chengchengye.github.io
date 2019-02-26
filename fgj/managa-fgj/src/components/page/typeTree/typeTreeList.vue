<template>
  <div class="filter-container" id="example" v-loading="listLoading1">
    <div style="margin-bottom:20px;width:100%;text-align:right">
        <el-button class="filter-item" @click="addProduct" type="primary" icon="edit">添加</el-button>
     </div>

    <tree-grid :columns="columns" :tree-structure="true" v-on:setTableTree="setTableTree" :data-source="dataSource"></tree-grid>

    <el-dialog :title="dilogTitle" :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="form" label-width="120px" :rules="rules">
            <el-form-item label="上级菜单" prop="pId">
              <el-cascader
                :options="dataSource"
                change-on-select
                v-model="form.pids"
                :props="props"
                @change="changeSerialNumber"
              ></el-cascader>
          </el-form-item>
            <el-form-item label="类目名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>


            <el-form-item label="类目排序" prop="listSort">
                <el-input-number controls-position="right" v-model="form.listSort" :min="1" label="类目排序"></el-input-number>
            </el-form-item>

            <el-form-item label="类目编号" prop="serialNumber">
                 {{form.serialNumber}}
                 <p style="color:#f00;">{{serialNumberWarn}}</p>
                <!-- <el-input-number controls-position="right" v-model="form.serialNumber" :min="1" label="类目编号"></el-input-number> -->
            </el-form-item>

            <el-form-item label="节点标签">
                <el-tag
                :key="tag.id"
                v-for="(tag,key) in checkLabel"
                closable
                @close="tagClose(key)">
                {{tag.name}}
                </el-tag>

                <el-button class="button-new-tag" size="small" @click="addLabel">+ 添加标签</el-button>
            </el-form-item>

            <el-form-item label="类目备注">
                <el-input type="textarea" :rows="3" v-model="form.description"></el-input>
            </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateShop" :disabled="canNotCommit">确 定</el-button>
        </div>

    </el-dialog>

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

  </div>
</template>


<script>
import TreeGrid from '../../treeTable/vue/TreeGrid.vue'
import {queryAllCategoryTreeNodeByType,addCategoryTreeNode,deleteCategory,idsByCategoryId,findTagOfPage,findMaxSubSerialNumber} from '../../../api/getData';
export default {
    data() {
        var checkSerialNumber = (rule, value, callback) => {
            if (value > 99) {
                return callback(new Error('一级类目数量已满，无法增加新的一级类目'));
            }
        };
        return {
            form: {
                categoryTreeId:1,
                name: "",
                description:"",
                pids:[],
                listSort:"",
                categoryLable:"",
                serialNumber:"",
                tagIds:[],
                pnids:[]
            },
            dilogTitle :'新增类目',
            serialNumberWarn:'',
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
                serialNumber: [
                    { required: true, validator: checkSerialNumber, trigger: 'blur'},
                ],
            },
            dataSource: [],

            tableKey: 0,
            listLoading: true,
            listLoading1:true,
            dialogFormVisible: false,
            columns: [
                {
                text: '类目ID',
                dataIndex: 'categoryId'
                },
                {
                text: '类目编号',
                dataIndex: 'serialNumber'
                },
                {
                text: '类目名称',
                dataIndex: 'name'
                },
                {
                text: '类目排序',
                dataIndex: 'listSort'
                }
            ],
            props : {
                value: 'categoryTreeNodeId',
                label: 'name'
            },
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
            canNotCommit:false


        }
    },
    created() {
        this.getTreeList();
    },
    components: {
        TreeGrid
    },
    methods: {
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

        //获取列表
        async getTreeList() {
            try {

                this.listLoading = false;
                const res = await queryAllCategoryTreeNodeByType({type:1});
                if (res.data.code == 0) {
                    this.dataSource = res.data.data[0].list;
                    this.listLoading1 = false;

                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });

                this.listLoading1 = false;
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

                this.listLoading1 = false;

            }
        },

         //分页
        handleSizeChange(val) {
            this.limit = val;
            this.getUserList()
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.offset = (val - 1) * this.limit;
            this.getUserList()
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

        //新增类目树
        addProduct () {
            this.dialogFormVisible = true;
            this.dilogTitle = '新增类目';
            this.checkLabel = [];
            this.form = {
                categoryTreeId:1,
                name: "",
                description:"",
                pids:[],
                listSort:"",
                categoryLable:"",
                serialNumber:"",
                tagIds:[]
            };
            let obj  = JSON.parse(JSON.stringify(this.form));
            obj.pids = JSON.stringify(obj.pids.pop());
            obj.tagIds = JSON.stringify(obj.tagIds);
            obj.categoryTreeId = JSON.stringify(obj.categoryTreeId)
            this.findMaxSubSerialNumber(obj.categoryTreeId,obj.pids);
            console.log(this.form);

        },
        //新增类目树序列号按父级序列号变化
        changeSerialNumber() {
            let obj  = JSON.parse(JSON.stringify(this.form));
            obj.pids = JSON.stringify(obj.pids.pop());
            //obj.pids = JSON.stringify(obj.pids);
            obj.tagIds = JSON.stringify(obj.tagIds);
            obj.categoryTreeId = JSON.stringify(obj.categoryTreeId)
            this.findMaxSubSerialNumber(obj.categoryTreeId,obj.pids);
            console.log(obj.pids);
        },
        //获取类目序列号
        async findMaxSubSerialNumber(categoryTreeId,id) {
            try{
                let obj  = JSON.parse(JSON.stringify(this.form));
                obj.tagIds = JSON.stringify(obj.tagIds);
                obj.categoryTreeId = JSON.stringify(obj.categoryTreeId)
                const res = await findMaxSubSerialNumber({categoryTreeId:categoryTreeId,parentId:id});
                if(res.data.code == 0){
                    console.log(res.data.data);
                    this.serialNumberWarn = "";
                    this.form.serialNumber = res.data.data;
                    this.canNotCommit = false;
                }else{
                    this.form.serialNumber="";
                    this.serialNumberWarn = res.data.error;
                    this.canNotCommit = true;
                    // this.$message({
                    //     type: 'error',
                    //     message: res.data.error
                    // });

                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: '数据获取失败'
                });
            }
        },

        async updateShop () {
            try {
                let obj  = JSON.parse(JSON.stringify(this.form));
                obj.pids = JSON.stringify(obj.pids);
                obj.tagIds = JSON.stringify(obj.tagIds);
                const res = await addCategoryTreeNode(obj);

                if (res.data.code == 0) {
                    console.log(res);
                    this.$notify({
                        title: '新增',
                        message: '新增成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.getTreeList();
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

        setTableTree(arr){
            const type = arr[1];
            const categoryId = arr[0];
            if(type==2){
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                    }).then(() => {
                    this.tableTreeDelete(categoryId)
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            }else if(type==3){
        //添加下级
                this.checkLabel = [];
                this.dilogTitle = '添加下级';
                this.form = {
                    categoryTreeId:1,
                    name: "",
                    description:"",
                    pids:[],
                    listSort:"",
                    categoryLable:"",
                    serialNumber:"",
                    tagIds:[]
                };
                //this.tableTreeAdd(categoryId);
                this.tableTreeAdd2(categoryId);
                console.log(this.form);
            }else{
                this.$router.push({path:"/editTypeTree/"+categoryId});
            }
        },

        //删除
        async tableTreeDelete (id){
            const res = await deleteCategory({id:id});
            if(res.data.code==0){
                this.$notify({
                    title: '删除',
                    message: '删除成功',
                    type: 'success',
                    duration: 2000
                });
                this.getTreeList();
            }else{

                this.$message({
                    type: 'error',
                    message: res.data.error
                });
            }
        },
       async  tableTreeAdd2 (id) {
            this.dialogFormVisible = true;
            const res = await idsByCategoryId({categoryId:id});
            if(res.data.code==0){
                this.form.pids = res.data.data;
                console.log(this.form.pids);
                let obj  = JSON.parse(JSON.stringify(this.form));
                obj.pids = JSON.stringify(obj.pids.pop());
                obj.tagIds = JSON.stringify(obj.tagIds);
                obj.categoryTreeId = JSON.stringify(obj.categoryTreeId)
                this.findMaxSubSerialNumber(obj.categoryTreeId,obj.pids);
            }else{
                this.$message({
                    type: 'error',
                    message: res.data.error
                });
            }
            console.log(this.form.pids);
        }

    }
}
</script>

<style>
#example {
    padding: 5px 20px;
}
.el-cascader-menu{
    width:300px;
}
</style>


