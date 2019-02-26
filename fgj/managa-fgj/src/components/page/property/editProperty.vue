<template>
    <div id="example">
        <template v-if="active==1">
            <el-form ref="form" :model="form" label-width="200px" :rules="rules">
                <el-form-item label="属性编号">
                    {{form.id}}
                </el-form-item>
                <el-form-item label="属性名称" prop="name">
                    <el-input v-model="form.name" style="width:400px"></el-input>
                </el-form-item>

                <!--<el-form-item label="规格类型" prop="mode">
                    <el-select v-model="form.type" placeholder="请选择规格类型" style="width:400px">
                        <el-option label="基本属性" value="1"></el-option>
                        <el-option label="规格属性" value="2"></el-option>
                        <el-option label="参数属性" value="3"></el-option>
                    </el-select>
                </el-form-item>-->

                <el-form-item label="属性设置" prop="specificationProperty">
                    <el-tooltip class="item" effect="dark" content="勾选后在类目下可选为规格属性" placement="right">
                        <el-checkbox v-model="form.specificationProperty" :true-label="1" :false-label="0" disabled @change="checkBoxChange">设为规格属性</el-checkbox>
                    </el-tooltip><br />
                    <el-tooltip class="item" effect="dark" content="勾选后在类目下可选为参数属性" placement="right">
                        <el-checkbox v-model="form.parameterProperty" :true-label="1" :false-label="0" disabled @change="checkBoxChange">设为参数属性</el-checkbox>
                    </el-tooltip>
                </el-form-item>

                <el-form-item label="属性值填写方式" prop="mode">
                    <el-select v-model="form.mode" placeholder="请选择填写方式" style="width:400px" disabled>
                        <el-option label="下拉单选框" value="1"  v-if="form.specificationProperty==0"></el-option>
                        <el-option label="文本输入框" value="2" v-if="form.specificationProperty==0"></el-option>
                        <el-option label="列表复选框" value="3"></el-option>
                        <el-option label="日期型" value="4" v-if="form.specificationProperty==0"></el-option>
                        <el-option label="整型" value="5" v-if="form.specificationProperty==0"></el-option>
                        <el-option label="数字型" value="6" v-if="form.specificationProperty==0"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="设置可输入文本长度" v-if="form.mode==2">
                        <el-input v-model="form.begin" style="width:80px"></el-input> 至 <el-input v-model="form.finish" style="width:80px"></el-input>
                </el-form-item>

                <el-form-item label="设置可输入数字范围" v-if="form.mode==5||form.mode==6">
                        <el-input v-model="form.begin" style="width:80px"></el-input> 至 <el-input v-model="form.finish" style="width:80px"></el-input>
                </el-form-item>

                <el-form-item label="属性单位" v-if="form.mode==5||form.mode==6">
                    <el-input v-model="form.unit" style="width:400px"></el-input>
                </el-form-item>

                <el-form-item label="输入提示设置" v-if="form.mode==5||form.mode==6">
                    <el-input v-model="form.importHint" style="width:400px"></el-input>
                </el-form-item>

                <el-form-item label="设置可选择时间范围" v-if="form.mode==4">
                    <el-date-picker
                        v-model="fishEndTime"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>

            <div v-if="form.mode==1||form.mode==3">
                <el-button type="primary" size="small" style="margin-left:100px;margin-bottom:10px;" @click="addTableCol"><i class="el-icon-plus"></i> 添加行</el-button>
                <el-table
                :data="propLists"
                border
                style="max-width:60%;margin-left:100px;">
                    <el-table-column
                    label="属性值"
                    min-width="200" prop="name">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.attValue"></el-input>
                            <span style="color:#f00;">{{scope.row.repeatWarn}}</span>
                            <span v-if="scope.row.attValue && scope.row.attValue.length>10" style="color:#f00;">字符长度不得超过10位</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="属性值排序"
                    min-width="200">
                        <template slot-scope="scope">
                            <el-input-number v-model="scope.row.sortValue"></el-input-number>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="规格码"
                    min-width="200" v-if="form.parameterProperty == 0">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.specificationCode"></el-input>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="操作"
                    align="center"
                    width="100">
                        <template slot-scope="scope">
                            <el-button type="danger" size="small" @click="delProperty(scope.$index,scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                </div>
                <div><el-button style="margin-top: 12px;margin-left:300px;" @click='uploadAjax'>完成</el-button></div>
         </template>

        <template v-else-if="active==2">
            <img src="../../../assets/success.jpg" />
        </template>
  </div>

</template>



<script>

