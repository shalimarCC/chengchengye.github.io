<template>
  <div id="example">
    <div id="btn-list">

      <el-button class="filter-item" style="float:left;" type="primary" @click="findImportTemplateDictUrlByType" icon="edit" size="medium">下载模板</el-button>
      <el-button class="filter-item" style="float:left;" type="primary" @click="outImportDepartment" icon="edit" size="medium">导出</el-button>
      <el-upload
        class="upload-demo"
        style="float:left; margin-right:20px;"
        :action="basePath"
        :onError="uploadError"
        :onSuccess="uploadSuccess"
        :data="dataForm"
        :headers="dataHeaders"
        :beforeUpload="beforeAvatarUpload">
        <el-button class="filter-item" size="medium" type="primary">导入</el-button>
        <div slot="tip" class="el-upload__tip">导入新的组织架构后原有组织架构将会被删除，请确认后再导入</div>
        </el-upload>
    </div>

    <tree-grid :columns="columns" :tree-type="treeType" :tree-structure="true" :data-source="dataSource"></tree-grid>

    <el-dialog title="浏览上传数据" :visible.sync="dialogFormVisible">
        <div>
            <span>公司名称:{{department.importRecordsInfo.companyName}}</span>&nbsp;&nbsp;
            <span>模板类型:{{department.importRecordsInfo.templateType}}</span>&nbsp;&nbsp;
            <span>创建时间:{{setTime(department.importRecordsInfo.generatedTime)}}</span>&nbsp;&nbsp;
            <span>文件序号:{{department.importRecordsInfo.fileSequenceNumber}}</span>&nbsp;&nbsp;
        </div>
        <el-table :data="department.overView" border fit highlight-current-row style="width: 100%">

            <el-table-column align="center" label="部门名称" min-width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.department}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="上级部门" min-width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.superiorDepartment}}</span>
                </template>
            </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="assureImportDepartmentAll">确 定</el-button>
        </div>
    </el-dialog>


  </div>

</template>