import {updateAttributeName,attributeNameFindById,attributeValueDelete} from '../../../api/getData';
export default {
    data() {
        return {
            form:{
                name:'',
                mode:'',
                specificationProperty:0,
                parameterProperty:0,
                begin:'',
                finish:'',
                unit:'',
                importHint:'',
                id:''
            },
            propLists:[],
            active:1,
            fishEndTime:[],
            dataList:[
                {
                    value:'下拉单选框',
                    id:1
                },
                {
                    value:'文本输入框',
                    id:2
                },
                {
                    value:'列表复选框',
                    id:3
                }
            ],
            rules: {
                name: [
                    { required: true, message: '请输入属性名称', trigger: 'blur' },
                    { max: 30, message: '字符长度不得超过30位', trigger: 'blur' }
                ],
                specificationProperty:[
                    { required: true, message: '请至少选择一种属性设置', trigger: 'change'}
                ]
            },
            listattvalue:[],
            attValueArr:[]
        }
    },
    created () {
        this.attributeNameFindById();
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                 let str = curVal.path;
                 str = str.substring(0,22)

                 if(str == "/property/editProperty"){
                    Object.assign(this.$data, this.$options.data())
                    this.attributeNameFindById();

                }

            },
        }
    },
    methods:{
        //查询属性详情

        async attributeNameFindById () {
             try {
                const res = await attributeNameFindById({id:this.$route.params.propertyId});

                if (res.data.code == 0) {
                    this.form = res.data.data.attributeName;
                    this.propLists = res.data.data.lists;
                    // for(var i=0;i<this.propLists.length;i++){
                    //     this.propLists[i].repeatWarn='';
                    // }
                    console.log(this.propLists);
                    if(this.form.mode*1 == 4){
                        this.fishEndTime = [res.data.data.attributeName.begin,res.data.data.attributeName.finish];
                    }
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
        uploadAjax(){
            if(this.form.mode == 4){
                this.form.begin = this.setTimestamp(this.fishEndTime[0]);
                this.form.finish = this.setTimestamp(this.fishEndTime[1]);
            };
            this.listattvalue = [];
            this.attValueArr = [];
            for(var i = 0;i<this.propLists.length;i++){
                //this.propLists[i].repeatWarn="";
                this.listattvalue.push(this.propLists[i].attValue);
            }
            for(var j = 0;j<this.listattvalue.length;j++){
                for(var k=1;k<this.listattvalue.length;k++){
                    if(this.listattvalue[j]==this.listattvalue[k]&& j!=k){
                        this.attValueArr.push(k);
                        this.attValueArr.push(j);
                    }
                }
            }
            for(var m=0;m<this.attValueArr.length;m++){
                 this.$forceUpdate();
                 this.$set(this.propLists[this.attValueArr[m]],"repeatWarn","属性名称重复");
            }
            console.log(this.propLists);
            this.updateAttributeName();
        },
        async updateAttributeName () {
             try {
                 let obj = this.form;
                 obj.list = JSON.stringify(this.propLists)
                 const res = await updateAttributeName(obj);

                if (res.data.code == 0) {

                    this.active++;

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
        //新增行
       addTableCol(){
           let obj = new Object();
           obj = {
                  attValue:'',
                  sortValue:this.propLists.length+1,
                  specificationCode:'',
                  id:0
                }
           this.propLists.push(obj)
       },
       //删除行
       delProperty(key,id){
            if(id == 0){
                this.propLists.splice(key,1);
                //查重去掉
                this.listattvalue = [];
                this.attValueArr = [];
                for(var i = 0;i<this.propLists.length;i++){
                    this.propLists[i].repeatWarn = "";
                    this.listattvalue.push(this.propLists[i].attValue);
                }
                for(var j = 0;j<this.listattvalue.length;j++){
                    for(var k=1;k<this.listattvalue.length;k++){
                        if(this.listattvalue[j]==this.listattvalue[k]&& j!=k){
                            this.attValueArr.push(k);
                            this.attValueArr.push(j);
                        }
                    }
                }
                for(var m=0;m<this.attValueArr.length;m++){
                    this.$forceUpdate();
                    this.$set(this.propLists[this.attValueArr[m]],"repeatWarn","属性名称重复");
                }
               //console.log(this.propLists);
            }else{
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                   this.attributeValueDelete(id)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })

            }
        },
        async attributeValueDelete (id) {
            try {

                const res = await attributeValueDelete({id:id});

                if (res.data.code == 0) {
                    this.$notify({
                        title: '删除',
                        message: '删除成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.attributeNameFindById();
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
        checkBoxChange(){
            this.form.mode = '';
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

<style scoped>
#example {
    padding: 5px 20px;

}
</style>