<script>
import TreeGrid from '../../treeTable/vue/TreeGrid.vue'
import { baseUrl } from '../../../config/env'
import CryptoJS from 'crypto-js/core'
import MD5 from 'crypto-js/md5'
import Cookie from '../../../config/mUtils'
import { depTreeByCompany ,assureImportDepartmentAll ,outImportDepartment,findImportTemplateDictUrlByType} from '../../../api/getData';
export default {
  name: 'example',
    data () {
        return {
            columns: [
                {
                text: '部门编号',
                dataIndex: 'id'
                },
                {
                text: '部门名称',
                dataIndex: 'name'
                }
            ],
            basePath:'',
            dataSource:[],
            dataForm:{
                companyId:'',
                pageSize:10,
                pageNo:1
            },
            dataHeaders:{
                platformId:'',
                ut:'',
                Authorization:'',
                clientId:'',
                companyId:'',
                f:'',
                phoneModel:'',
                os:'',
                v:'',
                deviceId:''
            },
            offset: 0,
            limit: 10,
            count: null,
            currentPage: 1,
            dialogFormVisible:false,
            props : {
                value: 'id',
                label: 'departmentName'
            },
            department:{
                importRecordsInfo:{
                    companyName:'',
                    templateType:'',
                    generatedTime:'',
                    fileSequenceNumber:'',
                },

                overView:[],

            },
           // treeType:1,
            treeType:'1'
        }
    },

    created(){
        this.dataHeaders.ut = this.$store.state.Cookie.mutations.fetch().cookieValue;
        this.dataHeaders.platformId = this.$store.state.Cookie.mutations.fetch().platformId;
        this.dataHeaders.Authorization = `${CryptoJS.MD5(Cookie.mutations.fetch().cookieValue + Cookie.mutations.fetch().id).toString()}`;;
        this.dataHeaders.clientId = 3;
        this.dataHeaders.companyId = `${"1"}`;
        this.dataHeaders.f = `${"3"}`;
        this.dataHeaders.phoneModel = `${"1.0.0"}`;
        this.dataHeaders.os = `${"1.0.0"}`;
        this.dataHeaders.v = `${"1.0.0"}`;
        this.dataHeaders.deviceId = `${"0001"}`;
        this.basePath = baseUrl+"/back-user-web/user/department/insertDepartmentWithTx.do";
        this.depTreeByCompany();
        this.dataForm.companyId = this.$route.params.id;
    },
    components: {
        TreeGrid
    },
    watch : {
        dialogFormVisible:function(val){
            if(val){
                return;
            }else{
                this.depTreeByCompany()
            }
        },
        "$route": {
            handler(curVal,oldVal){
                let str = curVal.path;
                str = str.substring(0,8)
                if(str == "/section"){
                    this.depTreeByCompany();
                }

　　　　　　 },
            deep:true
        }
    },
  methods: {
    //获取菜单列表
    async depTreeByCompany(){

        try{
            const res = await depTreeByCompany({companyId:this.$route.params.id});
            if(res.data.code == 0){
                this.count = res.data.data.totalSize;
                this.dataSource = res.data.data.tree;

            }else{
                this.$message({
                    type: 'error',
                    message: res.data.error
                });
            }
        }catch(err){
          this.$message({
              type: 'error',
              message: '获取数据失败,请联系管理员！404'
          });

        }
    },

    // //分页
    // handleSizeChange(val) {
    //     this.dataForm.pageSize = val;
    //     this.depTreeByCompany();
    // },
    // handleCurrentChange(val) {
    //     this.dataForm.pageNo = val;
    //     this.offset = (val - 1)*this.dataForm.pageSize;
    //     this.depTreeByCompany()
    // },



    //下载模板
    async findImportTemplateDictUrlByType(){

        try{
            const res = await findImportTemplateDictUrlByType({type:0});
            if(res.data.code == 0){
                this.$notify({
                    title: '成功',
                    message: '下载模板成功',
                    type: 'success',
                    duration: 2000
                });
                window.open(res.data.data);
            }else{
                this.$message({
                    type: 'error',
                    message: res.data.error
                });
            }
        }catch(err){
            this.$message({
                type: 'error',
                message: '获取数据失败,请联系管理员！404'
            });
        }
    },

    //导出
    async outImportDepartment(){

        try{
            const res = await outImportDepartment({companyId:this.$route.params.id});
            if(res.data.code == 0){
                this.$notify({
                    title: '成功',
                    message: '导出成功',
                    type: 'success',
                    duration: 2000
                });
                window.open(res.data.data);
            }else{
                this.$message({
                    type: 'error',
                    message: res.data.error
                });
            }
        }catch(err){
          this.$message({
              type: 'error',
              message: '获取数据失败,请联系管理员！404'
          });

        }
    },



    //保存
    async assureImportDepartmentAll(){
        try {

            const res = await assureImportDepartmentAll({companyId:this.dataForm.companyId,departmentTempListIdStr:this.department.departmentTempListIdStr,importRecordId:this.department.importRecordId});

            if(res.data.code==0){
                this.$notify({
                    title: '成功',
                    message: '导入成功',
                    type: 'success',
                    duration: 2000
                });
                this.dialogFormVisible = false;

            }else{

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
    },async assureImportDepartmentAll(){
        try {

            const res = await assureImportDepartmentAll({companyId:this.dataForm.companyId,departmentTempListIdStr:this.department.departmentTempListIdStr,importRecordId:this.department.importRecordId});

            if(res.data.code==0){
                this.$notify({
                    title: '成功',
                    message: '导入成功',
                    type: 'success',
                    duration: 2000
                });
                this.dialogFormVisible = false;

            }else{

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
    // 上传成功后的回调
    uploadSuccess (response, file, fileList) {
        if(response.code == 0){
            if(response.data.type==0){
                this.department = response.data.success;
                this.dialogFormVisible = true;
            }else{
                window.open(response.data.problemRep);
            }

        }else{
            this.$message({
                type: 'error',
                message: response.error
            });
        }

    },
    // 上传错误
    uploadError (response, file, fileList) {
      console.log('上传失败，请重试！')
    },
    // 上传前对文件的大小的判断
    beforeAvatarUpload (file) {
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!extension && !extension2 ) {
        alert('上传模板只能是 xls、xlsx、doc、docx 格式!')
      }
      if (!isLt2M) {
        alert('上传模板大小不能超过 5MB!')
      }
      return extension || extension2 && isLt2M
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#example{
  padding:10px 20px;
}
#btn-list{
  margin-bottom:10px;
}

ul{
  overflow: auto;
  height:400px;
}
li{
  float:left;
  margin:5px;
  width:2.5rem;
  height:2.5rem;
  box-sizing:border-box;
  -moz-box-sizing:border-box;
   /* Firefox */
   -webkit-box-sizing:border-box;
}
li:hover{
    border:1px solid #13CE66;
}
.active{
    border:1px solid #FF4949;
}

.el-cascader{
  width:100%;
}
</style>
